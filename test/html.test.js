const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

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
    assert.equal(tabs.length, 3);
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
