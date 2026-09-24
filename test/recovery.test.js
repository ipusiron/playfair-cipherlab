const test = require('node:test');
const assert = require('node:assert/strict');
const { PlayfairCore: C } = require('../js/cipher.js');
const { PlayfairRecovery: R } = require('../js/recovery.js');
const fixtures = [
    {
        id: 'recover-01', points: 10, answer: 'SECURITYABDFGHKLMNOPQVWXZ', givens: 'SECURI..A.D...KL.NO..VWXZ',
        cribPlain: 'MEET THE AGENT AT THE NORTH GATE', cribPrepared: 'MEETTHEAGENTATTHENORTHGATE',
        cribCipher: 'VTTFAFUTFCMYBYAFCMPUAFHYFT', secretCipher: 'AFRFCTDICOFSEBFUIPRCEIPOUV',
        secretPlain: 'THEKEYISUNDERTHEBLUESTONEX', steps: 9,
        pairs: 'ME:VT:column ET:TF:column TH:AF:rectangle EA:UT:rectangle GE:FC:rectangle NT:MY:rectangle '
            + 'AT:BY:row EN:CM:rectangle OR:PU:rectangle GA:HY:rectangle TE:FT:column'
    },
    {
        id: 'recover-02', points: 20, answer: 'LIBRAYCDEFGHKMNOPQSTUVWXZ', givens: '......C.E.....NO...T.VWX.',
        cribPlain: 'THE BOOK WAS RETURNED BEFORE NOON', cribPrepared: 'THEBOXOKWASRETURNEDBEFORENOXON',
        cribCipher: 'PNDRSUQGZBXEFSXLMFKDFYSLFMSUTG', secretCipher: 'HPFDNQMCPNBAEQMCAY',
        secretPlain: 'CHECKTHETHIRDSHELF', steps: 17,
        pairs: 'TH:PN:rectangle EB:DR:rectangle OX:SU:rectangle OK:QG:rectangle WA:ZB:rectangle SR:XE:column '
            + 'ET:FS:rectangle UR:XL:rectangle NE:MF:rectangle DB:KD:column EF:FY:row OR:SL:rectangle EN:FM:rectangle ON:TG:rectangle'
    },
    {
        id: 'recover-03', points: 30, answer: 'WHEATSONBCDFGIKLMPQRUVXYZ', givens: '..E.T.O..................',
        cribPlain: 'WHEATSTONE INVENTED THIS CIPHER BUT LORD PLAYFAIR PROMOTED IT',
        cribPrepared: 'WHEATSTONEINVENTEDTHISCIPHERBUTLORDPLAYFAIRPROMOTEDITX',
        cribCipher: 'HEATWCHCGNGBXHCEWGWEDBBKMETPSYWRCMGLQWVIBQLQMCVFWAFKEZ', secretCipher: 'XNBSDQEBGLEQTPTQNENGSVFE',
        secretPlain: 'PENCILANDPAPERAREXENOUGH', steps: 22,
        pairs: 'WH:HE:row EA:AT:row TS:WC:rectangle TO:HC:rectangle NE:GN:column IN:GB:rectangle VE:XH:rectangle NT:CE:rectangle '
            + 'ED:WG:rectangle TH:WE:row IS:DB:rectangle CI:BK:rectangle PH:ME:rectangle ER:TP:rectangle BU:SY:rectangle '
            + 'TL:WR:rectangle OR:CM:rectangle DP:GL:rectangle LA:QW:rectangle YF:VI:rectangle AI:BQ:column RP:LQ:row '
            + 'RO:MC:rectangle MO:VF:column TE:WA:row DI:FK:row TX:EZ:rectangle'
    }
];

for (const expected of fixtures) {
    test(`Recovery A-2 exact data: ${expected.id}`, () => {
        const p = R.problem(expected.id);
        for (const key of ['id', 'points', 'answer', 'cribPlain', 'cribPrepared', 'cribCipher', 'secretCipher', 'secretPlain']) {
            assert.equal(p[key], expected[key], key);
        }
        assert.deepEqual(p.givens, [...expected.givens].map(c => c === '.' ? '' : c));
        assert.deepEqual(p.pairs, expected.pairs.split(' ').map(text => {
            const [plain, cipher, kind] = text.split(':'); return { plain, cipher, kind };
        }));
        assert.equal(C.decrypt(p.answer, p.secretCipher).plaintext, expected.secretPlain);
        for (const pair of p.pairs) assert.equal(R.pairStatus([...p.answer], pair), 'ok');
    });

    test(`Recovery A-4 deduction has exact steps and answer: ${expected.id}`, () => {
        const p = R.problem(expected.id), grid = [...p.givens];
        assert.deepEqual(R.solveByDeduction(p, grid), { grid: [...expected.answer], steps: expected.steps });
        assert.deepEqual(grid, p.givens);
        assert.equal(R.isSolved(p, p.givens), false);
        assert.equal(R.isSolved(p, [...expected.answer]), true);
        const shifted = [...expected.answer.slice(5) + expected.answer.slice(0, 5)];
        assert.equal(R.isSolved(p, shifted), false);
    });

    test(`Recovery G-1 all 25 cyclic shifts agree on all 600 pairs, unlike transpose: ${expected.id}`, () => {
        const m = expected.answer;
        const allPairs = [...C.ALPHABET].flatMap(a => [...C.ALPHABET].filter(b => b !== a).map(b => a + b));
        assert.equal(allPairs.length, 600);
        for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
            const shifted = [...m].map((_, i) => m[((Math.floor(i / 5) + row) % 5) * 5 + (i % 5 + col) % 5]).join('');
            for (const pair of allPairs) {
                assert.equal(C.transformPair(shifted, ...pair, 'enc'), C.transformPair(m, ...pair, 'enc'));
            }
        }
        const transpose = [...m].map((_, i) => m[(i % 5) * 5 + Math.floor(i / 5)]).join('');
        assert.ok(allPairs.some(pair => C.transformPair(transpose, ...pair, 'enc') !== C.transformPair(m, ...pair, 'enc')));
    });

    test(`Recovery A-5 three hints and repeated placement solve: ${expected.id}`, () => {
        const p = R.problem(expected.id), grid = [...p.givens];
        assert.deepEqual(R.hint(p, grid, 1), { type: 'rules' });
        assert.deepEqual(R.hint(p, grid, 2), { type: 'kinds', kinds: p.pairs.map(pair => pair.kind) });
        let count = 0;
        while (!R.isSolved(p, grid)) {
            const h = R.hint(p, grid, 3);
            assert.equal(h.type, 'place');
            assert.equal(h.letter, p.answer[h.cell]);
            assert.equal(grid[h.cell], '');
            assert.ok(R.candidates(p, grid, h.letter).includes(h.cell));
            grid[h.cell] = h.letter;
            assert.ok(++count <= 25);
        }
        assert.equal(count, expected.steps);
        assert.equal(R.hint(p, grid, 3), null);
    });
}

test('Recovery C-2 partial contradictions preserve the reference ordering and open states', () => {
    const p = R.problem('recover-01'), grid = [...p.givens];
    grid[7] = 'T';
    assert.deepEqual(p.pairs.filter(pair => R.pairStatus(grid, pair) === 'ng').map(pair => pair.plain), ['ME', 'ET', 'EA', 'TE']);
    assert.deepEqual(R.hint(p, grid, 3), { type: 'wrong', cell: 7 });
    grid[7] = ''; grid[6] = 'B';
    assert.equal(R.pairStatus(grid, p.pairs.find(pair => pair.plain === 'AT')), 'open');
    assert.deepEqual(R.hint(p, grid, 3), { type: 'wrong', cell: 6 });
    assert.ok(p.pairs.every(pair => R.pairStatus(Array(25).fill(''), pair) === 'open'));
});

test('Recovery pure APIs do not mutate input or expose mutable shared problem data', () => {
    const p = R.problem('recover-01'), grid = [...p.givens], before = JSON.stringify(p);
    R.candidates(p, grid, 'B'); R.solveByDeduction(p, grid); R.hint(p, grid, 3);
    assert.equal(JSON.stringify(p), before);
    assert.deepEqual(grid, p.givens);
    p.givens[0] = ''; p.pairs[0].plain = 'ZZ';
    assert.equal(R.problem(p.id).givens[0], 'S');
    assert.equal(R.problem(p.id).pairs[0].plain, 'ME');
    assert.equal(R.problem('missing'), null);
    assert.deepEqual(R.candidates(p, grid, 'S'), []);
    assert.deepEqual(R.candidates(p, grid, 'J'), []);
    assert.throws(() => R.solveByDeduction(p, []), TypeError);
    assert.throws(() => R.solveByDeduction(p, Array(25).fill('A')), TypeError);
});
