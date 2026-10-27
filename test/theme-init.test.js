const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('js/theme-init.js');

// Run theme-init.js with a fake storage and OS setting; return whether <html> got dark-mode.
function run({ saved = null, prefersDark = false, storageThrows = false } = {}) {
    const classes = new Set();
    const keys = [];
    const context = {
        localStorage: {
            getItem: key => {
                keys.push(key);
                if (storageThrows) throw new Error('blocked');
                return saved;
            }
        },
        matchMedia: () => ({ matches: prefersDark }),
        document: {
            documentElement: {
                classList: { toggle: (name, force) => (force ? classes.add(name) : classes.delete(name)) }
            }
        }
    };
    vm.runInNewContext(source, context);
    return { dark: classes.has('dark-mode'), keys };
}

test('T-1 without a saved theme the OS preference applies', () => {
    assert.equal(run({ prefersDark: true }).dark, true);
    assert.equal(run({ prefersDark: false }).dark, false);
});

test('T-1 a saved theme wins over the OS preference', () => {
    assert.equal(run({ saved: 'light', prefersDark: true }).dark, false);
    assert.equal(run({ saved: 'dark', prefersDark: false }).dark, true);
});

test('T-1 unexpected saved values are ignored', () => {
    assert.equal(run({ saved: 'blue', prefersDark: true }).dark, true);
    assert.equal(run({ saved: 'blue', prefersDark: false }).dark, false);
});

test('T-1 blocked storage does not throw and the OS preference applies', () => {
    assert.equal(run({ storageThrows: true, prefersDark: true }).dark, true);
    assert.equal(run({ storageThrows: true, prefersDark: false }).dark, false);
});

test('T-1 the storage key matches theme.js', () => {
    assert.deepEqual(run().keys, ['theme']);
    assert.match(read('js/theme.js'), /localStorage\.setItem\('theme',/);
});

test('T-2 theme-init.js loads synchronously in <head> after the stylesheet', () => {
    const html = read('index.html');
    const head = html.slice(0, html.indexOf('</head>'));
    assert.ok(head.includes('<script src="js/theme-init.js"></script>'), 'theme-init.js is not in <head>');
    assert.ok(head.indexOf('css/styles.css') < head.indexOf('js/theme-init.js'));
});

test('T-2 the class lives on <html> in every script and stylesheet selector', () => {
    assert.match(read('js/theme.js'), /document\.documentElement/);
    assert.doesNotMatch(read('js/theme.js') + source, /document\.body/);
    const css = read('css/styles.css');
    assert.doesNotMatch(css, /body\.dark-mode/);
    assert.match(css, /^\.dark-mode body \{/m);
});
