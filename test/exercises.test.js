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

test('encryption challenges are removed and examples use keys', () => {
    const manager = new ExerciseManager();
    assert.deepEqual(manager.getChallenges('encryption'), []);
    assert.equal(manager.getExpectedCiphertext, undefined);
    assert.equal(manager.getExamples('encryption').length, 8);
    for (const challenge of manager.getChallenges('decryption')) {
        assert.equal(challenge.hints.length, 4);
        challenge.hints.forEach((key, index) => assert.equal(key, `challenge.${challenge.id}.hint.${index}`));
    }
});

test('answer validation has no progress side effects and always returns the challenge points', () => {
    const manager = new ExerciseManager();
    for (let i = 0; i < 2; i += 1) {
        assert.deepEqual(manager.validateAnswer('mystery-01', 'HELLO', core.ALPHABET), { result: 'correct', points: 10 });
    }
    assert.equal(manager.getProgress, undefined);
    assert.equal(manager.progress, undefined);
});
