const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

test('Challenges G-2 encryption controls have labels and a live answer result', () => {
    for (const id of ['encipher-select', 'encipher-info', 'encipher-answer', 'encipher-check', 'encipher-hint', 'encipher-result']) {
        assert.equal([...html.matchAll(new RegExp(`\\bid="${id}"`, 'g'))].length, 1, id);
    }
    assert.match(html, /<label for="encipher-select"/);
    assert.match(html, /<label for="encipher-answer"/);
    assert.match(html, /id="encipher-result"[^>]*aria-live="polite"/);
    assert.ok(html.indexOf('id="encipher-select"') > html.indexOf('id="load-example"'));
    assert.ok(html.indexOf('id="encipher-select"') < html.indexOf('id="plaintext"'));
});

test('Recovery G-2 labelled section, controls and live status exist once', () => {
    for (const id of ['recovery', 'recovery-problem', 'recovery-pairs', 'recovery-grid',
        'recovery-palette', 'recovery-hint', 'recovery-reset', 'recovery-status']) {
        assert.equal([...html.matchAll(new RegExp(`\\bid="${id}"`, 'g'))].length, 1, id);
    }
    assert.match(html, /<section[^>]*id="recovery"[^>]*aria-labelledby="recovery-heading"/);
    assert.match(html, /id="recovery-status"[^>]*aria-live="polite"/);
    assert.match(html, /<label for="recovery-problem"/);
    assert.ok(html.indexOf('id="recovery"') > html.indexOf('id="analysis-result"'));
});

test('Polish C-2 Day009 link is safe, initially hidden and follows the existing analysis output', () => {
    const tag = html.match(/<a\b[^>]*id="analysis-open-frequency"[^>]*>/)[0];
    assert.equal(attribute(tag, 'target'), '_blank');
    assert.equal(attribute(tag, 'rel'), 'noopener noreferrer');
    assert.equal(attribute(tag, 'href'), undefined);
    assert.match(tag, /\bhidden\b/);
    assert.ok(html.indexOf('id="analysis-open-frequency"') > html.indexOf('id="analysis-distinct"'));
    for (const id of ['analysis-open-frequency', 'analysis-frequency-description', 'analysis-frequency-too-long']) {
        assert.equal([...html.matchAll(new RegExp(`\\bid="${id}"`, 'g'))].length, 1, id);
    }
});

test('G-3 analysis tab, labelled controls, result regions and send buttons exist', () => {
    for (const id of ['tab-analysis', 'analysis', 'analysis-sample', 'analysis-input', 'analyze-btn', 'analysis-result',
        'analysis-pairs', 'analysis-reversed-list', 'send-to-analysis-encryption', 'send-to-analysis-decryption']) {
        assert.equal([...html.matchAll(new RegExp(`\\bid="${id}"`, 'g'))].length, 1, id);
    }
    assert.match(html, /id="analysis-result"[^>]*aria-live="polite"/);
    for (const id of ['analysis-sample', 'analysis-input']) assert.match(html, new RegExp(`<label for="${id}"`));
});

test('G-2 ordered deferred head scripts with only synchronous early theme in body', () => {
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
    const headScripts = [...head.matchAll(/<script\b[^>]*>/g)].map(match => match[0]);
    assert.deepEqual(headScripts.map(tag => attribute(tag, 'src')), [
        'js/cipher.js', 'js/analysis.js', 'js/recovery.js', 'js/exercises.js', 'js/progress.js', 'js/guide.js',
        'js/ui.js', 'js/theme.js', 'js/help.js', 'js/i18n.js', 'js/main.js'
    ]);
    headScripts.forEach(tag => assert.match(tag, /\sdefer(?:\s|>)/));
    assert.match(body, /^\s*<script src="js\/theme-init\.js"><\/script>/);
    assert.deepEqual([...body.matchAll(/<script\b[^>]*>/g)].map(match => match[0]), ['<script src="js/theme-init.js">']);
    assert.doesNotMatch(html, /<script\b[^>]*(?:\sasync(?:\s|=|>)|type="module")/);
});

test('C-1 desktop header uses a symmetric grid from 769px', () => {
    const css = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
    const desktopHeader = css.match(/@media\s*\(min-width:\s*769px\)\s*\{\s*\.header-content\s*\{([^}]+)\}/);
    assert.ok(desktopHeader);
    assert.match(desktopHeader[1], /display:\s*grid\s*;/);
    assert.match(desktopHeader[1], /grid-template-columns:\s*minmax\(0,\s*1fr\) auto minmax\(0,\s*1fr\)\s*;/);
    assert.match(desktopHeader[1], /align-items:\s*center\s*;/);
});

test('K-5 CSP, referrer, noscript, and safe markup', () => {
    const csp = html.match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*>/)?.[0];
    assert.ok(csp);
    const content = attribute(csp, 'content');
    assert.match(content, /default-src 'self'/);
    assert.match(content, /script-src 'self'/);
    assert.match(content, /style-src 'self'/);
    assert.doesNotMatch(content, /unsafe-inline|frame-ancestors/);
    assert.match(html, /<meta name="referrer" content="no-referrer">/);
    assert.match(html, /<noscript>[\s\S]+?<\/noscript>/);
    assert.doesNotMatch(html, /\sstyle\s*=|\son[a-z]+\s*=/i);
    assert.doesNotMatch(html, /animations\.js/);
    assert.match(html, /<body>\s*<script src="js\/theme-init\.js"><\/script>/);
});

test('K-5 tabs, dialog, labels, button types, and external links', () => {
    const tabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(match => match[0]);
    assert.equal(tabs.length, 4);
    for (const tab of tabs) {
        assert.match(attribute(tab, 'aria-selected'), /^(true|false)$/);
        const id = attribute(tab, 'aria-controls');
        assert.match(html, new RegExp(`id="${id}"[^>]*role="tabpanel"`));
    }
    assert.match(html, /id="help-modal"[^>]*role="dialog"[^>]*aria-modal="true"/);
    for (const match of html.matchAll(/<label\b[^>]*for="([^"]+)"/g)) {
        assert.ok(html.includes(`id="${match[1]}"`), match[1]);
    }
    for (const [tag] of html.matchAll(/<button\b[^>]*>/g)) assert.equal(attribute(tag, 'type'), 'button');
    for (const [tag] of html.matchAll(/<a\b[^>]*href="https?:[^>]*>/g)) {
        assert.equal(attribute(tag, 'rel'), 'noopener noreferrer');
    }
    for (const [label] of html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label\s*>/g)) {
        if (label.includes('same-pair-rule')) assert.doesNotMatch(label, /（標準）|・標準/);
    }
});

test('H-2 roadmap and matrix controls exist; answers are outside the result', () => {
    for (const id of ['reset-matrix-btn', 'matrix-status-encryption', 'matrix-status-decryption', 'progress-next-guide']) {
        assert.ok(html.includes(`id="${id}"`), id);
    }
    assert.doesNotMatch(html, /id="(?:unlocked-levels|total-points|completed-challenges)"/);
    assert.ok(html.indexOf('id="answer-check"') > html.indexOf('id="challenge-info"'));
    assert.ok(html.indexOf('id="answer-check"') < html.indexOf('id="plaintext-section"'));
    assert.ok(html.indexOf('src="js/progress.js"') > html.indexOf('src="js/exercises.js"'));
    assert.doesNotMatch(html.match(/id="progress-toggle"[\s\S]*?<\/button>/)[0], /id="progress-next-guide"/);
    assert.doesNotMatch(html, /id="mission-M\d"/);
});

test('E-3 header subtitle keeps words intact', () => {
    const css = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
    assert.match(css, /header p\s*\{[^}]*word-break:\s*keep-all\s*;/);
});

test('H-2 guide markup and script order', () => {
    assert.match(html, /<section id="guide"[^>]*hidden[^>]*aria-labelledby="guide-title"/);
    assert.match(html, /id="guide-status"[^>]*aria-live="polite"/);
    for (const id of ['guide-title', 'guide-steps', 'guide-go', 'guide-close', 'guide-next']) {
        assert.ok(html.includes(`id="${id}"`), id);
    }
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
    assert.ok(scripts.indexOf('js/exercises.js') < scripts.indexOf('js/progress.js'));
    assert.ok(scripts.indexOf('js/progress.js') < scripts.indexOf('js/guide.js'));
    assert.ok(scripts.indexOf('js/guide.js') < scripts.indexOf('js/ui.js'));
});
