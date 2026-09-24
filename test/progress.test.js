const test = require('node:test');
const assert = require('node:assert/strict');
const { ProgressCore: core } = require('../js/progress.js');
const defaultMatrix = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
const exampleMatrix = 'PLAYFIREXMBCDGHKNOQSTUVWZ';
const animalMatrix = 'ANIMLBCDEFGHKOPQRSTUVWXYZ';
const secretMatrix = 'SECRTABDFGHIKLMNOPQUVWXYZ';
const militaryMatrix = 'MILTARYBCDEFGHKNOPQSUVWXZ';

const events = [
    [{ type: 'matrix-saved', matrix: exampleMatrix }, 'M1'],
    [{ type: 'matrix-saved', matrix: secretMatrix }, null],
    [{ type: 'encrypted', input: 'HELLO', variant: null, matrix: defaultMatrix }, 'M2'],
    [{ type: 'encrypted', input: 'HELLO', variant: 'right-shift', matrix: defaultMatrix }, null],
    [{ type: 'encrypted', input: 'HELLO', variant: null, matrix: secretMatrix }, null],
    [{ type: 'encrypted', input: 'MEETMETONIGHT', variant: null, matrix: defaultMatrix }, 'M4'],
    [{ type: 'decrypted', ciphertext: 'KCNVMP', variant: null, matrix: defaultMatrix }, 'M5'],
    [{ type: 'decrypted', ciphertext: 'KCNVMP', variant: 'no-change', matrix: defaultMatrix }, null],
    [{ type: 'decrypted', ciphertext: 'BNSY', variant: null, matrix: animalMatrix }, 'M6'],
    [{ type: 'decrypted', ciphertext: 'BNSY', variant: null, matrix: defaultMatrix }, null],
    [{ type: 'challenge-correct', id: 'mystery-02', hintsUsed: 0 }, null]
];
for (const [index, [event, mission]] of events.entries()) {
    test(`H-1 reduce row ${index + 1}: ${JSON.stringify(event)}`, () => {
        const initial = core.initial();
        const actual = core.reduce(initial, event);
        assert.deepEqual(initial, core.initial());
        assert.deepEqual(actual, { ...core.initial(), missions: mission ? { [mission]: true } : {} });
        assert.notEqual(actual, initial);
    });
}

test('H-1 rendered rules: row, column, ignore same and decryption, then rectangle', () => {
    let p = core.initial();
    for (const rule of ['row', 'column']) p = core.reduce(p, { type: 'step-rendered', tab: 'encryption', rule });
    assert.deepEqual(p, { ...core.initial(), rulesSeen: ['row', 'column'] });
    assert.deepEqual(core.reduce(p, { type: 'step-rendered', tab: 'encryption', rule: 'same' }), p);
    assert.deepEqual(core.reduce(p, { type: 'step-rendered', tab: 'decryption', rule: 'rectangle' }), p);
    p = core.reduce(p, { type: 'step-rendered', tab: 'encryption', rule: 'rectangle' });
    assert.deepEqual(p, { ...core.initial(), missions: { M3: true }, rulesSeen: ['row', 'column', 'rectangle'] });
    assert.deepEqual(core.reduce(p, { type: 'step-rendered', tab: 'encryption', rule: 'row' }), p);
});

test('H-1 first answer keeps points and hints; challenges unlock in order', () => {
    let p = core.reduce(core.initial(), { type: 'challenge-correct', id: 'mystery-01', hintsUsed: 0 });
    assert.deepEqual(p.challenges, { 'mystery-01': { points: 10, hintsUsed: 0 } });
    assert.equal(core.statuses(p)[6].star, true);
    assert.deepEqual(core.reduce(p, { type: 'challenge-correct', id: 'mystery-01', hintsUsed: 3 }), p);
    assert.equal(core.isLocked(p, 'C2'), false);
    assert.equal(core.isLocked(p, 'C3'), true);
    p = core.reduce(p, { type: 'challenge-correct', id: 'mystery-02', hintsUsed: 2 });
    assert.equal(core.summary(p).points, 30);
    assert.equal(core.statuses(p)[7].star, false);
    assert.equal(core.isLocked(p, 'mystery-03'), false);
});

test('H-1 mission order, groups, points, statuses and summaries', () => {
    assert.deepEqual(core.MISSIONS.map(m => [m.id, m.group, m.points]), [
        ['M1', 'key', 0], ['M2', 'encryption', 0], ['M3', 'encryption', 0], ['M4', 'encryption', 0],
        ['M5', 'decryption', 0], ['M6', 'decryption', 0], ['C1', 'challenge', 10], ['C2', 'challenge', 20], ['C3', 'challenge', 30]
    ]);
    let p = core.initial();
    assert.deepEqual(core.summary(p), { done: 0, total: 9, points: 0, maxPoints: 60, next: 'M1' });
    assert.deepEqual(core.statuses(p).map(m => m.state), ['next', 'open', 'open', 'open', 'open', 'open', 'open', 'locked', 'locked']);
    assert.equal(core.summary({ ...p, missions: { M1: true } }).next, 'M2');
    assert.equal(core.summary({ ...p, missions: { M2: true } }).next, 'M1');
    p.missions = Object.fromEntries(core.MISSIONS.slice(0, 6).map(m => [m.id, true]));
    assert.equal(core.summary(p).next, 'C1');
    for (const id of ['mystery-01', 'mystery-02', 'mystery-03']) {
        p = core.reduce(p, { type: 'challenge-correct', id, hintsUsed: 0 });
    }
    assert.deepEqual(core.summary(p), { done: 9, total: 9, points: 60, maxPoints: 60, next: null });
    assert.deepEqual(core.reduce(p, { type: 'unknown' }), p);
    assert.deepEqual(core.reduce(p, { type: 'matrix-saved', matrix: defaultMatrix }), p);
});

for (const [ids, points, level] of [[['mystery-01'], 10, 2], [['mystery-01', 'mystery-02'], 30, 3]]) {
    test(`H-1 migrate v1: ${points} points`, () => {
        const p = core.migrate(JSON.stringify({ completedChallenges: ids, totalPoints: points, unlockedLevels: { decryption: level } }));
        assert.deepEqual(p.challenges, Object.fromEntries(ids.map((id, i) => [id, { points: (i + 1) * 10, hintsUsed: null }])));
        assert.equal(core.summary(p).points, points);
        assert.equal(core.statuses(p).some(m => m.star), false);
    });
}

const invalid = [null, '{', '[]', 'null', '{"version":3}',
    JSON.stringify({ completedChallenges: ['mystery-01'], totalPoints: 99, unlockedLevels: { decryption: 2 } }),
    JSON.stringify({ ...core.initial(), missions: { M9: true } }),
    JSON.stringify({ ...core.initial(), rulesSeen: ['same'] }),
    JSON.stringify({ ...core.initial(), challenges: { 'mystery-01': { points: 10, hintsUsed: -1 } } }),
    JSON.stringify({ ...core.initial(), unknown: true }),
    JSON.stringify({ ...core.initial(), missions: [] }),
    JSON.stringify({ ...core.initial(), challenges: { 'mystery-01': { points: 99, hintsUsed: 0 } } }),
    JSON.stringify({ ...core.initial(), rulesSeen: ['row', 'row'] }),
    JSON.stringify({ ...core.initial(), challenges: { 'mystery-01': { points: 10, hintsUsed: 5 } } })
];
for (const [index, raw] of invalid.entries()) {
    test(`H-1 invalid progress ${index + 1} resets`, () => assert.deepEqual(core.migrate(raw), core.initial()));
}

test('H-1 serialize roundtrip and reducer immutability', () => {
    const p = core.reduce(core.initial(), { type: 'challenge-correct', id: 'mystery-01', hintsUsed: 1 });
    const raw = core.serialize(p);
    assert.deepEqual(core.migrate(raw), p);
    const next = core.reduce(p, { type: 'matrix-saved', matrix: exampleMatrix });
    next.challenges['mystery-01'].hintsUsed = 4;
    assert.equal(core.serialize(p), raw);
});

test('H-1 M6 step states and skipping the editor', () => {
    const s = { matrix: defaultMatrix, editorOpen: false, ciphertextDraft: '', decryption: null };
    assert.deepEqual(core.stepStates('M6', s), ['current', 'todo', 'todo', 'todo']);
    s.editorOpen = true;
    assert.deepEqual(core.stepStates('M6', s), ['done', 'current', 'todo', 'todo']);
    s.editorOpen = false;
    s.matrix = animalMatrix;
    assert.deepEqual(core.stepStates('M6', s), ['done', 'done', 'current', 'todo']);
    s.ciphertextDraft = 'BNSY';
    assert.deepEqual(core.stepStates('M6', s), ['done', 'done', 'done', 'current']);
    s.decryption = { ciphertext: 'BNSY', matrix: animalMatrix, variant: null };
    assert.deepEqual(core.stepStates('M6', s), ['done', 'done', 'done', 'done']);
    assert.deepEqual(core.stepStates('M3', { rulesSeenNow: ['row', 'rectangle'], encryption: { variant: null } }),
        ['done', 'done', 'current']);
});

test('H-1 matrices, locks, variants and all guide final conditions', () => {
    assert.deepEqual(['mystery-01', 'mystery-02', 'mystery-03'].map(core.requiredMatrix),
        [defaultMatrix, secretMatrix, militaryMatrix]);
    assert.equal(core.isLocked(core.initial(), 'C1'), false);
    assert.equal(core.isLocked(core.initial(), 'mystery-02'), true);
    assert.equal(core.isLocked(core.initial(), 'mystery-03'), true);
    assert.deepEqual(core.stepStates('M2', { encryption: { input: 'HELLO', variant: 'right-shift', matrix: defaultMatrix } }),
        ['current', 'todo', 'todo']);
    for (const [id, snapshot] of [
        ['M1', { matrix: exampleMatrix }],
        ['M2', { encryption: { input: 'HELLO', variant: null, matrix: defaultMatrix } }],
        ['M3', { rulesSeenNow: ['row', 'column', 'rectangle'] }],
        ['M4', { encryption: { input: 'MEETMETONIGHT', variant: null, matrix: defaultMatrix } }],
        ['M5', { decryption: { ciphertext: 'KCNVMP', variant: null, matrix: defaultMatrix } }],
        ['C1', { lastCorrect: 'mystery-01' }], ['C2', { lastCorrect: 'mystery-02' }], ['C3', { lastCorrect: 'mystery-03' }]
    ]) assert.ok(core.stepStates(id, snapshot).every(state => state === 'done'), id);
});
