class PlayfairCipher {
    constructor() {
        this.matrix = this.createDefaultMatrix();
    }

    createDefaultMatrix() {
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(alphabet.slice(i * 5, (i + 1) * 5).split(''));
        }
        return matrix;
    }

    setMatrix(matrix) {
        this.matrix = matrix;
    }

    getMatrix() {
        return this.matrix;
    }

    validateMatrix(text) {
        const chars = text.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (chars.includes('J')) {
            return { valid: false, error: 'J は使用できません。I に置換されます。', warning: true };
        }
        
        if (chars.length !== 25) {
            return { valid: false, error: '25文字（5×5）で入力してください。' };
        }
        
        const uniqueChars = new Set(chars);
        if (uniqueChars.size !== 25) {
            return { valid: false, error: '重複する文字があります。' };
        }
        
        return { valid: true };
    }

    textToMatrix(text) {
        const chars = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(chars.slice(i * 5, (i + 1) * 5).split(''));
        }
        return matrix;
    }

    matrixToText() {
        return this.matrix.map(row => row.join('')).join('\n');
    }

    generateMatrixFromKeyword(keyword) {
        // アルファベットと空白のみを許可、大文字に変換、Jをイに変換
        const cleanKeyword = keyword
            .toUpperCase()
            .replace(/J/g, 'I')
            .replace(/[^A-Z ]/g, '')
            .replace(/\s+/g, ''); // 空白を削除

        // 重複を除去してキーワードから文字を抽出
        const keywordChars = [];
        const usedChars = new Set();
        
        for (const char of cleanKeyword) {
            if (!usedChars.has(char)) {
                keywordChars.push(char);
                usedChars.add(char);
            }
        }

        // 残りのアルファベットを追加（J以外のA-Z）
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Jを除く
        const remainingChars = [];
        
        for (const char of alphabet) {
            if (!usedChars.has(char)) {
                remainingChars.push(char);
            }
        }

        // キーワード文字 + 残りの文字で25文字を作成
        const allChars = [...keywordChars, ...remainingChars];
        
        // 25文字になるように調整
        if (allChars.length > 25) {
            allChars.splice(25);
        } else if (allChars.length < 25) {
            // 不足分をアルファベット順で埋める（通常は発生しない）
            for (const char of alphabet) {
                if (allChars.length >= 25) break;
                if (!allChars.includes(char)) {
                    allChars.push(char);
                }
            }
        }

        // 5x5マトリクスに配置
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(allChars.slice(i * 5, (i + 1) * 5));
        }

        return {
            matrix,
            keywordLength: keywordChars.length
        };
    }

    validateKeyword(keyword) {
        // 空文字チェック
        if (!keyword.trim()) {
            return { valid: false, error: 'キーワードを入力してください。' };
        }

        // 英字と空白のみかチェック
        const validChars = /^[a-zA-Z\s]*$/;
        if (!validChars.test(keyword)) {
            const invalidChars = keyword.match(/[^a-zA-Z\s]/g);
            const uniqueInvalidChars = [...new Set(invalidChars)].join(', ');
            return { 
                valid: false, 
                error: `許可されていない文字が含まれています: ${uniqueInvalidChars}。英字と空白のみ入力してください。` 
            };
        }

        // 英字が少なくとも1文字あるかチェック
        const hasAlphabet = /[a-zA-Z]/.test(keyword);
        if (!hasAlphabet) {
            return { valid: false, error: '少なくとも1文字の英字を入力してください。' };
        }

        return { valid: true };
    }

    findPosition(char) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.matrix[row][col] === char) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    preprocessText(text, paddingChar = 'X', samePairPadding = true) {
        let processed = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        
        if (samePairPadding) {
            let result = '';
            for (let i = 0; i < processed.length; i++) {
                result += processed[i];
                if (i < processed.length - 1 && processed[i] === processed[i + 1]) {
                    result += paddingChar;
                }
            }
            processed = result;
        }
        
        if (processed.length % 2 !== 0) {
            processed += paddingChar;
        }
        
        return processed;
    }

    createPairs(text) {
        const pairs = [];
        for (let i = 0; i < text.length; i += 2) {
            pairs.push(text.slice(i, i + 2));
        }
        return pairs;
    }

    encryptPair(pair, samePairRule = 'no-change') {
        const pos1 = this.findPosition(pair[0]);
        const pos2 = this.findPosition(pair[1]);
        
        if (!pos1 || !pos2) {
            return pair;
        }
        
        // 同一文字ペアの特別処理
        if (pair[0] === pair[1]) {
            if (samePairRule === 'bottom-right') {
                // マトリクス右下の文字（位置[4,4]）に置換
                const bottomRightChar = this.matrix[4][4];
                return bottomRightChar + bottomRightChar;
            } else {
                // 変化なし
                return pair;
            }
        }
        
        let encrypted = '';
        
        if (pos1.row === pos2.row) {
            encrypted = this.matrix[pos1.row][(pos1.col + 1) % 5];
            encrypted += this.matrix[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            encrypted = this.matrix[(pos1.row + 1) % 5][pos1.col];
            encrypted += this.matrix[(pos2.row + 1) % 5][pos2.col];
        } else {
            encrypted = this.matrix[pos1.row][pos2.col];
            encrypted += this.matrix[pos2.row][pos1.col];
        }
        
        return encrypted;
    }

    decryptPair(pair) {
        const pos1 = this.findPosition(pair[0]);
        const pos2 = this.findPosition(pair[1]);
        
        if (!pos1 || !pos2) {
            return pair;
        }
        
        let decrypted = '';
        
        if (pos1.row === pos2.row) {
            decrypted = this.matrix[pos1.row][(pos1.col + 4) % 5];
            decrypted += this.matrix[pos2.row][(pos2.col + 4) % 5];
        } else if (pos1.col === pos2.col) {
            decrypted = this.matrix[(pos1.row + 4) % 5][pos1.col];
            decrypted += this.matrix[(pos2.row + 4) % 5][pos2.col];
        } else {
            decrypted = this.matrix[pos1.row][pos2.col];
            decrypted += this.matrix[pos2.row][pos1.col];
        }
        
        return decrypted;
    }

    encrypt(plaintext, paddingChar = 'X', samePairPadding = true, samePairRule = 'no-change') {
        const processed = this.preprocessText(plaintext, paddingChar, samePairPadding);
        const pairs = this.createPairs(processed);
        const encryptedPairs = pairs.map(pair => this.encryptPair(pair, samePairRule));
        return {
            processed,
            pairs,
            ciphertext: encryptedPairs.join(''),
            encryptedPairs
        };
    }

    decrypt(ciphertext) {
        const processed = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
        const pairs = this.createPairs(processed);
        const decryptedPairs = pairs.map(pair => this.decryptPair(pair));
        return {
            pairs,
            plaintext: decryptedPairs.join('').toLowerCase(),
            decryptedPairs
        };
    }
}