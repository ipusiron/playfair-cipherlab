const PlayfairRecovery = (() => {
    const Core = typeof module !== 'undefined' && module.exports ? require('./cipher.js').PlayfairCore : PlayfairCore;
    const ALPHA = Core.ALPHABET;
    const DEFINITIONS = [
        ['recover-01', 10, 'SECURITY', 'SECURI..A.D...KL.NO..VWXZ',
            'MEET THE AGENT AT THE NORTH GATE', 'THE KEY IS UNDER THE BLUE STONE'],
        ['recover-02', 20, 'LIBRARY', '......C.E.....NO...T.VWX.',
            'THE BOOK WAS RETURNED BEFORE NOON', 'CHECK THE THIRD SHELF'],
        ['recover-03', 30, 'WHEATSTONE', '..E.T.O..................',
            'WHEATSTONE INVENTED THIS CIPHER BUT LORD PLAYFAIR PROMOTED IT', 'PENCIL AND PAPER ARE ENOUGH']
    ];
    const PROBLEMS = Object.freeze(DEFINITIONS.map(([id, points, key, given, cribPlain, secret]) => {
        const answer = Core.matrixFromKeyword(key);
        const crib = Core.encrypt(answer, cribPlain);
        const hidden = Core.encrypt(answer, secret);
        const seen = new Set();
        const pairs = [];
        crib.pairs.forEach((plain, index) => {
            if (seen.has(plain)) return;
            seen.add(plain);
            pairs.push(Object.freeze({ plain, cipher: crib.outPairs[index], kind: crib.rules[index] }));
        });
        return Object.freeze({ id, points, answer, givens: Object.freeze([...given].map(c => c === '.' ? '' : c)),
            cribPlain, cribPrepared: crib.prepared, cribCipher: crib.ciphertext, pairs: Object.freeze(pairs),
            secretCipher: hidden.ciphertext, secretPlain: hidden.prepared });
    }));

    function problem(id) {
        const p = PROBLEMS.find(p => p.id === id);
        return p ? { ...p, givens: [...p.givens], pairs: p.pairs.map(pair => ({ ...pair })) } : null;
    }

    function positions(grid) {
        if (!Array.isArray(grid) || grid.length !== 25) throw new TypeError('expected 25 cells');
        const pos = {};
        grid.forEach((letter, cell) => {
            if (letter === '') return;
            if (typeof letter !== 'string' || letter.length !== 1 || !ALPHA.includes(letter) || letter in pos) {
                throw new TypeError('expected distinct A-Z letters without J');
            }
            pos[letter] = cell;
        });
        return pos;
    }

    function gridFrom(pos) {
        const grid = Array(25).fill('');
        for (const [letter, cell] of Object.entries(pos)) grid[cell] = letter;
        return grid;
    }

    // Reference implementation: preserve branch order and conditions.
    function pairStatus(pos, pr) {
        const [a, b] = pr.plain, [c, d] = pr.cipher;
        const P = [pos[a], pos[b], pos[c], pos[d]];
        if (P.some(x => x === undefined)) {
            const rc = (x, y) => x === undefined || y === undefined || Math.floor(x / 5) === Math.floor(y / 5) || x % 5 === y % 5;
            return rc(P[0], P[2]) && rc(P[1], P[3]) ? 'open' : 'ng';
        }
        const [r1, c1, r2, c2] = [Math.floor(P[0] / 5), P[0] % 5, Math.floor(P[1] / 5), P[1] % 5];
        let e1, e2;
        if (r1 === r2) { e1 = r1 * 5 + (c1 + 1) % 5; e2 = r2 * 5 + (c2 + 1) % 5; }
        else if (c1 === c2) { e1 = ((r1 + 1) % 5) * 5 + c1; e2 = ((r2 + 1) % 5) * 5 + c2; }
        else { e1 = r1 * 5 + c2; e2 = r2 * 5 + c1; }
        return e1 === P[2] && e2 === P[3] ? 'ok' : 'ng';
    }

    function candidates(pairs, pos, l) {
        const used = new Set(Object.values(pos)); const out = [];
        for (let c = 0; c < 25; c++) {
            if (used.has(c)) continue;
            pos[l] = c;
            if (pairs.every(p => pairStatus(pos, p) !== 'ng')) out.push(c);
            delete pos[l];
        }
        return out;
    }

    function propagate(pairs, givens) {
        const pos = { ...givens }; let steps = 0, changed = true;
        while (changed) {
            changed = false;
            for (const l of ALPHA) {
                if (l in pos) continue;
                const c = candidates(pairs, pos, l);
                if (c.length === 0) return { ok: false, pos, steps };
                if (c.length === 1) { pos[l] = c[0]; steps++; changed = true; }
            }
            if (!changed) {
                const used = new Set(Object.values(pos));
                for (let cell = 0; cell < 25 && !changed; cell++) {
                    if (used.has(cell)) continue;
                    const ls = ALPHA.split('').filter(l => !(l in pos) && candidates(pairs, pos, l).includes(cell));
                    if (ls.length === 1) { pos[ls[0]] = cell; steps++; changed = true; }
                }
            }
        }
        return { ok: Object.keys(pos).length === 25, pos, steps };
    }

    function solveByDeduction(p, grid) {
        const result = propagate(p.pairs, positions(grid));
        return { grid: gridFrom(result.pos), steps: result.steps };
    }

    function hint(p, grid, level) {
        positions(grid);
        if (level === 1) return { type: 'rules' };
        if (level === 2) return { type: 'kinds', kinds: p.pairs.map(pair => pair.kind) };
        const wrong = grid.findIndex((letter, cell) => letter && letter !== p.answer[cell]);
        if (wrong !== -1) return { type: 'wrong', cell: wrong };
        const clean = p.givens.map((given, cell) => given || (grid[cell] === p.answer[cell] ? grid[cell] : ''));
        const pos = positions(clean);
        const next = propagate(p.pairs, pos).pos;
        const letter = Object.keys(next).find(letter => !(letter in pos)) || [...ALPHA].find(letter => !(letter in pos));
        return letter ? { type: 'place', letter, cell: p.answer.indexOf(letter) } : null;
    }

    function isSolved(p, grid) {
        return Array.isArray(grid) && grid.length === 25 && grid.every((letter, cell) => letter === p.answer[cell]);
    }

    return Object.freeze({ PROBLEMS, problem, solveByDeduction, hint, isSolved,
        pairStatus: (grid, pair) => pairStatus(positions(grid), pair),
        candidates: (p, grid, letter) => {
            const pos = positions(grid);
            return typeof letter === 'string' && letter.length === 1 && ALPHA.includes(letter) && !(letter in pos)
                ? candidates(p.pairs, pos, letter) : [];
        }
    });
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlayfairRecovery };
}
