const test = require('node:test');
const assert = require('node:assert/strict');
const { ExerciseManager } = require('../js/exercises.js');
const { PlayfairCore: core } = require('../js/cipher.js');

const data = [
    ['decrypt-01', '', 'KCNVMP', 'HELLO'],
    ['decrypt-02', '', 'UCBSDU', 'SECRET'],
    ['decrypt-03', 'ANIMAL', 'BNSY', 'CAT'],
    ['mystery-01', '', 'KCNVMP', 'HELLO'],
    ['mystery-02', 'SECRET', 'ITCSITEUOHAMCZ', 'MEET ME TONIGHT'],
    ['mystery-03', 'MILITARY', 'MAAMDHMAKDUP', 'ATTACK AT DAWN']
];

for (const [id, keyword, ciphertext, answer] of data) {
    test(`B-3 data and standard encryption: ${id}`, () => {
        const manager = new ExerciseManager();
        const item = [...manager.getPractices(), ...manager.getChallenges('decryption')].find(item => item.id === id);
        assert.equal(item.keyword || '', keyword);
        assert.equal(item.ciphertext, ciphertext);
        assert.equal(item.answer, answer);
        assert.equal(core.encrypt(core.matrixFromKeyword(keyword), answer).ciphertext, item.ciphertext);
    });
}

const answerCases = [
    ['mystery-01', 'hello', '', 'correct'],
    ['mystery-01', 'HELXLO', '', 'correct'],
    ['mystery-01', 'He llo', '', 'correct'],
    ['mystery-01', 'HELLOX', '', 'incorrect'],
    ['mystery-02', 'MEET ME TONIGHT', '', 'wrong-key'],
    ['mystery-02', 'meetmetonight', 'SECRET', 'correct'],
    ['mystery-02', 'MEETMETONIGHTX', 'SECRET', 'correct'],
    ['mystery-02', 'MEET ME TONIGHT', 'SECRET', 'correct'],
    ['mystery-03', 'ATTACK DAWN', 'MILITARY', 'incorrect'],
    ['mystery-03', 'ATTACK AT DAWN', 'MILITARY', 'correct'],
    ['mystery-02', '! 123', '', 'empty']
];

for (const [id, input, keyword, expected] of answerCases) {
    test(`B-4 answer: ${id} / ${input} / ${keyword || 'default'}`, () => {
        const result = new ExerciseManager().validateAnswer(id, input, core.matrixFromKeyword(keyword));
        assert.equal(result.result, expected);
        assert.equal(typeof result.points, 'number');
        assert.equal('message' in result, false);
    });
}

test('encryption challenges have the specified IDs and examples keep their keys', () => {
    const manager = new ExerciseManager();
    assert.deepEqual(manager.getChallenges('encryption').map(item => item.id), ['encipher-01', 'encipher-02', 'encipher-03']);
    assert.equal(manager.getExpectedCiphertext, undefined);
    assert.equal(manager.getExamples('encryption').length, 8);
    for (const challenge of manager.getChallenges('decryption')) {
        assert.equal(challenge.hints.length, 4);
        challenge.hints.forEach((key, index) => assert.equal(key, `challenge.${challenge.id}.hint.${index}`));
    }
});

const encipherCases = [
    ['encipher-01', '', 'SHEEP', 'SHEXEP', ['SH', 'EX', 'EP'], ['column', 'rectangle', 'column'], 'XNCZKU', [3], 10],
    ['encipher-02', 'CIPHER', 'HIDE THE MAP', 'HIDETHEMAP', ['HI', 'DE', 'TH', 'EM', 'AP'],
        ['row', 'rectangle', 'column', 'rectangle', 'rectangle'], 'EPFHYDHNBI', [], 20],
    ['encipher-03', 'SECRET', 'ATTACK THE HILL', 'ATTACKTHEHILLX', ['AT', 'TA', 'CK', 'TH', 'EH', 'IL', 'LX'],
        ['rectangle', 'rectangle', 'column', 'rectangle', 'rectangle', 'row', 'rectangle'], 'GSSGDPSMSIKMKY', [13], 30]
];

for (const [id, keyword, plaintext, prepared, pairs, rules, ciphertext, inserted, points] of encipherCases) {
    test(`Challenges G-1 exact encipher data and answer validation: ${id}`, () => {
        const manager = new ExerciseManager();
        const item = manager.getChallenges('encryption').find(item => item.id === id);
        assert.equal(item.keyword, keyword);
        assert.equal(item.plaintext, plaintext);
        assert.equal(item.points, points);
        assert.equal(Object.hasOwn(item, 'ciphertext'), false);
        const result = manager.encipherResult(id);
        assert.equal(result.prepared, prepared);
        assert.deepEqual(result.pairs, pairs);
        assert.deepEqual(result.rules, rules);
        assert.deepEqual(result.inserted, inserted);
        assert.equal(result.ciphertext, ciphertext);
        assert.deepEqual(manager.validateEncipher(id, ciphertext), { result: 'correct', points });
        assert.deepEqual(manager.validateEncipher(id, ciphertext.toLowerCase().match(/../g).join(' - ')), { result: 'correct', points });
        assert.deepEqual(manager.validateEncipher(id, 'A' + ciphertext.slice(1)), { result: 'incorrect', points: 0 });
        assert.deepEqual(manager.validateEncipher(id, '123 !'), { result: 'empty', points: 0 });
    });
}

test('Challenges G-1 PT-109 exact source data, normalization, standard error and no-change decryption', () => {
    const manager = new ExerciseManager();
    const item = manager.getHistoryChallenge();
    const matrix = core.matrixFromKeyword(item.keyword);
    assert.equal(item.keyword, 'ROYAL NEW ZEALAND NAVY');
    assert.equal(matrix, 'ROYALNEWZDVBCFGHIKMPQSTUX');
    assert.equal(item.points, 30);
    assert.equal(item.ciphertext, 'KXJEY UREBE ZWEHE WRYTU HEYFS KREHE GOYFI WTTTU OLKSY CAJPO '
        + 'BOTEI ZONTX BYBWT GONEY CUZWR GDSON SXBOU YWRHE BAAHY USEDQ');
    assert.equal(core.normalize(item.ciphertext), 'KXIEYUREBEZWEHEWRYTUHEYFSKREHEGOYFIWTTTUOLKSYCAIPOBOTEIZONTXBYBWTGONEYCUZWRGDSONSXBOUYWRHEBAAHYUSEDQ');
    assert.deepEqual(core.decrypt(matrix, item.ciphertext), { ok: false, error: { key: 'error.double-pair', params: { pair: 'TT' } } });
    assert.equal(core.decrypt(matrix, item.ciphertext, { variant: 'no-change' }).plaintext,
        'PTBOATONEOWENINELOSTINACTIONINBLACKETTSTRAITTWOMILESSWMERESUCOCEXCREWOFTWELVEXREQUESTANYINFORMATIONX');
    assert.deepEqual(item.hints, [0, 1, 2, 3].map(index => `challenge.history-01.hint.${index}`));
});

test('Challenges G-1 PT-109 answer, wrong key and fixed points without progress side effects', () => {
    const manager = new ExerciseManager();
    const matrix = core.matrixFromKeyword('ROYAL NEW ZEALAND NAVY');
    for (const answer of ['109', ' 109 ', 'ONE OWE NINE', 'one owe nine']) {
        assert.deepEqual(manager.validateAnswer('history-01', answer, matrix), { result: 'correct', points: 30 });
        assert.deepEqual(manager.validateAnswer('history-01', answer, core.ALPHABET), { result: 'wrong-key', points: 0 });
    }
    for (const answer of ['108', 'ONE ZERO NINE', '1090']) {
        assert.deepEqual(manager.validateAnswer('history-01', answer, matrix), { result: 'incorrect', points: 0 });
    }
    assert.deepEqual(manager.validateAnswer('history-01', '', matrix), { result: 'empty', points: 0 });
    assert.deepEqual(manager.validateEncipher('missing', 'AB'), { result: 'incorrect', points: 0 });
    assert.equal(manager.progress, undefined);
});

test('answer validation has no progress side effects and always returns the challenge points', () => {
    const manager = new ExerciseManager();
    for (let i = 0; i < 2; i += 1) {
        assert.deepEqual(manager.validateAnswer('mystery-01', 'HELLO', core.ALPHABET), { result: 'correct', points: 10 });
    }
    assert.equal(manager.getProgress, undefined);
    assert.equal(manager.progress, undefined);
});
