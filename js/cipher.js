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

    encryptPair(pair) {
        const pos1 = this.findPosition(pair[0]);
        const pos2 = this.findPosition(pair[1]);
        
        if (!pos1 || !pos2) {
            return pair;
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

    encrypt(plaintext, paddingChar = 'X', samePairPadding = true) {
        const processed = this.preprocessText(plaintext, paddingChar, samePairPadding);
        const pairs = this.createPairs(processed);
        const encryptedPairs = pairs.map(pair => this.encryptPair(pair));
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