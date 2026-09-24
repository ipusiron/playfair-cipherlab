const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dictionaries = vm.runInNewContext(read('js/i18n.js') + '; i18n.translations;', {});

test('Polish B-1 reversal positions have singular and plural dictionary entries', () => {
    const manager = vm.runInNewContext(read('js/i18n.js') + '; i18n;', {});
    const positions = vm.runInNewContext(read('js/ui.js') + '; UI.prototype.analysisPositions;', { i18n: manager });
    for (const lang of ['ja', 'en']) {
        manager.currentLang = lang;
        assert.equal(positions([0]), lang === 'ja' ? '1組目' : 'pair 1');
        assert.equal(positions([3, 5, 8]), lang === 'ja' ? '4・6・9組目' : 'pairs 4, 6, 9');
        assert.ok(dictionaries[lang]['analysis.positions.one']);
        assert.ok(dictionaries[lang]['analysis.positions.other']);
    }
    assert.doesNotMatch(dictionaries.en['analysis.reverse-entry'], /\bpairs\b/);
});

test('Polish B-2 letter counts and ignored characters have singular and plural forms', () => {
    const manager = vm.runInNewContext(read('js/i18n.js') + '; i18n;', {});
    manager.currentLang = 'en';
    assert.equal(manager.t('analysis.check.even.one', { n: 1 }), 'Even number of letters (1 letter)');
    assert.equal(manager.t('analysis.check.even.other', { n: 2 }), 'Even number of letters (2 letters)');
    assert.equal(manager.t('analysis.distinct.one', { n: 1 }), 'Letters used: 1 distinct letter (Playfair ciphertext uses at most 25)');
    assert.equal(manager.t('analysis.distinct.other', { n: 2 }), 'Letters used: 2 distinct letters (Playfair ciphertext uses at most 25)');
    assert.equal(manager.t('analysis.ignored.one', { chars: '!' }), 'A nonletter character was ignored: !');
    assert.equal(manager.t('analysis.ignored.other', { chars: ', !' }), 'Nonletter characters were ignored: , !');
    for (const key of ['analysis.check.even', 'analysis.distinct', 'analysis.ignored']) {
        assert.equal(dictionaries.ja[key + '.one'], dictionaries.ja[key + '.other']);
    }
});

test('D-4 initially hidden labels are translated inside updateUI', () => {
    const method = vm.runInNewContext(read('js/i18n.js') + '; I18nManager.prototype.updateUI.toString();', {});
    for (const [id, key] of [
        ['finish-encryption', 'playback.finish'],
        ['finish-decryption', 'playback.finish'],
        ['candidate-label', 'padding.stripped']
    ]) {
        assert.ok(method.includes(`this.updateElement('#${id}', '${key}')`), id);
    }
});

test('C-1 hidden labels use dictionary values immediately and on language changes', () => {
    const elements = Object.fromEntries(['finish-encryption', 'finish-decryption', 'candidate-label']
        .map(id => ['#' + id, { textContent: '' }]));
    const document = {
        documentElement: {},
        querySelector: selector => elements[selector] || null,
        querySelectorAll: () => [],
        getElementById: () => ({ setAttribute() {} })
    };
    const manager = vm.runInNewContext(read('js/i18n.js') + '; i18n;', {
        document, window: { dispatchEvent() {} }, CustomEvent: function () {}
    });
    for (const name of ['updateDropdownOptions', 'updateFooter', 'updateAnimationControls', 'updateHelpModalContent']) {
        manager[name] = () => {};
    }
    for (const language of ['en', 'ja', 'en']) {
        manager.currentLang = language;
        manager.updateUI();
        assert.equal(elements['#finish-encryption'].textContent, dictionaries[language]['playback.finish']);
        assert.equal(elements['#finish-decryption'].textContent, dictionaries[language]['playback.finish']);
        assert.equal(elements['#candidate-label'].textContent, dictionaries[language]['padding.stripped']);
    }
});

test('C-1 footer construction does not use innerHTML', () => {
    const method = vm.runInNewContext(read('js/i18n.js') + '; I18nManager.prototype.updateFooter.toString();', {});
    assert.doesNotMatch(method, /innerHTML/);
    assert.match(method, /document\.createElement\('a'\)/);
    assert.match(method, /textContent/);
});

test('C-1 restart guidance includes the displayed button name in both languages', () => {
    for (const dictionary of Object.values(dictionaries)) {
        const label = dictionary['encrypt.restart'].replace(/^\p{Extended_Pictographic}\s*/u, '');
        assert.ok(dictionary['guide.restart'].includes(label));
    }
});

test('B-1 help playback names match the displayed controls', () => {
    for (const dictionary of Object.values(dictionaries)) {
        for (const key of ['anim.prev', 'anim.next', 'playback.play', 'playback.pause', 'encrypt.restart', 'playback.finish']) {
            const label = dictionary[key].replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim();
            assert.ok(dictionary['help.body'].includes(label), key);
        }
    }
});

test('B-2 footer keeps its exact text and safe link through language changes', () => {
    const footer = {
        nodes: [],
        set textContent(value) { this.nodes = [value]; },
        append(...nodes) { this.nodes.push(...nodes); }
    };
    const document = {
        querySelector: selector => selector === 'footer .footer' ? footer : null,
        createElement: tag => { assert.equal(tag, 'a'); return {}; }
    };
    const manager = vm.runInNewContext(read('js/i18n.js') + '; i18n;', { document });
    for (const lang of ['ja', 'en', 'ja']) {
        manager.currentLang = lang;
        manager.updateFooter();
        const [prefix, link, suffix] = footer.nodes;
        assert.equal(footer.nodes.length, 3);
        assert.equal(link.href, 'https://github.com/ipusiron/playfair-cipherlab');
        assert.equal(link.target, '_blank');
        assert.equal(link.rel, 'noopener noreferrer');
        assert.equal(link.textContent, 'ipusiron/playfair-cipherlab');
        assert.equal(prefix + link.textContent + suffix, lang === 'ja'
            ? '🔗 GitHubリポジトリー（ipusiron/playfair-cipherlab）'
            : '🔗 GitHub repository (ipusiron/playfair-cipherlab)');
    }
});

test('K-4 dictionary keys match and no value is empty', () => {
    assert.deepEqual(Object.keys(dictionaries.ja).sort(), Object.keys(dictionaries.en).sort());
    for (const dictionary of Object.values(dictionaries)) {
        for (const [key, value] of Object.entries(dictionary)) {
            assert.equal(typeof value, 'string', key);
            assert.ok(value.trim().length > 0, key);
        }
    }
});
test('E-3 Japanese dictionary text has no spaces at Japanese and ASCII boundaries', () => {
    const ranges = [[0x3000, 0x303f], [0x3040, 0x30ff], [0x4e00, 0x9fff], [0xff01, 0xff60]];
    const jp = '[' + ranges.map(([a, b]) => String.fromCodePoint(a) + '-' + String.fromCodePoint(b)).join('') + ']';
    const tick = String.fromCodePoint(0x60);
    const pattern = new RegExp(jp + ' +[A-Za-z0-9{' + tick + ']|[A-Za-z0-9}' + tick + '] +' + jp, 'g');

    for (const [key, value] of Object.entries(dictionaries.ja)) {
        const text = value.replace(/<[^>]*>/g, '').replace(/https?:\/\/[^\s<>)]+/g, '');
        assert.deepEqual([...text.matchAll(pattern)].map(match => match[0]), [], key);
    }
});


test('K-4 all literal translation calls exist', () => {
    for (const file of fs.readdirSync(path.join(root, 'js')).filter(file => file.endsWith('.js'))) {
        const source = read(`js/${file}`);
        for (const match of source.matchAll(/(?:i18n|this)\.t\(['"]([^'"]+)['"]/g)) {
            assert.ok(match[1] in dictionaries.ja, `${file}: ${match[1]}`);
        }
    }
});

function withoutComments(source) {
    let result = '';
    let quote = '';
    for (let i = 0; i < source.length; i += 1) {
        const c = source[i];
        if (quote) {
            result += c;
            if (c === '\\') result += source[++i] || '';
            else if (c === quote) quote = '';
        } else if (c === '"' || c === "'" || c === '`') {
            quote = c;
            result += c;
        } else if (c === '/' && source[i + 1] === '/') {
            while (i < source.length && source[i] !== '\n') i += 1;
            result += '\n';
        } else if (c === '/' && source[i + 1] === '*') {
            i += 2;
            while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i += 1;
            i += 1;
        } else result += c;
    }
    return result;
}

test('K-4 no Japanese literals outside the dictionary', () => {
    const ranges = [[0x3040, 0x30ff], [0x4e00, 0x9fff], [0xff01, 0xff60]];
    const pattern = new RegExp('[' + ranges.map(([a, b]) => String.fromCodePoint(a) + '-' + String.fromCodePoint(b)).join('') + ']');
    for (const file of ['cipher', 'analysis', 'recovery', 'exercises', 'ui', 'theme', 'help', 'theme-init', 'progress', 'guide']) {
        assert.equal(pattern.test(withoutComments(read(`js/${file}.js`))), false, file);
    }
});

test('K-4 help describes variants as nonstandard', () => {
    assert.match(dictionaries.en['help.body'], /nonstandard/);
    assert.match(dictionaries.ja['help.body'], /標準ではありません/);
    assert.doesNotMatch(dictionaries.ja['help.body'], /右隣の文字に置換（標準）/);
    assert.doesNotMatch(dictionaries.en['help.body'], /right.shift\s*\(standard\)/i);
    for (const lang of ['ja', 'en']) {
        assert.match(dictionaries[lang]['help.body'], /THE QUICK BROWN FOX/);
        assert.match(dictionaries[lang]['help.body'], /HELXLO/);
    }
});

test('E-1 initial language priority never writes storage', () => {
    for (const [query, saved, browser, expected] of [
        ['?lang=en', 'ja', 'ja-JP', 'en'], ['?lang=ja', 'en', 'en-US', 'ja'],
        ['', 'en', 'ja-JP', 'en'], ['', 'ja', 'en-US', 'ja'],
        ['', null, 'ja-JP', 'ja'], ['', null, 'en-US', 'en'],
        ['?lang=xx', 'en', 'ja-JP', 'en'], ['?lang=xx', 'bad', 'fr-FR', 'en']
    ]) {
        const context = { URLSearchParams, location: { search: query }, navigator: { language: browser },
            localStorage: { getItem: () => saved, setItem: () => assert.fail('must not save on load') } };
        assert.equal(vm.runInNewContext(read('js/i18n.js') + '; i18n.currentLang;', context), expected);
    }
    const context = { URLSearchParams, location: { search: '' }, navigator: { language: 'ja-JP' },
        localStorage: { getItem: () => { throw Error('blocked'); } } };
    assert.equal(vm.runInNewContext(read('js/i18n.js') + '; i18n.currentLang;', context), 'ja');
});

test('E-2 matrix descriptions have no duplicate label prefix', () => {
    const jaPrefix = String.fromCodePoint(0x9375, 0x8868);
    for (const key of ['matrix.default', 'matrix.keyword', 'matrix.matrix']) {
        assert.equal(dictionaries.ja[key].startsWith(jaPrefix), false, key);
        assert.equal(dictionaries.en[key].startsWith('Matrix'), false, key);
    }
});
