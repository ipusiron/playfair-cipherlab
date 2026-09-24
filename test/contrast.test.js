const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
const pairs = [
    ['header', '--header-fg', '--header-bg'],
    ['primary', '--primary-fg', '--primary-bg'],
    ['success', '--success-fg', '--success-bg'],
    ['secondary', '--secondary-fg', '--secondary-bg'],
    ['outline', '--outline-fg', '--outline-bg'],
    ['tab', '--tab-fg', '--tab-bg'],
    ['active', '--active-fg', '--active-bg'],
    ['text', '--text-fg', '--text-bg'],
    ['error', '--error-fg', '--error-bg'],
    ['warning', '--warning-fg', '--warning-bg'],
    ['info', '--info-fg', '--info-bg'],
    ['step', '--step-fg', '--step-bg'],
    ['footer', '--footer-fg', '--footer-bg'],
    ['points', '--points-fg', '--points-bg'],
    ['source', '--source-fg', '--source-bg'],
    ['target', '--target-fg', '--target-bg'],
    ['keyword', '--keyword-fg', '--keyword-bg'],
    ['toast', '--toast-fg', '--toast-bg']
];

function luminance(hex) {
    const values = hex.match(/[a-f0-9]{2}/gi).map(value => parseInt(value, 16) / 255)
        .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

test('Recovery B-9 all recovery text states meet 4.5:1 in both themes', () => {
    for (const mode of [':root', 'body.dark-mode']) {
        const block = css.slice(css.indexOf(mode + ' {')).split('}')[0];
        const colors = Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[a-f0-9]{6});/gi)].map(m => [m[1], m[2]]));
        for (const name of ['text', 'keyword', 'analysis-selected', 'error', 'success', 'warning']) {
            const a = luminance(colors[`--${name}-fg`]), b = luminance(colors[`--${name}-bg`]);
            assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5, `${mode}: ${name}`);
        }
    }
});

test('C-5 selected analysis pairs meet 4.5:1 in both themes', () => {
    for (const mode of [':root', 'body.dark-mode']) {
        const block = css.slice(css.indexOf(mode + ' {')).split('}')[0];
        const fg = block.match(/--analysis-selected-fg:\s*(#[a-f0-9]{6});/i)[1];
        const bg = block.match(/--analysis-selected-bg:\s*(#[a-f0-9]{6});/i)[1];
        const a = luminance(fg), b = luminance(bg);
        assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5, mode);
    }
});

for (const mode of [':root', 'body.dark-mode']) {
    test(`K-6 all 18 contrast pairs: ${mode}`, () => {
        const block = css.slice(css.indexOf(mode + ' {')).split('}')[0];
        const variables = Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[a-f0-9]{6});/gi)]
            .map(match => [match[1], match[2]]));
        assert.equal(pairs.length, 18);
        for (const [label, foreground, background] of pairs) {
            assert.ok(variables[foreground], foreground);
            assert.ok(variables[background], background);
            const a = luminance(variables[foreground]);
            const b = luminance(variables[background]);
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            assert.ok(ratio >= 4.5, `${mode} ${label}: ${ratio}`);
        }
    });
}
