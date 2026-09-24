const ExerciseCore = typeof module !== 'undefined' && module.exports
    ? require('./cipher.js').PlayfairCore : PlayfairCore;

class ExerciseManager {
    constructor() {
        this.exercises = {
            encryption: {
                challenges: [
                    { id: 'encipher-01', title: 'encipher-01', keyword: '', plaintext: 'SHEEP', points: 10 },
                    { id: 'encipher-02', title: 'encipher-02', keyword: 'CIPHER', plaintext: 'HIDE THE MAP', points: 20 },
                    { id: 'encipher-03', title: 'encipher-03', keyword: 'SECRET', plaintext: 'ATTACK THE HILL', points: 30 }
                ],
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
                history: {
                    id: 'history-01', title: 'history-01', level: 4, points: 30,
                    keyword: 'ROYAL NEW ZEALAND NAVY', answer: 'ONE OWE NINE',
                    ciphertext: 'KXJEY UREBE ZWEHE WRYTU HEYFS KREHE GOYFI WTTTU OLKSY CAJPO '
                        + 'BOTEI ZONTX BYBWT GONEY CUZWR GDSON SXBOU YWRHE BAAHY USEDQ',
                    description: 'exercise.history-01.description',
                    hints: [0, 1, 2, 3].map(index => `challenge.history-01.hint.${index}`)
                },
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

    getHistoryChallenge() {
        return this.exercises.decryption.history;
    }

    encipherResult(id) {
        const challenge = this.getChallenges('encryption').find(item => item.id === id);
        return challenge ? ExerciseCore.encrypt(ExerciseCore.matrixFromKeyword(challenge.keyword), challenge.plaintext) : null;
    }

    validateEncipher(id, userAnswer) {
        const input = ExerciseCore.normalize(userAnswer);
        if (!input) return { result: 'empty', points: 0 };
        const challenge = this.getChallenges('encryption').find(item => item.id === id);
        if (!challenge || input !== this.encipherResult(id).ciphertext) return { result: 'incorrect', points: 0 };
        return { result: 'correct', points: challenge.points };
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
    
    // 課題検証
    validateAnswer(id, userAnswer, currentMatrixString) {
        if (id === 'history-01') {
            const challenge = this.getHistoryChallenge();
            const input = String(userAnswer).trim();
            if (!input) return { result: 'empty', points: 0 };
            if (currentMatrixString !== ExerciseCore.matrixFromKeyword(challenge.keyword)) return { result: 'wrong-key', points: 0 };
            const correct = input === '109' || ExerciseCore.normalize(input) === 'ONEOWENINE';
            return { result: correct ? 'correct' : 'incorrect', points: correct ? challenge.points : 0 };
        }
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
        const points = challenge.points || 0;
        return { result: 'correct', points };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExerciseManager };
}
