const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

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
