const ExerciseCore = typeof module !== 'undefined' && module.exports
    ? require('./cipher.js').PlayfairCore : PlayfairCore;

class ExerciseManager {
    constructor(storage = { getItem: () => null, setItem: () => {} }) {
        this.storage = storage;
        this.exercises = {
            encryption: {
                examples: [
                    {
                        id: "basic-01",
                        category: "basic",
                        title: "basic-01",
                        plaintext: "HELLO",
                        description: "exercise.basic-01.description"
                    },
                    {
                        id: "basic-02",
                        category: "basic",
                        title: "basic-02",
                        plaintext: "SECRET",
                        description: "exercise.basic-02.description"
                    },
                    {
                        id: "basic-03",
                        category: "basic",
                        title: "basic-03",
                        plaintext: "CIPHER",
                        description: "exercise.basic-03.description"
                    },
                    {
                        id: "phrase-01",
                        category: "phrase",
                        title: "phrase-01",
                        plaintext: "ATTACK AT DAWN",
                        description: "exercise.phrase-01.description"
                    },
                    {
                        id: "phrase-02",
                        category: "phrase",
                        title: "phrase-02",
                        plaintext: "MEET ME TONIGHT",
                        description: "exercise.phrase-02.description"
                    },
                    {
                        id: "phrase-03",
                        category: "phrase",
                        title: "phrase-03",
                        plaintext: "RETREAT IMMEDIATELY",
                        description: "exercise.phrase-03.description"
                    },
                    {
                        id: "historical-01",
                        category: "known",
                        title: "historical-01",
                        plaintext: "THE QUICK BROWN FOX",
                        description: "exercise.historical-01.description"
                    },
                    {
                        id: "historical-02",
                        category: "known",
                        title: "historical-02",
                        plaintext: "HIDE THE GOLD IN THE TREE STUMP",
                        keyword: "PLAYFAIR EXAMPLE",
                        description: "exercise.historical-02.description"
                    }
                ]
            },
            decryption: {
                practices: [
                    {
                        id: "decrypt-01",
                        category: "practice",
                        title: "decrypt-01",
                        ciphertext: "KCNVMP",
                        answer: "HELLO",
                        keyword: null,
                        hint: "exercise.decrypt-01.hint",
                        description: "exercise.decrypt-01.description"
                    },
                    {
                        id: "decrypt-02",
                        category: "practice",
                        title: "decrypt-02",
                        ciphertext: "UCBSDU",
                        answer: "SECRET",
                        keyword: null,
                        hint: "exercise.decrypt-02.hint",
                        description: "exercise.decrypt-02.description"
                    },
                    {
                        id: "decrypt-03",
                        category: "practice",
                        title: "decrypt-03",
                        ciphertext: "BNSY",
                        answer: "CAT",
                        keyword: "ANIMAL",
                        hint: "exercise.decrypt-03.hint",
                        description: "exercise.decrypt-03.description"
                    }
                ],
                challenges: [
                    {
                        id: "mystery-01",
                        level: 1,
                        title: "mystery-01",
                        ciphertext: "KCNVMP",
                        answer: "HELLO",
                        keyword: null,
                        hints: [
                            "challenge.mystery-01.hint.0",
                            "challenge.mystery-01.hint.1",
                            "challenge.mystery-01.hint.2",
                            "challenge.mystery-01.hint.3"
                        ],
                        points: 10,
                        description: "exercise.mystery-01.description"
                    },
                    {
                        id: "mystery-02",
                        level: 2,
                        title: "mystery-02",
                        ciphertext: "ITCSITEUOHAMCZ",
                        answer: "MEET ME TONIGHT",
                        keyword: "SECRET",
                        hints: [
                            "challenge.mystery-02.hint.0",
                            "challenge.mystery-02.hint.1",
                            "challenge.mystery-02.hint.2",
                            "challenge.mystery-02.hint.3"
                        ],
                        points: 20,
                        description: "exercise.mystery-02.description"
                    },
                    {
                        id: "mystery-03",
                        level: 3,
                        title: "mystery-03",
                        ciphertext: "MAAMDHMAKDUP",
                        answer: "ATTACK AT DAWN",
                        keyword: "MILITARY",
                        hints: [
                            "challenge.mystery-03.hint.0",
                            "challenge.mystery-03.hint.1",
                            "challenge.mystery-03.hint.2",
                            "challenge.mystery-03.hint.3"
                        ],
                        points: 30,
                        description: "exercise.mystery-03.description"
                    }
                ]
            }
        };
        
        this.progress = this.loadProgress();
    }
    
    getExamples(type) {
        return this.exercises[type].examples || [];
    }
    
    getChallenges(type) {
        return this.exercises[type].challenges || [];
    }
    
    getPractices() {
        return this.exercises.decryption.practices || [];
    }
    
    getExamplesByCategory(type) {
        const examples = this.getExamples(type);
        const grouped = {};
        
        examples.forEach(example => {
            if (!grouped[example.category]) {
                grouped[example.category] = [];
            }
            grouped[example.category].push(example);
        });
        
        return grouped;
    }
    
    getChallengesByLevel(type) {
        const challenges = this.getChallenges(type);
        const grouped = {};
        
        challenges.forEach(challenge => {
            const level = challenge.level || 1;
            if (!grouped[level]) {
                grouped[level] = [];
            }
            grouped[level].push(challenge);
        });
        
        return grouped;
    }
    
    getPracticesByCategory() {
        const practices = this.getPractices();
        const grouped = {};
        
        practices.forEach(practice => {
            if (!grouped[practice.category]) {
                grouped[practice.category] = [];
            }
            grouped[practice.category].push(practice);
        });
        
        return grouped;
    }
    
    // 進捗管理
    defaultProgress() {
        return { completedChallenges: [], totalPoints: 0, unlockedLevels: { decryption: 1 } };
    }

    loadProgress() {
        try {
            const saved = this.storage.getItem('playfair-progress');
            if (!saved) return this.defaultProgress();
            const value = JSON.parse(saved);
            const challenges = this.getChallenges('decryption');
            if (!value || !Array.isArray(value.completedChallenges)
                || !value.completedChallenges.every(id => challenges.some(challenge => challenge.id === id))
                || new Set(value.completedChallenges).size !== value.completedChallenges.length
                || !Number.isSafeInteger(value.totalPoints) || value.totalPoints < 0
                || !value.unlockedLevels || !Number.isInteger(value.unlockedLevels.decryption)
                || value.unlockedLevels.decryption < 1 || value.unlockedLevels.decryption > 3) {
                return this.defaultProgress();
            }
            const points = challenges.filter(challenge => value.completedChallenges.includes(challenge.id))
                .reduce((sum, challenge) => sum + challenge.points, 0);
            if (points !== value.totalPoints) return this.defaultProgress();
            return {
                completedChallenges: [...value.completedChallenges],
                totalPoints: points,
                unlockedLevels: { decryption: value.unlockedLevels.decryption }
            };
        } catch (_error) {
            return this.defaultProgress();
        }
    }

    saveProgress() {
        try {
            this.storage.setItem('playfair-progress', JSON.stringify(this.progress));
        } catch (_error) {
            // 保存できなくても、このページ内の進捗は保持する。
        }
    }

    markChallengeCompleted(challengeId, points = 0) {
        if (!this.progress.completedChallenges.includes(challengeId)) {
            this.progress.completedChallenges.push(challengeId);
            this.progress.totalPoints += points;
            this.updateUnlockedLevels();
            this.saveProgress();
        }
    }
    
    isChallengeCompleted(challengeId) {
        return this.progress.completedChallenges.includes(challengeId);
    }
    
    updateUnlockedLevels() {
        // 復号: 同様のロジック
        const decryptionChallenges = this.getChallenges('decryption');
        for (let level = 1; level <= 3; level++) {
            const levelChallenges = decryptionChallenges.filter(c => c.level === level);
            const completedCount = levelChallenges.filter(c => this.isChallengeCompleted(c.id)).length;
            
            if (completedCount === levelChallenges.length && level < 3) {
                this.progress.unlockedLevels.decryption = Math.max(
                    this.progress.unlockedLevels.decryption, 
                    level + 1
                );
            }
        }
    }
    
    isLevelUnlocked(type, level) {
        return level <= this.progress.unlockedLevels[type];
    }
    
    getProgress() {
        return { ...this.progress };
    }
    
    resetProgress() {
        this.progress = this.defaultProgress();
        this.saveProgress();
    }
    
    // 課題検証
    validateAnswer(id, userAnswer, currentMatrixString) {
        const input = ExerciseCore.normalize(userAnswer);
        if (!input) return { result: 'empty', points: 0 };
        const challenge = [...this.getChallenges('decryption'), ...this.getPractices()]
            .find(item => item.id === id);
        if (!challenge) return { result: 'incorrect', points: 0 };
        const expectedMatrix = ExerciseCore.matrixFromKeyword(challenge.keyword || '');
        if (currentMatrixString !== expectedMatrix) return { result: 'wrong-key', points: 0 };
        const decoded = ExerciseCore.decrypt(expectedMatrix, challenge.ciphertext).plaintext;
        const candidates = ExerciseCore.paddingCandidates(decoded);
        const answers = [
            ExerciseCore.normalize(challenge.answer),
            decoded,
            ExerciseCore.stripCandidates(decoded, candidates)
        ];
        if (!answers.includes(input)) return { result: 'incorrect', points: 0 };
        const points = this.isChallengeCompleted(id) ? 0 : (challenge.points || 0);
        if (challenge.points) this.markChallengeCompleted(id, points);
        return { result: 'correct', points };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExerciseManager };
}
