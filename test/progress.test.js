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

test('G-4 analysis events award only the specified missions', () => {
    const initial = core.initial();
    for (const verdict of ['empty', 'consistent', undefined]) {
        assert.deepEqual(core.reduce(initial, { type: 'analyzed', verdict, reversedCount: 2 }), initial);
    }
    const m7 = core.reduce(initial, { type: 'analyzed', verdict: 'impossible', reversedCount: 0 });
    assert.deepEqual(m7, { ...initial, missions: { M7: true } });
    const m8 = core.reduce(initial, { type: 'reversed-selected' });
    assert.deepEqual(m8, { ...initial, missions: { M8: true } });
    assert.deepEqual(initial, core.initial());
    assert.equal(core.summary(m8).points, 0);
});

test('G-4 version 2 keeps old progress and permits M7/M8 without challenges in missions', () => {
    const old = '{"version":2,"missions":{"M1":true},"challenges":{},"rulesSeen":[]}';
    assert.deepEqual(core.migrate(old), JSON.parse(old));
    const next = { ...core.initial(), missions: { M1: true, M7: true, M8: true } };
    assert.deepEqual(core.migrate(core.serialize(next)), next);
    assert.deepEqual(core.migrate(JSON.stringify({ ...next, missions: { C1: true } })), core.initial());
});

test('G-4 analysis steps require impossible/reversed results and later steps imply earlier ones', () => {
    assert.deepEqual(core.STEPS.M7, [['tab-analysis', 'analysis'], ['analysis-sample', 'analysis'], ['analyze-btn', 'analysis']]);
    assert.deepEqual(core.STEPS.M8, [...core.STEPS.M7, ['analysis-reversed-list', 'analysis']]);
    const s = { activeTab: 'key-generation', analysisDraft: '', analysis: null, selectedReversed: null };
    assert.deepEqual(core.stepStates('M7', s), ['current', 'todo', 'todo']);
    assert.deepEqual(core.stepStates('M8', s), ['current', 'todo', 'todo', 'todo']);
    s.activeTab = 'analysis';
    assert.deepEqual(core.stepStates('M7', s), ['done', 'current', 'todo']);
    s.analysisDraft = 'Khoor, Zruog!';
    assert.deepEqual(core.stepStates('M7', s), ['done', 'done', 'current']);
    s.analysis = { verdict: 'consistent', reversed: [] };
    assert.deepEqual(core.stepStates('M7', s), ['done', 'done', 'current']);
    assert.deepEqual(core.stepStates('M8', s), ['done', 'done', 'current', 'todo']);
    s.analysis = { verdict: 'impossible', reversed: [] };
    assert.deepEqual(core.stepStates('M7', s), ['done', 'done', 'done']);
    s.analysis = { verdict: 'consistent', reversed: [{ pair: 'CT', reverse: 'TC' }] };
    assert.deepEqual(core.stepStates('M8', s), ['done', 'done', 'done', 'current']);
    assert.deepEqual(core.stepStates('M7', { analysis: { verdict: 'impossible' } }), ['done', 'done', 'done']);
    assert.deepEqual(core.stepStates('M8', { selectedReversed: { pair: 'CT' } }), ['done', 'done', 'done', 'done']);
});

test('G-4 UI snapshot trims analysis without normalizing J or punctuation', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const vm = require('node:vm');
    const { PlayfairCore } = require('../js/cipher.js');
    const UI = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/ui.js'), 'utf8') + '; UI;', {
        PlayfairCore,
        document: { getElementById(id) { return { value: id === 'analysis-input' ? '  J, j!  ' : '', classList: { contains() { return true; } } }; } }
    });
    const ui = Object.create(UI.prototype);
    Object.assign(ui, { getCurrentMatrixString: () => defaultMatrix, results: {}, rulesSeenNow: [],
        analysisResult: { verdict: 'impossible' }, selectedReversed: { pair: 'CT' } });
    const s = ui.getSnapshot();
    assert.equal(s.analysisDraft, 'J, j!');
    assert.equal(s.analysis, ui.analysisResult);
    assert.equal(s.selectedReversed, ui.selectedReversed);
});

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
    assert.equal(core.statuses(p)[8].star, true);
    assert.deepEqual(core.reduce(p, { type: 'challenge-correct', id: 'mystery-01', hintsUsed: 3 }), p);
    assert.equal(core.isLocked(p, 'C2'), false);
    assert.equal(core.isLocked(p, 'C3'), true);
    p = core.reduce(p, { type: 'challenge-correct', id: 'mystery-02', hintsUsed: 2 });
    assert.equal(core.summary(p).points, 30);
    assert.equal(core.statuses(p)[9].star, false);
    assert.equal(core.isLocked(p, 'mystery-03'), false);
});

test('H-1 mission order, groups, points, statuses and summaries', () => {
    assert.deepEqual(core.MISSIONS.map(m => [m.id, m.group, m.points]), [
        ['M1', 'key', 0], ['M2', 'encryption', 0], ['M3', 'encryption', 0], ['M4', 'encryption', 0],
        ['M5', 'decryption', 0], ['M6', 'decryption', 0], ['M7', 'analysis', 0], ['M8', 'analysis', 0],
        ['C1', 'challenge', 10], ['C2', 'challenge', 20], ['C3', 'challenge', 30],
        ['R1', 'recovery', 10], ['R2', 'recovery', 20], ['R3', 'recovery', 30]
    ]);
    let p = core.initial();
    assert.deepEqual(core.summary(p), { done: 0, total: 14, points: 0, maxPoints: 120, next: 'M1' });
    assert.deepEqual(core.statuses(p).map(m => m.state),
        ['next', 'open', 'open', 'open', 'open', 'open', 'open', 'open', 'open', 'locked', 'locked', 'open', 'locked', 'locked']);
    assert.equal(core.summary({ ...p, missions: { M1: true } }).next, 'M2');
    assert.equal(core.summary({ ...p, missions: { M2: true } }).next, 'M1');
    p.missions = Object.fromEntries(core.MISSIONS.slice(0, 8).map(m => [m.id, true]));
    assert.equal(core.summary(p).next, 'C1');
    for (const id of ['mystery-01', 'mystery-02', 'mystery-03']) {
        p = core.reduce(p, { type: 'challenge-correct', id, hintsUsed: 0 });
    }
    assert.deepEqual(core.summary(p), { done: 11, total: 14, points: 60, maxPoints: 120, next: 'R1' });
    for (const id of ['recover-01', 'recover-02', 'recover-03']) p = core.reduce(p, { type: 'recovery-solved', id, hintsUsed: 0 });
    assert.deepEqual(core.summary(p), { done: 14, total: 14, points: 120, maxPoints: 120, next: null });
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

test('H-1 every mission text and guide target exists', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const vm = require('node:vm');
    const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const dictionaries = vm.runInNewContext(read('js/i18n.js') + '; i18n.translations;', {});
    const html = read('index.html');
    for (const mission of core.MISSIONS) {
        for (const dictionary of Object.values(dictionaries)) {
            for (const suffix of ['title', 'learn', ...core.STEPS[mission.id].map((_step, i) => 'step.' + (i + 1))]) {
                assert.ok(dictionary[`mission.${mission.id}.${suffix}`], `${mission.id}.${suffix}`);
            }
            if (mission.group === 'challenge') {
                assert.equal(dictionary[`mission.${mission.id}.title`], dictionary[`example.${mission.challengeId}`]);
            }
        }
        for (const [id] of core.STEPS[mission.id]) {
            if (!id.startsWith('challenge-start-')) assert.ok(html.includes(`id="${id}"`), id);
        }
    }
});

test('E-1 only M3 step three has a disabled alternative, with matching dictionary keys', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const vm = require('node:vm');
    const source = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');
    const dictionaries = vm.runInNewContext(source + '; i18n.translations;', {});
    assert.deepEqual(core.STEPS.M3[2][2], { disabledAlt: 'restart-encryption', disabledKey: 'guide.restart' });
    assert.ok(Object.isFrozen(core.STEPS.M3[2][2]));
    for (const [id, steps] of Object.entries(core.STEPS)) {
        steps.forEach((step, index) => {
            if (id !== 'M3' || index !== 2) assert.equal(step[2]?.disabledAlt, undefined, id + ':' + index);
        });
    }
    for (const dictionary of Object.values(dictionaries)) {
        for (const key of ['guide.restart', 'guide.disabled', 'guide.m3.remaining', 'guide.m3.missing',
            'rule.name.row', 'rule.name.column', 'rule.name.rectangle', 'matrix.status', 'matrix.current-line']) {
            assert.ok(dictionary[key], key);
        }
    }
});

test('Recovery G-3 locks, event separation, first result, hints and old saves', () => {
    const old = { version: 2, missions: { M1: true, M7: true, M8: true },
        challenges: { 'mystery-01': { points: 10, hintsUsed: 0 } }, rulesSeen: ['row'] };
    assert.deepEqual(core.migrate(JSON.stringify(old)), old);
    let p = core.initial();
    assert.deepEqual(core.reduce(p, { type: 'recovery-solved', id: 'recover-02', hintsUsed: 0 }), p);
    assert.deepEqual(core.reduce(p, { type: 'challenge-correct', id: 'recover-01', hintsUsed: 0 }), p);
    assert.deepEqual(core.reduce(p, { type: 'recovery-solved', id: 'mystery-01', hintsUsed: 0 }), p);
    p = core.reduce(p, { type: 'recovery-solved', id: 'recover-01', hintsUsed: 0 });
    assert.equal(core.statuses(p).find(m => m.id === 'R1').star, true);
    assert.equal(core.isLocked(p, 'R2'), false);
    assert.equal(core.isLocked(p, 'R3'), true);
    assert.deepEqual(core.reduce(p, { type: 'recovery-solved', id: 'recover-01', hintsUsed: 24 }), p);
    p = core.reduce(p, { type: 'recovery-solved', id: 'recover-02', hintsUsed: 19 });
    assert.equal(core.statuses(p).find(m => m.id === 'R2').star, false);
    assert.equal(core.isLocked(p, 'R3'), false);
    p = core.reduce(p, { type: 'recovery-solved', id: 'recover-03', hintsUsed: 24 });
    assert.deepEqual(p.challenges, { 'recover-01': { points: 10, hintsUsed: 0 },
        'recover-02': { points: 20, hintsUsed: 19 }, 'recover-03': { points: 30, hintsUsed: 24 } });
    assert.deepEqual(core.migrate(core.serialize(p)), p);
    assert.deepEqual(Object.keys(p).sort(), ['challenges', 'missions', 'rulesSeen', 'version']);
    assert.deepEqual(core.migrate(JSON.stringify({ ...p, missions: { R1: true } })), core.initial());
    for (const hintsUsed of [-1, null, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        assert.deepEqual(core.reduce(core.initial(), { type: 'recovery-solved', id: 'recover-01', hintsUsed }), core.initial());
    }
});

test('Recovery G-3 four guide steps, later-step implication and unrelated puzzle isolation', () => {
    for (const [index, id] of ['R1', 'R2', 'R3'].entries()) {
        const puzzle = 'recover-0' + (index + 1);
        assert.deepEqual(core.STEPS[id], [['tab-analysis', 'analysis'], ['recovery-problem', 'analysis'],
            ['recovery-grid', 'analysis'], ['recovery-grid', 'analysis']]);
        assert.deepEqual(core.stepStates(id, {}), ['current', 'todo', 'todo', 'todo']);
        assert.deepEqual(core.stepStates(id, { activeTab: 'analysis' }), ['done', 'current', 'todo', 'todo']);
        assert.deepEqual(core.stepStates(id, { recovery: { id: puzzle, placed: 0 } }), ['done', 'done', 'current', 'todo']);
        assert.deepEqual(core.stepStates(id, { recovery: { id: puzzle, placed: 1 } }), ['done', 'done', 'done', 'current']);
        assert.deepEqual(core.stepStates(id, { lastRecoverySolved: puzzle }), ['done', 'done', 'done', 'done']);
        assert.deepEqual(core.stepStates(id, { recovery: { id: 'missing', placed: 25 } }), ['current', 'todo', 'todo', 'todo']);
    }
});

test('H-3 moved corrupt storage examples reset and blocked storage keeps in-memory progress', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const vm = require('node:vm');
    const UI = vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/ui.js'), 'utf8') + '; UI;', {
        ProgressCore: core,
        localStorage: { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } }
    });
    const ui = Object.create(UI.prototype);
    ui.progress = ui.loadProgress();
    assert.deepEqual(ui.progress, core.initial());
    ui.updateProgressDisplay = () => {};
    ui.recordProgress({ type: 'challenge-correct', id: 'mystery-01', hintsUsed: 0 });
    assert.equal(core.summary(ui.progress).points, 10);
    assert.doesNotThrow(() => ui.saveProgress());
    for (const raw of ['{', 'null', '[]', '{"completedChallenges":"x"}',
        '{"completedChallenges":[],"totalPoints":-1,"unlockedLevels":{"decryption":1}}']) {
        assert.deepEqual(core.migrate(raw), core.initial());
    }
});
