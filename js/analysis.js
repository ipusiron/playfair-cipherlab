const PlayfairAnalysis = (() => {
    const core = typeof module !== 'undefined' && module.exports
        ? require('./cipher.js').PlayfairCore : PlayfairCore;

    function analyze(text) {
        const raw = String(text).toUpperCase();
        const letters = raw.replace(/[^A-Z]/g, '');
        const ignored = [...new Set(raw.replace(/[A-Z\s]/g, ''))];
        const pairs = letters.match(/../g) || [];
        const positions = new Map();
        const doubles = [];
        pairs.forEach((pair, index) => {
            if (!positions.has(pair)) positions.set(pair, []);
            positions.get(pair).push(index);
            if (pair[0] === pair[1]) doubles.push({ pair, index });
        });
        const reversed = [];
        for (const [pair, at] of positions) {
            const reverse = pair[1] + pair[0];
            if (pair < reverse && positions.has(reverse)) {
                reversed.push({ pair, reverse, at, reverseAt: positions.get(reverse) });
            }
        }
        reversed.sort((a, b) => Math.min(a.at[0], a.reverseAt[0]) - Math.min(b.at[0], b.reverseAt[0]));
        const topPairs = [...positions].map(([pair, at]) => [pair, at.length])
            .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).slice(0, 5);
        const checks = { even: letters.length % 2 === 0, noJ: !letters.includes('J'), noDoublePair: doubles.length === 0 };
        const verdict = letters.length === 0 ? 'empty'
            : Object.values(checks).every(Boolean) ? 'consistent' : 'impossible';
        return { letters, length: letters.length, ignored, checks, doubles, reversed, topPairs,
            distinct: new Set(letters).size, verdict };
    }

    function reversePairsDecrypt(matrixString, pair) {
        const plain = core.decrypt(matrixString, pair);
        const reversePlain = core.decrypt(matrixString, [...pair].reverse().join(''));
        if (!plain.ok || !reversePlain.ok) throw new TypeError('Invalid standard pair');
        return { pair, plain: plain.plaintext, reversePlain: reversePlain.plaintext };
    }

    function frequencyAnalyzerUrl(text) {
        const trimmed = text.trim();
        if (!trimmed || trimmed.length > 5000) return null;
        return 'https://ipusiron.github.io/frequency-analyzer/?text=' + encodeURIComponent(trimmed);
    }

    return Object.freeze({ analyze, reversePairsDecrypt, frequencyAnalyzerUrl });
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlayfairAnalysis };
}
