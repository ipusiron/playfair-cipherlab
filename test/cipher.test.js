const test = require('node:test');
const assert = require('node:assert/strict');
const { PlayfairCore: core, PlayfairCipher } = require('../js/cipher.js');

const matrixCases = [
    ['PLAYFAIR EXAMPLE', 'PLAYFIREXMBCDGHKNOQSTUVWZ'],
    ['SECRET', 'SECRTABDFGHIKLMNOPQUVWXYZ'],
    ['MILITARY', 'MILTARYBCDEFGHKNOPQSUVWXZ'],
    ['ANIMAL', 'ANIMLBCDEFGHKOPQRSTUVWXYZ'],
    ['jazz', 'IAZBCDEFGHKLMNOPQRSTUVWXY'],
    ['Hello World!', 'HELOWRDABCFGIKMNPQSTUVXYZ']
];

for (const [keyword, expected] of matrixCases) {
    test(`A-5 matrix: ${keyword}`, () => {
        assert.equal(core.matrixFromKeyword(keyword), expected);
        const result = new PlayfairCipher().generateMatrixFromKeyword(keyword);
        assert.equal(result.matrix.flat().join(''), expected);
        assert.equal(result.keywordLength, new Set(core.normalize(keyword)).size);
    });
}

const prepareCases = [
    ['SEEN', 'X', 'SEEN', []],
    ['HELLO', 'X', 'HELXLO', [3]],
    ['BALLOON', 'X', 'BALXLOON', [3]],
    ['FOXX', 'X', 'FOXQXQ', [3, 5]],
    ['XX', 'X', 'XQXQ', [1, 3]],
    ['X', 'X', 'XQ', [1]],
    ['EXXE', 'X', 'EXXE', []],
    ['COMMITTEE', 'X', 'COMXMITXTEEX', [3, 7, 11]],
    ['MEET ME TONIGHT', 'X', 'MEETMETONIGHTX', [13]],
    ['Hide the gold in the tree stump', 'X', 'HIDETHEGOLDINTHETREXESTUMP', [19]],
    ['jump', 'X', 'IUMP', []],
    ['', 'X', '', []],
    ['BALLOON', 'Q', 'BALQLOON', [3]],
    ['QQ', 'Q', 'QXQX', [1, 3]],
    ['HELLO', 'Z', 'HELZLO', [3]],
    ['JAZZ', 'Z', 'IAZXZX', [3, 5]]
];

for (const [input, padChar, text, inserted] of prepareCases) {
    test(`A-6 prepare: ${input}, ${padChar}`, () => {
        assert.deepEqual(core.prepare(input, padChar), { text, inserted });
        const result = core.encrypt(core.ALPHABET, input, { padChar });
        assert.equal(result.prepared, text);
        assert.deepEqual(result.inserted, inserted);
        assert.deepEqual(result.pairs, text.match(/../g) || []);
        assert.equal(core.decrypt(core.ALPHABET, result.ciphertext).plaintext, text);
    });
}

const encryptionCases = [
    ['', 'SEEN', 'SE EN', 'rectangle,rectangle', 'UCCP'],
    ['', 'HELLO', 'HE LX LO', 'rectangle,rectangle,row', 'KCNVMP'],
    ['', 'BALLOON', 'BA LX LO ON', 'row,rectangle,row,row', 'CBNVMPPO'],
    ['', 'FOXX', 'FO XQ XQ', 'rectangle,rectangle,rectangle', 'ILVSVS'],
    ['', 'SECRET', 'SE CR ET', 'rectangle,rectangle,rectangle', 'UCBSDU'],
    ['', 'CIPHER', 'CI PH ER', 'rectangle,rectangle,rectangle', 'DHNKBU'],
    ['', 'CAT', 'CA TX', 'row,rectangle', 'DBSY'],
    ['', 'ATTACK AT DAWN', 'AT TA CK AT DA WN',
        'rectangle,rectangle,rectangle,rectangle,row,rectangle', 'DQQDEHDQEBXM'],
    ['', 'MEET ME TONIGHT', 'ME ET ME TO NI GH TX',
        'rectangle,rectangle,rectangle,column,rectangle,row,rectangle', 'PBDUPBYTOHHISY'],
    ['', 'RETREAT IMMEDIATELY', 'RE TR EA TI MX ME DI AT EL YX',
        'rectangle,row,row,column,rectangle,rectangle,column,rectangle,rectangle,row', 'UBUSABYONWPBIODQAPZY'],
    ['', 'THE QUICK BROWN FOX', 'TH EQ UI CK BR OW NF OX',
        'rectangle,rectangle,rectangle,rectangle,column,rectangle,rectangle,rectangle', 'SIAUTKEHGWMYLHNY'],
    ['PLAYFAIR EXAMPLE', 'Hide the gold in the tree stump', 'HI DE TH EG OL DI NT HE TR EX ES TU MP',
        'rectangle,column,rectangle,rectangle,rectangle,rectangle,rectangle,rectangle,rectangle,row,rectangle,row,rectangle',
        'BMODZBXDNABEKUDMUIXMMOUVIF'],
    ['SECRET', 'MEET ME TONIGHT', 'ME ET ME TO NI GH TX',
        'rectangle,row,rectangle,rectangle,rectangle,rectangle,rectangle', 'ITCSITEUOHAMCZ'],
    ['MILITARY', 'ATTACK AT DAWN', 'AT TA CK AT DA WN', 'row,row,rectangle,row,column,rectangle', 'MAAMDHMAKDUP'],
    ['ANIMAL', 'CAT', 'CA TX', 'rectangle,rectangle', 'BNSY']
];

for (const [keyword, input, pairText, ruleText, ciphertext] of encryptionCases) {
    test(`A-7 standard: ${keyword || 'default'} / ${input}`, () => {
        const matrix = core.matrixFromKeyword(keyword);
        const result = core.encrypt(matrix, input);
        assert.equal(result.ciphertext, ciphertext);
        assert.equal(result.prepared, pairText.replace(/ /g, ''));
        assert.deepEqual(result.pairs, pairText.split(' '));
        assert.deepEqual(result.rules, ruleText.split(','));
        assert.deepEqual(result.inserted, core.prepare(input).inserted);
        assert.deepEqual(result.outPairs, ciphertext.match(/../g));
        const decoded = core.decrypt(matrix, ciphertext);
        assert.equal(decoded.ok, true);
        assert.equal(decoded.plaintext, result.prepared);
        assert.deepEqual(decoded.pairs, result.outPairs);
        assert.deepEqual(decoded.outPairs, result.pairs);
        assert.deepEqual(decoded.rules, result.rules);
    });
}

const variants = ['no-change', 'right-shift', 'bottom-right'];
const variantCases = [
    ['HELLO', 'HELLOX', [5], 'KCLLNY', 'KCMMNY', 'KCRRNY'],
    ['BALLOON', 'BALLOONX', [7], 'CBLLOOSC', 'CBMMPPSC', 'CBRRUUSC'],
    ['SEEN', 'SEEN', [], 'UCCP', 'UCCP', 'UCCP'],
    ['FOXX', 'FOXX', [], 'ILXX', 'ILYY', 'ILDD'],
    ['EE', 'EE', [], 'EE', 'AA', 'FF'],
    ['ZZ', 'ZZ', [], 'ZZ', 'VV', 'AA'],
    ['X', 'XQ', [1], 'VS', 'VS', 'VS']
];

for (const [input, prepared, inserted, ...outputs] of variantCases) {
    variants.forEach((variant, index) => {
        test(`A-8 variant: ${variant} / ${input}`, () => {
            assert.deepEqual(core.prepareNoSplit(input), { text: prepared, inserted });
            const result = core.encrypt(core.ALPHABET, input, { variant });
            assert.equal(result.prepared, prepared);
            assert.deepEqual(result.inserted, inserted);
            assert.deepEqual(result.pairs, prepared.match(/../g));
            assert.equal(result.ciphertext, outputs[index]);
            assert.deepEqual(result.outPairs, outputs[index].match(/../g));
            const decoded = core.decrypt(core.ALPHABET, result.ciphertext, { variant });
            assert.equal(decoded.ok, true);
            assert.equal(decoded.plaintext, prepared);
            assert.deepEqual(decoded.rules, result.rules);
        });
    });
}

const candidateCases = [
    ['HELXLO', [3], 'HELLO'],
    ['MEETMETONIGHTX', [13], 'MEETMETONIGHT'],
    ['RETREATIMXMEDIATELYX', [9, 19], 'RETREATIMMEDIATELY'],
    ['HIDETHEGOLDINTHETREXESTUMP', [19], 'HIDETHEGOLDINTHETREESTUMP'],
    ['SECRET', [], 'SECRET'],
    ['THEQUICKBROWNFOX', [15], 'THEQUICKBROWNFO']
];

for (const [plain, positions, stripped] of candidateCases) {
    test(`A-7 padding candidates: ${plain}`, () => {
        assert.deepEqual(core.paddingCandidates(plain), positions);
        assert.equal(core.stripCandidates(plain, positions), stripped);
    });
}

test('A-8 standard decryption errors and variant recovery', () => {
    assert.deepEqual(core.decrypt(core.ALPHABET, 'ABC'), {
        ok: false, error: { key: 'error.odd-length', params: {} }
    });
    assert.deepEqual(core.decrypt(core.ALPHABET, 'AABB'), {
        ok: false, error: { key: 'error.double-pair', params: { pair: 'AA' } }
    });
    assert.equal(core.decrypt(core.ALPHABET, 'KCMMNY', { variant: 'right-shift' }).plaintext, 'HELLOX');
});

test('normalization, validation keys, and matrix adapters', () => {
    assert.equal(core.normalize('JazZ! 123'), 'IAZZ');
    assert.deepEqual(core.validateKeyword('SECRET'), { valid: true });
    assert.deepEqual(core.validateMatrix(core.ALPHABET), { valid: true });
    for (const [value, key] of [['', 'error.keyword-empty'], ['KEY!', 'error.keyword-chars']]) {
        const result = core.validateKeyword(value);
        assert.equal(result.valid, false);
        assert.equal(result.error.key, key);
        assert.equal(typeof result.error.params, 'object');
    }
    for (const [value, key] of [
        ['J', 'error.matrix-j'], ['ABC', 'error.matrix-length'], ['A'.repeat(25), 'error.matrix-duplicate']
    ]) {
        const result = core.validateMatrix(value);
        assert.deepEqual(result, { valid: false, error: { key, params: {} } });
    }
    const cipher = new PlayfairCipher();
    assert.equal(cipher.getMatrix().flat().join(''), core.ALPHABET);
    cipher.setMatrix(cipher.textToMatrix(core.matrixFromKeyword('SECRET')));
    assert.equal(core.normalize(cipher.matrixToText()), core.matrixFromKeyword('SECRET'));
    assert.deepEqual(cipher.findPosition('S'), { row: 0, col: 0 });
    assert.equal(cipher.findPosition('J'), null);
    assert.equal(cipher.encrypt('MEET ME TONIGHT').ciphertext, 'ITCSITEUOHAMCZ');
    assert.equal(cipher.decrypt('ITCSITEUOHAMCZ').plaintext, 'MEETMETONIGHTX');
});

test('200 fixed-seed plaintexts: even length, no double pairs, and roundtrip', () => {
    let seed = 0x20260924;
    const next = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed;
    };
    for (let index = 0; index < 200; index += 1) {
        const length = next() % 101;
        let plain = '';
        for (let n = 0; n < length; n += 1) plain += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[next() % 26];
        const matrix = core.matrixFromKeyword(plain.slice(0, 10));
        const result = core.encrypt(matrix, plain);
        assert.equal(result.ciphertext.length % 2, 0);
        assert.ok(result.outPairs.every(pair => pair[0] !== pair[1]));
        assert.equal(core.decrypt(matrix, result.ciphertext).plaintext, result.prepared);
    }
});
