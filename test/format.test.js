const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

for (const [file, minimum] of [
    ['css/styles.css', 1000], ['index.html', 250], ['js/ui.js', 800], ['js/cipher.js', 120], ['js/i18n.js', 500]
]) {
    test(`K-8 source line count: ${file}`, () => {
        const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
        assert.ok(lines.length >= minimum, `${file}: ${lines.length} < ${minimum}`);
    });
}

test('K-8 new test lines are at most 160 characters', () => {
    for (const file of fs.readdirSync(__dirname).filter(file => file.endsWith('.js'))) {
        const lines = fs.readFileSync(path.join(__dirname, file), 'utf8').split(/\r?\n/);
        lines.forEach((line, index) => assert.ok(line.length <= 160, `${file}:${index + 1}: ${line.length}`));
    }
});

test('K-8 JS and CSS lines are at most 160 characters; HTML at most 250', () => {
    const files = fs.readdirSync(path.join(root, 'js')).filter(file => file.endsWith('.js')).map(file => `js/${file}`);
    files.push('css/styles.css', 'index.html');
    for (const file of files) {
        const limit = file.endsWith('.html') ? 250 : 160;
        fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/).forEach((line, index) => {
            assert.ok(line.length <= limit, `${file}:${index + 1}: ${line.length}`);
        });
    }
});
