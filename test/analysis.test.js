const test = require('node:test');
const assert = require('node:assert/strict');
const { PlayfairAnalysis: analysis } = require('../js/analysis.js');
const { PlayfairCore: core } = require('../js/cipher.js');

const examples = [
    ['TCITIGCTSMCTCBBCCT', 'TCITIGCTSMCTCBBCCT', [], [true, true, true], [], [
        { pair: 'CT', reverse: 'TC', at: [3, 5, 8], reverseAt: [0] },
        { pair: 'BC', reverse: 'CB', at: [7], reverseAt: [6] }
    ], 'consistent'],
    ['BMODZ BXDNA BEKUD MUIXM MOUVI F', 'BMODZBXDNABEKUDMUIXMMOUVIF', [], [true, true, true], [], [], 'consistent'],
    ['KCNVMP', 'KCNVMP', [], [true, true, true], [], [], 'consistent'],
    ['KCMMNY', 'KCMMNY', [], [true, true, false], [{ pair: 'MM', index: 1 }], [], 'impossible'],
    ['ABC', 'ABC', [], [false, true, true], [], [], 'impossible'],
    ['JUMP', 'JUMP', [], [true, false, true], [], [], 'impossible'],
    ['Khoor, Zruog!', 'KHOORZRUOG', [',', '!'], [true, true, false], [{ pair: 'OO', index: 1 }], [], 'impossible'],
    [' \t\n ', '', [], [true, true, true], [], [], 'empty']
];

for (const [input, letters, ignored, checks, doubles, reversed, verdict] of examples) {
    test(`B-4 analysis: ${JSON.stringify(input)}`, () => {
        const actual = analysis.analyze(input);
        assert.equal(actual.letters, letters);
        assert.equal(actual.length, letters.length);
        assert.deepEqual(actual.ignored, ignored);
        assert.deepEqual(actual.checks, { even: checks[0], noJ: checks[1], noDoublePair: checks[2] });
        assert.deepEqual(actual.doubles, doubles);
        assert.deepEqual(actual.reversed, reversed);
        assert.equal(actual.verdict, verdict);
    });
}

test('B-4 pair frequency, distinct letters and both reverse decryptions', () => {
    const actual = analysis.analyze('TCITIGCTSMCTCBBCCT');
    assert.deepEqual(actual.topPairs, [['CT', 3], ['BC', 1], ['CB', 1], ['IG', 1], ['IT', 1]]);
    assert.equal(actual.distinct, 7);
    const matrix = 'SECRTABDFGHIKLMNOPQUVWXYZ';
    assert.deepEqual(analysis.reversePairsDecrypt(matrix, 'CT'), { pair: 'CT', plain: 'ER', reversePlain: 'RE' });
    assert.deepEqual(analysis.reversePairsDecrypt(matrix, 'BC'), { pair: 'BC', plain: 'DE', reversePlain: 'ED' });
});

test('B-5 200 seeded random matrices preserve reversal when decrypting', () => {
    let seed = 20260924;
    const random = limit => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed % limit;
    };
    for (let trial = 0; trial < 200; trial++) {
        const matrix = [...core.ALPHABET];
        for (let index = matrix.length - 1; index > 0; index--) {
            const other = random(index + 1);
            [matrix[index], matrix[other]] = [matrix[other], matrix[index]];
        }
        const first = random(25);
        const second = (first + 1 + random(24)) % 25;
        const pair = matrix[first] + matrix[second];
        const actual = analysis.reversePairsDecrypt(matrix.join(''), pair);
        assert.equal(actual.plain, core.decrypt(matrix.join(''), pair).plaintext);
        assert.equal(actual.reversePlain, [...actual.plain].reverse().join(''));
    }
});

test('B-2 empty inputs, ignored order, pair boundaries and earliest reversal order', () => {
    assert.deepEqual(analysis.analyze('').topPairs, []);
    assert.equal(analysis.analyze('!?,!!').verdict, 'empty');
    assert.deepEqual(analysis.analyze('!?,!!').ignored, ['!', '?', ',']);
    assert.deepEqual(analysis.analyze('ABBAA').doubles, []);
    assert.deepEqual(analysis.analyze('ZYYZBAAB').reversed, [
        { pair: 'YZ', reverse: 'ZY', at: [1], reverseAt: [0] },
        { pair: 'AB', reverse: 'BA', at: [3], reverseAt: [2] }
    ]);
});
