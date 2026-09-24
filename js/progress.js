const ProgressCore = (() => {
    const core = typeof module !== 'undefined' && module.exports
        ? require('./cipher.js').PlayfairCore : PlayfairCore;
    const MISSIONS = Object.freeze([
        { id: 'M1', group: 'key', points: 0 },
        { id: 'M2', group: 'encryption', points: 0 },
        { id: 'M3', group: 'encryption', points: 0 },
        { id: 'M4', group: 'encryption', points: 0 },
        { id: 'M5', group: 'decryption', challengeId: 'decrypt-01', points: 0 },
        { id: 'M6', group: 'decryption', challengeId: 'decrypt-03', points: 0 },
        { id: 'C1', group: 'challenge', challengeId: 'mystery-01', points: 10 },
        { id: 'C2', group: 'challenge', challengeId: 'mystery-02', points: 20, requires: 'C1' },
        { id: 'C3', group: 'challenge', challengeId: 'mystery-03', points: 30, requires: 'C2' }
    ].map(Object.freeze));
    const rules = ['row', 'column', 'rectangle'];
    const challenges = MISSIONS.filter(item => item.group === 'challenge');
    const matrices = {
        default: core.ALPHABET,
        example: core.matrixFromKeyword('PLAYFAIR EXAMPLE'),
        animal: core.matrixFromKeyword('ANIMAL')
    };
    const challengeMatrices = {
        'mystery-01': matrices.default,
        'mystery-02': core.matrixFromKeyword('SECRET'),
        'mystery-03': core.matrixFromKeyword('MILITARY')
    };
    const challengeTexts = {
        'mystery-01': 'KCNVMP', 'mystery-02': 'ITCSITEUOHAMCZ', 'mystery-03': 'MAAMDHMAKDUP'
    };
    const STEPS = {
        M1: [['edit-matrix-btn', 'key-generation'], ['keyword-text', 'key-generation'], ['save-matrix-btn', 'key-generation']],
        M2: [['reset-matrix-btn', 'key-generation'], ['plaintext', 'encryption'], ['encrypt-btn', 'encryption']],
        M3: [['example-category', 'encryption'], ['encrypt-btn', 'encryption'],
            ['next-step-encryption', 'encryption', Object.freeze({ disabledAlt: 'restart-encryption', disabledKey: 'guide.restart' })]],
        M4: [['reset-matrix-btn', 'key-generation'], ['plaintext', 'encryption'], ['encrypt-btn', 'encryption']],
        M5: [['reset-matrix-btn', 'key-generation'], ['practice-type', 'decryption'], ['decrypt-btn', 'decryption']],
        M6: [['edit-matrix-btn', 'key-generation'], ['keyword-text', 'key-generation'],
            ['practice-type', 'decryption'], ['decrypt-btn', 'decryption']]
    };
    for (const mission of challenges) {
        STEPS[mission.id] = [['tab-key-generation', 'key-generation'], ['challenge-start-' + mission.challengeId, null],
            ['decrypt-btn', 'decryption'], ['challenge-answer', 'decryption']];
    }
    Object.values(STEPS).forEach(steps => {
        steps.forEach(Object.freeze);
        Object.freeze(steps);
    });
    Object.freeze(STEPS);

    function initial() {
        return { version: 2, missions: {}, challenges: {}, rulesSeen: [] };
    }

    function object(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function keys(value, allowed, exact = false) {
        return object(value) && Object.keys(value).every(key => allowed.includes(key))
            && (!exact || Object.keys(value).length === allowed.length);
    }

    function validHints(value) {
        return value === null || Number.isInteger(value) && value >= 0 && value <= 4;
    }

    function valid(value) {
        if (!keys(value, ['version', 'missions', 'challenges', 'rulesSeen'], true) || value.version !== 2) return false;
        if (!keys(value.missions, MISSIONS.slice(0, 6).map(item => item.id))
            || !Object.values(value.missions).every(flag => flag === true)) return false;
        if (!keys(value.challenges, challenges.map(item => item.challengeId))) return false;
        for (const mission of challenges) {
            const completed = value.challenges[mission.challengeId];
            if (completed !== undefined && (!keys(completed, ['points', 'hintsUsed'], true)
                || completed.points !== mission.points || !validHints(completed.hintsUsed))) return false;
        }
        return Array.isArray(value.rulesSeen) && value.rulesSeen.every(rule => rules.includes(rule))
            && new Set(value.rulesSeen).size === value.rulesSeen.length;
    }

    function migrate(raw) {
        try {
            if (typeof raw !== 'string') return initial();
            const value = JSON.parse(raw);
            if (valid(value)) return value;
            if (!keys(value, ['completedChallenges', 'totalPoints', 'unlockedLevels'], true)
                || !Array.isArray(value.completedChallenges)
                || !value.completedChallenges.every(id => challenges.some(item => item.challengeId === id))
                || new Set(value.completedChallenges).size !== value.completedChallenges.length
                || !keys(value.unlockedLevels, ['decryption'], true)
                || !Number.isInteger(value.unlockedLevels.decryption)
                || value.unlockedLevels.decryption < 1 || value.unlockedLevels.decryption > 3) return initial();
            const progress = initial();
            for (const mission of challenges) {
                if (value.completedChallenges.includes(mission.challengeId)) {
                    progress.challenges[mission.challengeId] = { points: mission.points, hintsUsed: null };
                }
            }
            return summary(progress).points === value.totalPoints ? progress : initial();
        } catch (_error) {
            return initial();
        }
    }

    function serialize(progress) {
        return JSON.stringify(progress);
    }

    function requiredMatrix(id) {
        return Object.hasOwn(challengeMatrices, id) ? challengeMatrices[id] : matrices.default;
    }

    function isLocked(progress, id) {
        const mission = MISSIONS.find(item => item.id === id || item.challengeId === id);
        const previous = MISSIONS.find(item => item.id === mission?.requires);
        return !!previous && !Object.hasOwn(progress.challenges, previous.challengeId);
    }

    function reduce(progress, event) {
        const next = {
            version: 2, missions: { ...progress.missions }, rulesSeen: [...progress.rulesSeen],
            challenges: Object.fromEntries(Object.entries(progress.challenges).map(([id, value]) => [id, { ...value }]))
        };
        if (event.type === 'matrix-saved' && event.matrix === matrices.example) next.missions.M1 = true;
        if (event.type === 'encrypted' && event.variant === null && event.matrix === matrices.default) {
            if (event.input === 'HELLO') next.missions.M2 = true;
            if (event.input === 'MEETMETONIGHT') next.missions.M4 = true;
        }
        if (event.type === 'step-rendered' && event.tab === 'encryption' && rules.includes(event.rule)) {
            if (!next.rulesSeen.includes(event.rule)) next.rulesSeen.push(event.rule);
            if (next.rulesSeen.length === 3) next.missions.M3 = true;
        }
        if (event.type === 'decrypted' && event.variant === null) {
            if (event.ciphertext === 'KCNVMP' && event.matrix === matrices.default) next.missions.M5 = true;
            if (event.ciphertext === 'BNSY' && event.matrix === matrices.animal) next.missions.M6 = true;
        }
        if (event.type === 'challenge-correct') {
            const mission = challenges.find(item => item.challengeId === event.id);
            if (mission && !isLocked(progress, event.id) && !Object.hasOwn(next.challenges, event.id)
                && event.hintsUsed !== null && validHints(event.hintsUsed)) {
                next.challenges[event.id] = { points: mission.points, hintsUsed: event.hintsUsed };
            }
        }
        return next;
    }

    function statuses(progress) {
        let foundNext = false;
        return MISSIONS.map(mission => {
            const challenge = progress.challenges[mission.challengeId];
            const done = mission.group === 'challenge' ? !!challenge : !!progress.missions[mission.id];
            let state = done ? 'done' : isLocked(progress, mission.id) ? 'locked' : 'open';
            if (state === 'open' && !foundNext) {
                foundNext = true;
                state = 'next';
            }
            return { id: mission.id, state, points: mission.points, star: !!challenge && challenge.hintsUsed === 0 };
        });
    }

    function summary(progress) {
        const items = statuses(progress);
        return {
            done: items.filter(item => item.state === 'done').length, total: 9,
            points: Object.values(progress.challenges).reduce((sum, item) => sum + item.points, 0), maxPoints: 60,
            next: items.find(item => item.state === 'next')?.id || null
        };
    }

    function matches(result, field, text, matrix) {
        return !!result && result[field] === text && result.variant === null && result.matrix === matrix;
    }

    function stepStates(id, snapshot) {
        const s = snapshot;
        const checks = {
            M1: () => [s.editorOpen, s.keywordDraft === 'PLAYFAIREXAMPLE', s.matrix === matrices.example],
            M2: () => [s.matrix === matrices.default, s.plaintextDraft === 'HELLO',
                matches(s.encryption, 'input', 'HELLO', matrices.default)],
            M3: () => [!!s.plaintextDraft, !!s.encryption && s.encryption.variant === null,
                rules.every(rule => (s.rulesSeenNow || []).includes(rule))],
            M4: () => [s.matrix === matrices.default, s.plaintextDraft === 'MEETMETONIGHT',
                matches(s.encryption, 'input', 'MEETMETONIGHT', matrices.default)],
            M5: () => [s.matrix === matrices.default, s.ciphertextDraft === 'KCNVMP',
                matches(s.decryption, 'ciphertext', 'KCNVMP', matrices.default)],
            M6: () => [s.editorOpen, s.matrix === matrices.animal, s.ciphertextDraft === 'BNSY',
                matches(s.decryption, 'ciphertext', 'BNSY', matrices.animal)]
        };
        const mission = challenges.find(item => item.id === id);
        const predicates = mission ? [
            s.matrix === requiredMatrix(mission.challengeId),
            s.loaded?.kind === 'challenge' && s.loaded.id === mission.challengeId,
            s.decryption?.ciphertext === challengeTexts[mission.challengeId]
                && s.decryption.matrix === requiredMatrix(mission.challengeId),
            s.lastCorrect === mission.challengeId
        ] : Object.hasOwn(checks, id) ? checks[id]() : [];
        let last = -1;
        predicates.forEach((done, index) => { if (done) last = index; });
        return predicates.map((_done, index) => index <= last ? 'done' : index === last + 1 ? 'current' : 'todo');
    }

    return Object.freeze({ MISSIONS, STEPS, initial, migrate, serialize, reduce, statuses, summary,
        isLocked, requiredMatrix, stepStates });
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressCore };
}
