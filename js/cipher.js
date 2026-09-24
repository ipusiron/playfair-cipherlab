const PlayfairCore = (() => {
    const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

    function normalize(text) {
        return String(text).toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    }

    function matrixFromKeyword(keyword) {
        const seen = new Set();
        const out = [];
        for (const c of normalize(keyword) + ALPHABET) {
            if (!seen.has(c)) {
                seen.add(c);
                out.push(c);
            }
        }
        return out.join('');
    }

    function altPad(pad) {
        return pad === 'X' ? 'Q' : 'X';
    }

    function prepare(text, pad = 'X') {
        const s = normalize(text);
        const out = [];
        const inserted = [];
        let i = 0;
        // 2文字ずつ確定し、同じ組の文字だけを分割する。
        while (i < s.length) {
            const a = s[i];
            const b = s[i + 1];
            if (b === undefined || a === b) {
                const p = a === pad ? altPad(pad) : pad;
                out.push(a, p);
                inserted.push(out.length - 1);
                i += 1;
            } else {
                out.push(a, b);
                i += 2;
            }
        }
        return { text: out.join(''), inserted };
    }

    function prepareNoSplit(text, pad = 'X') {
        const s = normalize(text);
        if (s.length % 2 === 0) return { text: s, inserted: [] };
        const last = s[s.length - 1];
        return { text: s + (last === pad ? altPad(pad) : pad), inserted: [s.length] };
    }

    function pos(m, c) {
        const k = m.indexOf(c);
        return [Math.floor(k / 5), k % 5];
    }

    function pairRule(m, a, b) {
        const [r1, c1] = pos(m, a);
        const [r2, c2] = pos(m, b);
        if (a === b) return 'same';
        if (r1 === r2) return 'row';
        if (c1 === c2) return 'column';
        return 'rectangle';
    }

    function transformPair(m, a, b, dir) {
        const [r1, c1] = pos(m, a);
        const [r2, c2] = pos(m, b);
        const d = dir === 'enc' ? 1 : 4;
        if (r1 === r2) return m[r1 * 5 + (c1 + d) % 5] + m[r2 * 5 + (c2 + d) % 5];
        if (c1 === c2) return m[((r1 + d) % 5) * 5 + c1] + m[((r2 + d) % 5) * 5 + c2];
        return m[r1 * 5 + c2] + m[r2 * 5 + c1];
    }

    function samePair(m, c, rule, dir) {
        const [r, col] = pos(m, c);
        const d = dir === 'enc' ? 1 : 4;
        if (rule === 'no-change') return c + c;
        if (rule === 'right-shift') {
            const x = m[r * 5 + (col + d) % 5];
            return x + x;
        }
        if (rule === 'bottom-right') {
            const x = m[((r + d) % 5) * 5 + (col + d) % 5];
            return x + x;
        }
        throw new TypeError('unknown variant');
    }

    function encrypt(matrixString, text, { padChar = 'X', variant = null } = {}) {
        const p = variant === null ? prepare(text, padChar) : prepareNoSplit(text, padChar);
        const pairs = p.text.match(/../g) || [];
        const rules = pairs.map(pair => pairRule(matrixString, pair[0], pair[1]));
        const outPairs = pairs.map(pair => pair[0] === pair[1]
            ? samePair(matrixString, pair[0], variant, 'enc')
            : transformPair(matrixString, pair[0], pair[1], 'enc'));
        return { prepared: p.text, inserted: p.inserted, pairs, rules, outPairs, ciphertext: outPairs.join('') };
    }

    function decrypt(matrixString, text, { variant = null } = {}) {
        const s = normalize(text);
        if (s.length % 2 !== 0) return { ok: false, error: { key: 'error.odd-length', params: {} } };
        const pairs = s.match(/../g) || [];
        if (variant === null) {
            const pair = pairs.find(pair => pair[0] === pair[1]);
            if (pair) return { ok: false, error: { key: 'error.double-pair', params: { pair } } };
        }
        const rules = pairs.map(pair => pairRule(matrixString, pair[0], pair[1]));
        const outPairs = pairs.map(pair => pair[0] === pair[1]
            ? samePair(matrixString, pair[0], variant, 'dec')
            : transformPair(matrixString, pair[0], pair[1], 'dec'));
        return { ok: true, pairs, rules, outPairs, plaintext: outPairs.join('') };
    }

    function paddingCandidates(plain, pad = 'X') {
        const c = [];
        for (let i = 1; i < plain.length; i += 2) {
            if (plain[i] !== pad && plain[i] !== altPad(pad)) continue;
            if (i === plain.length - 1 || plain[i - 1] === plain[i + 1]) c.push(i);
        }
        return c;
    }

    function stripCandidates(plain, positions) {
        const removed = new Set(positions);
        return [...plain].filter((_, index) => !removed.has(index)).join('');
    }

    function invalid(key, params = {}) {
        return { valid: false, error: { key, params } };
    }

    function validateKeyword(keyword) {
        if (!keyword.trim()) return invalid('error.keyword-empty');
        if (!/^[a-zA-Z\s]*$/.test(keyword)) {
            const chars = [...new Set(keyword.match(/[^a-zA-Z\s]/g))].join(', ');
            return invalid('error.keyword-chars', { chars });
        }
        if (!/[a-zA-Z]/.test(keyword)) return invalid('error.keyword-letter');
        return { valid: true };
    }

    function validateMatrix(text) {
        const chars = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (chars.includes('J')) return invalid('error.matrix-j');
        if (chars.length !== 25) return invalid('error.matrix-length');
        if (new Set(chars).size !== 25) return invalid('error.matrix-duplicate');
        return { valid: true };
    }

    return Object.freeze({
        ALPHABET, normalize, matrixFromKeyword, prepare, prepareNoSplit, pairRule,
        encrypt, decrypt, paddingCandidates, stripCandidates, validateKeyword, validateMatrix,
        transformPair, samePair
    });
})();

class PlayfairCipher {
    constructor() {
        this.matrix = this.createDefaultMatrix();
    }

    createDefaultMatrix() {
        const alphabet = PlayfairCore.ALPHABET;
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
        return PlayfairCore.validateMatrix(text);
    }

    textToMatrix(text) {
        const chars = PlayfairCore.normalize(text);
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
        // 重複を除去してキーワードから文字を抽出
        const keywordChars = [...new Set(PlayfairCore.normalize(keyword))];
        const allChars = PlayfairCore.matrixFromKeyword(keyword);

        // 5x5マトリクスに配置
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(allChars.slice(i * 5, (i + 1) * 5).split(''));
        }

        return {
            matrix,
            keywordLength: keywordChars.length
        };
    }

    validateKeyword(keyword) {
        return PlayfairCore.validateKeyword(keyword);
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
        const prepare = samePairPadding ? PlayfairCore.prepare : PlayfairCore.prepareNoSplit;
        return prepare(text, paddingChar).text;
    }

    createPairs(text) {
        const pairs = [];
        for (let i = 0; i < text.length; i += 2) {
            pairs.push(text.slice(i, i + 2));
        }
        return pairs;
    }

    encryptPair(pair, samePairRule = 'no-change') {
        if (!this.findPosition(pair[0]) || !this.findPosition(pair[1])) return pair;
        // 同一文字ペアの特別処理は変種だけで使用する。
        const matrix = this.matrix.flat().join('');
        return pair[0] === pair[1]
            ? PlayfairCore.samePair(matrix, pair[0], samePairRule, 'enc')
            : PlayfairCore.transformPair(matrix, pair[0], pair[1], 'enc');
    }

    decryptPair(pair, samePairRule = 'no-change') {
        if (!this.findPosition(pair[0]) || !this.findPosition(pair[1])) return pair;
        // 同一文字ペアの特別処理（変種の復号時）
        const matrix = this.matrix.flat().join('');
        return pair[0] === pair[1]
            ? PlayfairCore.samePair(matrix, pair[0], samePairRule, 'dec')
            : PlayfairCore.transformPair(matrix, pair[0], pair[1], 'dec');
    }

    encrypt(plaintext, paddingChar = 'X', samePairPadding = true, samePairRule = 'no-change') {
        const result = PlayfairCore.encrypt(this.matrix.flat().join(''), plaintext, {
            padChar: paddingChar,
            variant: samePairPadding ? null : samePairRule
        });
        return {
            ...result,
            processed: result.prepared,
            encryptedPairs: result.outPairs
        };
    }

    decrypt(ciphertext, samePairRule = null, paddingChar = 'X') {
        const result = PlayfairCore.decrypt(this.matrix.flat().join(''), ciphertext, { variant: samePairRule });
        if (!result.ok) return result;
        // 本物の文字を消さないよう、候補は除去せず別に返す。
        return {
            ...result,
            decryptedPairs: result.outPairs,
            candidates: PlayfairCore.paddingCandidates(result.plaintext, paddingChar)
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlayfairCipher, PlayfairCore };
}
