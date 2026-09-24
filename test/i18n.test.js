const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dictionaries = vm.runInNewContext(read('js/i18n.js') + '; i18n.translations;', {});

test('K-4 dictionary keys match and no value is empty', () => {
    assert.deepEqual(Object.keys(dictionaries.ja).sort(), Object.keys(dictionaries.en).sort());
    for (const dictionary of Object.values(dictionaries)) {
        for (const [key, value] of Object.entries(dictionary)) {
            assert.equal(typeof value, 'string', key);
            assert.ok(value.trim().length > 0, key);
        }
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
    for (const file of ['cipher', 'exercises', 'ui', 'theme', 'help', 'theme-init', 'progress', 'guide']) {
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
