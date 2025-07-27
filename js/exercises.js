class ExerciseManager {
    constructor() {
        this.exercises = {
            encryption: {
                examples: [
                    {
                        id: "basic-01",
                        category: "基本単語",
                        title: "挨拶",
                        plaintext: "HELLO",
                        description: "最も基本的な英単語を暗号化してみましょう"
                    },
                    {
                        id: "basic-02",
                        category: "基本単語",
                        title: "秘密",
                        plaintext: "SECRET",
                        description: "「秘密」を意味する英単語"
                    },
                    {
                        id: "basic-03",
                        category: "基本単語",
                        title: "暗号",
                        plaintext: "CIPHER",
                        description: "「暗号」を意味する英単語"
                    },
                    {
                        id: "phrase-01",
                        category: "定型文",
                        title: "夜明けの攻撃",
                        plaintext: "ATTACK AT DAWN",
                        description: "歴史的な軍事暗号として使われた文"
                    },
                    {
                        id: "phrase-02",
                        category: "定型文",
                        title: "秘密の待ち合わせ",
                        plaintext: "MEET ME TONIGHT",
                        description: "スパイ小説でよく使われる文"
                    },
                    {
                        id: "phrase-03",
                        category: "定型文",
                        title: "即座に撤退",
                        plaintext: "RETREAT IMMEDIATELY",
                        description: "緊急時の軍事指令"
                    },
                    {
                        id: "historical-01",
                        category: "歴史的文書",
                        title: "有名なパングラム",
                        plaintext: "THE QUICK BROWN FOX",
                        description: "全てのアルファベットを含む有名な文"
                    },
                    {
                        id: "historical-02",
                        category: "歴史的文書",
                        title: "外交暗号",
                        plaintext: "NEGOTIATIONS PROCEEDING",
                        description: "外交文書で使われた暗号文"
                    }
                ],
                challenges: [
                    {
                        id: "challenge-01",
                        level: 1,
                        title: "基本の暗号化",
                        plaintext: "CAT",
                        keyword: null,
                        hint: "デフォルトの鍵を使用してください",
                        points: 5,
                        description: "最も簡単な暗号化課題"
                    },
                    {
                        id: "challenge-02",
                        level: 1,
                        title: "短い文の暗号化",
                        plaintext: "HELP ME",
                        keyword: null,
                        hint: "デフォルトの鍵を使用してください",
                        points: 10,
                        description: "2つの単語を暗号化"
                    },
                    {
                        id: "challenge-03",
                        level: 2,
                        title: "キーワード暗号",
                        plaintext: "MEET AT NOON",
                        keyword: "EXAMPLE",
                        hint: "キーワード「EXAMPLE」を使用してください",
                        points: 15,
                        description: "指定されたキーワードで暗号化"
                    },
                    {
                        id: "challenge-04",
                        level: 2,
                        title: "長文暗号化",
                        plaintext: "THE ENEMY IS APPROACHING",
                        keyword: "SECRET",
                        hint: "キーワード「SECRET」を使用してください",
                        points: 20,
                        description: "長い文章の暗号化"
                    },
                    {
                        id: "challenge-05",
                        level: 3,
                        title: "複雑な暗号化",
                        plaintext: "OPERATION OVERLORD BEGINS",
                        keyword: "NORMANDY",
                        hint: "第二次大戦に関連するキーワードです",
                        points: 25,
                        description: "歴史的作戦の暗号化"
                    }
                ]
            },
            decryption: {
                practices: [
                    {
                        id: "decrypt-01",
                        category: "基本復号",
                        title: "挨拶の復号",
                        ciphertext: "KCMMNY",
                        answer: "HELLOX",
                        keyword: null,
                        hint: "デフォルトの鍵を使用。最後のXは埋め文字です",
                        description: "最も基本的な復号練習"
                    },
                    {
                        id: "decrypt-02",
                        category: "基本復号",
                        title: "短い単語",
                        ciphertext: "UCBSDU",
                        answer: "SECRET",
                        keyword: null,
                        hint: "デフォルトの鍵を使用",
                        description: "6文字の単語を復号"
                    },
                    {
                        id: "decrypt-03",
                        category: "キーワード復号",
                        title: "動物の名前",
                        ciphertext: "BNSY",
                        answer: "CATX",
                        keyword: "ANIMAL",
                        hint: "動物に関連するキーワードを使用。最後のXは埋め文字です",
                        description: "キーワードを使った復号"
                    }
                ],
                challenges: [
                    {
                        id: "mystery-01",
                        level: 1,
                        title: "謎の単語",
                        ciphertext: "KCMMNY",
                        answer: "HELLO",
                        keyword: null,
                        hints: [
                            "3文字以下の短い単語ではありません",
                            "挨拶に使われる言葉です",
                            "デフォルトの鍵が使われています",
                            "5文字の基本的な英単語です"
                        ],
                        points: 10,
                        description: "基本的な復号チャレンジ"
                    },
                    {
                        id: "mystery-02",
                        level: 2,
                        title: "秘密のメッセージ",
                        ciphertext: "ITWCGUCSPOMBMS",
                        answer: "MEET ME TONIGHT",
                        keyword: "SECRET",
                        hints: [
                            "鍵マトリクスは「秘密」という意味の英単語をキーワードに生成しています",
                            "待ち合わせに関する文章",
                            "3つの単語で構成されています",
                            "適切なスペースで単語を区切って入力してください"
                        ],
                        points: 20,
                        description: "中級レベルの暗号解読"
                    },
                    {
                        id: "mystery-03",
                        level: 3,
                        title: "軍事作戦",
                        ciphertext: "MAAMDHMAKDUP",
                        answer: "ATTACK AT DAWN",
                        keyword: "MILITARY",
                        hints: [
                            "鍵マトリクスは軍事に関連する英単語をキーワードに生成しています",
                            "平文は歴史的に有名な軍事指令です",
                            "時間に関する単語が含まれています",
                            "適切なスペースで単語を区切って入力してください"
                        ],
                        points: 30,
                        description: "上級レベルの暗号解読"
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
    loadProgress() {
        try {
            const saved = localStorage.getItem('playfair-progress');
            return saved ? JSON.parse(saved) : {
                completedChallenges: [],
                totalPoints: 0,
                unlockedLevels: { encryption: 1, decryption: 1 }
            };
        } catch (error) {
            return {
                completedChallenges: [],
                totalPoints: 0,
                unlockedLevels: { encryption: 1, decryption: 1 }
            };
        }
    }
    
    saveProgress() {
        try {
            localStorage.setItem('playfair-progress', JSON.stringify(this.progress));
        } catch (error) {
            console.warn('進捗の保存に失敗しました:', error);
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
        // 暗号化: 前レベルの課題を全てクリアしたら次レベル解放
        const encryptionChallenges = this.getChallenges('encryption');
        for (let level = 1; level <= 3; level++) {
            const levelChallenges = encryptionChallenges.filter(c => c.level === level);
            const completedCount = levelChallenges.filter(c => this.isChallengeCompleted(c.id)).length;
            
            if (completedCount === levelChallenges.length && level < 3) {
                this.progress.unlockedLevels.encryption = Math.max(
                    this.progress.unlockedLevels.encryption, 
                    level + 1
                );
            }
        }
        
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
        this.progress = {
            completedChallenges: [],
            totalPoints: 0,
            unlockedLevels: { encryption: 1, decryption: 1 }
        };
        this.saveProgress();
    }
    
    // 課題検証
    validateAnswer(type, challengeId, userAnswer, userKeyword = null) {
        let challenge;
        
        if (type === 'encryption') {
            challenge = this.getChallenges('encryption').find(c => c.id === challengeId);
        } else {
            challenge = [...this.getChallenges('decryption'), ...this.getPractices()]
                .find(c => c.id === challengeId);
        }
        
        if (!challenge) return { correct: false, message: '課題が見つかりません' };
        
        // キーワードチェック
        if (challenge.keyword && (!userKeyword || userKeyword.toUpperCase() !== challenge.keyword.toUpperCase())) {
            const hintText = challenge.hints && challenge.hints.length > 0 ? challenge.hints[0] : challenge.hint || '';
            return { 
                correct: false, 
                message: `正しいキーワードを設定してください。ヒント: ${hintText}` 
            };
        }
        
        // 答えチェック
        let expectedAnswer;
        if (type === 'encryption') {
            expectedAnswer = this.getExpectedCiphertext(challenge);
        } else {
            // スペースを保持して大文字に変換
            expectedAnswer = challenge.answer.toUpperCase();
        }
            
        const userAnswerUpperCase = userAnswer.toUpperCase();
        
        // 完全一致をチェック
        if (userAnswerUpperCase === expectedAnswer) {
            if (challenge.points) {
                this.markChallengeCompleted(challengeId, challenge.points);
            }
            return { 
                correct: true, 
                message: '正解です！', 
                points: challenge.points || 0 
            };
        }
        
        // 復号の場合、末尾の埋め文字を除去した版も受け入れる
        if (type === 'decryption') {
            const expectedWithoutPadding = expectedAnswer.replace(/\s*[XQZ]\s*$/, '').trim();
            if (userAnswerUpperCase === expectedWithoutPadding) {
                if (challenge.points) {
                    this.markChallengeCompleted(challengeId, challenge.points);
                }
                return { 
                    correct: true, 
                    message: '正解です！', 
                    points: challenge.points || 0 
                };
            }
        }
        
        return { 
            correct: false, 
            message: '答えが違います。もう一度確認してください。' 
        };
    }
    
    getExpectedCiphertext(challenge) {
        // 実際の暗号化を実行して期待値を取得
        // PlayfairCipherクラスを使用して暗号化
        const cipher = new PlayfairCipher();
        
        if (challenge.keyword) {
            const result = cipher.generateMatrixFromKeyword(challenge.keyword);
            cipher.setMatrix(result.matrix);
        }
        
        const encryptResult = cipher.encrypt(challenge.plaintext);
        return encryptResult.ciphertext.toUpperCase().replace(/\s/g, '');
    }
}