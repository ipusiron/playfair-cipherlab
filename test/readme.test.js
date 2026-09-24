const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { PlayfairCore: core } = require('../js/cipher.js');
const { ExerciseManager } = require('../js/exercises.js');
const { ProgressCore } = require('../js/progress.js');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const readme = read('README.md');
const ja = vm.runInNewContext(read('js/i18n.js') + ';i18n.translations.ja;', {});
const challenges = new ExerciseManager().exercises.decryption.challenges;

const headingPairs = [
    ['## 🌐 デモページ', '## 🌐 Demo'],
    ['## 📸 スクリーンショット', '## 📸 Screenshots'],
    ['## ✨ 機能', '## ✨ Features'],
    ['### 📊 学習進捗管理', '### 📊 Learning progress'],
    ['### 🔑 鍵生成', '### 🔑 Key generation'],
    ['### 🔐 暗号化・復号', '### 🔐 Encryption and decryption'],
    ['### 🎬 再生と表示', '### 🎬 Playback and display'],
    ['## 🗺️ 学習ロードマップ', '## 🗺️ Learning roadmap'],
    ['## 📖 使い方', '## 📖 How to use'],
    ['### 🔑 鍵生成', '### 🔑 Key generation'],
    ['### 🔐 暗号化で学習', '### 🔐 Learn with encryption'],
    ['### 🔓 復号でチャレンジ', '### 🔓 Take on decryption challenges'],
    ['## 🧠 プレイフェア暗号とは', '## 🧠 About the Playfair cipher'],
    ['### 🔎 背景と歴史', '### 🔎 Background and history'],
    ['### ⚙ 仕組みの概要', '### ⚙ How it works'],
    ['### 🧭 古典暗号における位置づけ', '### 🧭 Place among classical ciphers'],
    ['### 🧩 解読のされやすさと弱点', '### 🧩 Strengths and weaknesses'],
    ['#### ✅ 強み', '#### ✅ Strengths'],
    ['#### ⚠️ 弱み', '#### ⚠️ Weaknesses'],
    ['## 🔬 規則と既知解答', '## 🔬 Rules and known answers'],
    ['### 現行版からの変更点', '### Changes from the previous version'],
    ['## 🏆 チャレンジ一覧', '## 🏆 Challenges'],
    ['## 🔒 セキュリティ', '## 🔒 Security'],
    ['## 📚 教育利用', '## 📚 Educational use'],
    ['### 対象レベル', '### Target levels'],
    ['### 活用シーン', '### Use cases'],
    ['## 🔗 参考', '## 🔗 References'],
    ['## 🧪 テスト', '## 🧪 Tests'],
    ['## 📁 ディレクトリー構造', '## 📁 Directory structure'],
    ['## 💻 動作環境', '## 💻 Requirements'],
    ['## 📄 ライセンス', '## 📄 License'],
    ['## 🛠️ このツールについて', '## 🛠️ About this tool']
];

test('D-1 bilingual heading text, count, order and levels match the complete mapping', () => {
    for (const [index, source] of [readme, read('README.en.md')].entries()) {
        const headings = source.match(/^#{2,4} .+$/gm);
        assert.equal(headingPairs.length, 32);
        assert.deepEqual(headings, headingPairs.map(pair => pair[index]));
    }
});

test('D-2 history describes tactical use without the former strong-cipher claim', () => {
    const history = section('🧠 プレイフェア暗号とは');
    assert.doesNotMatch(history, /強力な暗号/);
    assert.match(history, /第二次ボーア戦争/);
    assert.match(history, /フリードマン/);
    const english = section('🧠 About the Playfair cipher', read('README.en.md'));
    assert.match(english, /Second Boer War/);
    assert.match(english, /1942, William Friedman/);
    assert.match(english, /very little security/);
});

test('D-2 all three Japanese book titles have an English language note', () => {
    const references = section('🔗 References', read('README.en.md'));
    const books = references.split('\n').filter(line => line.startsWith('- 『'));
    assert.deepEqual(books, [
        '- 『暗号の秘密』 (Japanese-language book), pp. 70–72',
        '- 『暗号解読事典』 (Japanese-language book), pp. 181–183',
        '- 『暗号事典』 (Japanese-language book), pp. 556–559'
    ]);
});

test('D-3 Japanese text in English README is confined to its switch and reference lines', () => {
    const english = read('README.en.md');
    const allowedBooks = section('🔗 References', english).split('\n')
        .filter(line => /^- 『[^』]+』 \(Japanese-language book\), pp\. [\d–]+$/.test(line));
    const japaneseLines = english.split('\n')
        .filter(line => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(line));
    assert.equal(english.split('\n')[0], 'English · [日本語](README.md)');
    assert.deepEqual(japaneseLines, ['English · [日本語](README.md)', ...allowedBooks]);
});

test('A-2 bilingual sections retain matching bullet, step and table structures', () => {
    const blocks = source => source.split(/^#{2,4} .+\n/gm).slice(1);
    const japanese = blocks(readme);
    const english = blocks(read('README.en.md'));
    for (let index = 0; index < headingPairs.length; index++) {
        const structure = block => block.split('\n')
            .filter(line => /^(?:- |\d+\. |\|)/.test(line))
            .map(line => line.startsWith('|') ? line.split('|').length : line.match(/^(?:- |\d+\. )/)[0]);
        assert.deepEqual(structure(english[index]), structure(japanese[index]), headingPairs[index][0]);
    }
    const files = (heading, source) => table(heading, source).map(row => row[0]);
    assert.deepEqual(files('🧪 Tests', read('README.en.md')), files('🧪 テスト', readme));
});

function section(heading, source = readme) {
    const start = source.indexOf(`## ${heading}\n`);
    assert.ok(start >= 0, heading);
    const end = source.indexOf('\n## ', start + 1);
    return source.slice(start, end < 0 ? undefined : end);
}

function table(heading, source = readme) {
    return section(heading, source).split('\n').filter(line => line.startsWith('|'))
        .slice(2).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
}

test('K-7 all five known-answer rows match PlayfairCore', () => {
    const rows = table('🔬 規則と既知解答');
    assert.equal(rows.length, 5);
    const inputs = [
        ['', 'HELLO'], ['', 'SEEN'], ['', 'BALLOON'], ['', 'FOXX'],
        ['PLAYFAIR EXAMPLE', 'HIDE THE GOLD IN THE TREE STUMP']
    ];
    for (const [index, [keyword, plain]] of inputs.entries()) {
        const result = core.encrypt(core.matrixFromKeyword(keyword), plain);
        assert.deepEqual(rows[index], [keyword || '既定', plain, result.prepared, result.ciphertext]);
    }
});

test('K-7 all three challenge rows and exact dictionary hints match', () => {
    const rows = table('🏆 チャレンジ一覧');
    assert.equal(rows.length, 3);
    const details = [...section('🏆 チャレンジ一覧').matchAll(/<details>([\s\S]*?)<\/details>/g)];
    assert.equal(details.length, 3);
    challenges.forEach((challenge, index) => {
        const encrypted = core.encrypt(core.matrixFromKeyword(challenge.keyword || ''), challenge.answer);
        assert.equal(encrypted.ciphertext, challenge.ciphertext);
        assert.deepEqual(rows[index], [String(challenge.level), ja[`example.${challenge.title}`],
            encrypted.ciphertext, challenge.keyword || '既定', String(challenge.points)]);
        const hints = details[index][1].split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2));
        assert.deepEqual(hints, challenge.hints.map(key => ja[key]));
        assert.ok(details[index][1].includes('`' + challenge.answer + '`'));
    });
});

test('K-7 YAML structure, key order, and fixed values match HEAD', () => {
    const metadata = source => source.match(/^<!--\r?\n---\r?\n([\s\S]*?)\r?\n---\r?\n-->/)?.[1];
    const current = metadata(readme);
    const previous = metadata(execFileSync('git', ['show', 'HEAD:README.md'], { cwd: root, encoding: 'utf8' }));
    assert.ok(current);
    assert.ok(previous);
    const keys = source => [...source.matchAll(/^([a-z_]+):/gm)].map(match => match[1]);
    assert.deepEqual(keys(current), keys(previous));
    for (const key of ['category_ja', 'category_en', 'tags']) {
        assert.match(current, new RegExp(`^${key}:\\r?\\n  - `, 'm'));
    }
    for (const key of ['id', 'slug', 'repo_url', 'demo_url', 'hub']) {
        const value = source => source.match(new RegExp(`^${key}: (.+)$`, 'm'))[1].trim();
        assert.equal(value(current), value(previous), key);
    }
    assert.match(current, /^id: day027$/m);
    assert.match(current, /^slug: playfair-cipherlab$/m);
    assert.match(current, /^hub: true$/m);
});

test('K-7 complete repository tree, with aligned comments on every line', () => {
    const tree = section('📁 ディレクトリー構造').match(/```text\n([\s\S]*?)\n```/)[1].split('\n');
    const stack = [], listed = [], columns = new Set();
    for (const [index, line] of tree.entries()) {
        assert.match(line, /# [^\s].*$/);
        columns.add(line.indexOf('#'));
        const content = line.slice(0, line.indexOf('#')).trimEnd();
        if (index === 0) {
            assert.equal(content, 'playfair-cipherlab/');
            continue;
        }
        const match = content.match(/^([│ ]*)(?:├── |└── )(.+)$/);
        assert.ok(match, content);
        const depth = match[1].length / 4;
        assert.equal(depth % 1, 0);
        stack.length = depth;
        const name = match[2];
        if (name.endsWith('/')) stack.push(name.slice(0, -1));
        else listed.push([...stack, name].join('/'));
    }
    assert.equal(columns.size, 1);
    const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
        .filter(file => !file.startsWith('.git/') && !file.startsWith('.claude/') && file !== 'server.log');
    assert.deepEqual(listed.sort(), [...new Set(files)].sort());
});

test('K-7 images, test section, and obsolete wording', () => {
    const images = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1])
        .filter(file => !/^https?:/.test(file));
    assert.equal(images.length, 4);
    for (const image of images) assert.ok(fs.existsSync(path.join(root, image)), image);
    const pngs = fs.readdirSync(path.join(root, 'assets')).filter(file => file.endsWith('.png'));
    assert.deepEqual(pngs.map(file => `assets/${file}`).sort(), images.sort());
    assert.ok(section('🧪 テスト').includes('npm test'));
    const testFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.test.js'));
    assert.equal(testFiles.length, 9);
    for (const file of testFiles) assert.ok(section('🧪 テスト').includes(`test/${file}`), file);
    for (const forbidden of ['ATTACK DAWN', 'ブラウザー間で保持', '右隣置換（標準）']) {
        assert.ok(!readme.includes(forbidden), forbidden);
    }
});

const english = read('README.en.md');
const en = vm.runInNewContext(read('js/i18n.js') + '; i18n.translations.en;', {});

for (const [lang, source, dictionary, heading] of [
    ['ja', readme, ja, '🗺️ 学習ロードマップ'], ['en', english, en, '🗺️ Learning roadmap']
]) {
    test(`H-5 ${lang} roadmap matches all nine missions, titles and points`, () => {
        const rows = table(heading, source);
        assert.equal(rows.length, 9);
        ProgressCore.MISSIONS.forEach((mission, index) => {
            assert.equal(rows[index].length, 6);
            assert.equal(rows[index][0], mission.id);
            assert.equal(rows[index][1], dictionary[`mission.group.${mission.group}`]);
            assert.equal(rows[index][2], dictionary[`mission.${mission.id}.title`]);
            assert.ok(rows[index][3].length && rows[index][4].length);
            assert.equal(rows[index][5], String(mission.points));
            assert.ok(dictionary['help.body'].includes(mission.id));
            assert.ok(dictionary['help.body'].includes(dictionary[`mission.${mission.id}.title`]));
        });
    });
}

test('H-5 English known answers and challenge data and hints match', () => {
    const rows = table('🔬 Rules and known answers', english);
    assert.equal(rows.length, 5);
    const japanese = table('🔬 規則と既知解答');
    rows.forEach((row, index) => {
        const [keyword, input] = row;
        const value = core.encrypt(core.matrixFromKeyword(keyword === 'Default' ? '' : keyword), input);
        assert.deepEqual(row, [keyword, input, value.prepared, value.ciphertext]);
        assert.deepEqual(row.slice(1), japanese[index].slice(1));
        assert.equal(keyword, japanese[index][0] === '既定' ? 'Default' : japanese[index][0]);
    });
    const challengeRows = table('🏆 Challenges', english);
    assert.equal(challengeRows.length, 3);
    const details = [...section('🏆 Challenges', english).matchAll(/<details>([\s\S]*?)<\/details>/g)];
    assert.equal(details.length, 3);
    challenges.forEach((challenge, index) => {
        const encrypted = core.encrypt(core.matrixFromKeyword(challenge.keyword || ''), challenge.answer);
        assert.deepEqual(challengeRows[index], [String(challenge.level), en[`example.${challenge.title}`],
            encrypted.ciphertext, challenge.keyword || 'Default', String(challenge.points)]);
        const hints = details[index][1].split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2));
        assert.deepEqual(hints, challenge.hints.map(key => en[key]));
        assert.ok(details[index][1].includes('`' + challenge.answer + '`'));
    });
});

test('H-5 mutual links, English text, complete parallel trees and seven image references', () => {
    assert.equal(english.split('\n')[0], 'English · [日本語](README.md)');
    assert.ok(readme.includes('[English](README.en.md)'));
    // Only the first-line Japanese language link and these three bibliography titles outside details are exempt.
    let inspected = english.replace(/^English · \[日本語\]\(README\.md\)/, 'English');
    for (const title of ['『暗号の秘密』', '『暗号解読事典』', '『暗号事典』']) {
        const references = section('🔗 References', english);
        assert.ok(references.includes(title));
        assert.ok(!/<details>[\s\S]*[\u3040-\u30ff\u4e00-\u9fff][\s\S]*<\/details>/.test(english));
        inspected = inspected.replace(title, 'Book');
    }
    assert.doesNotMatch(inspected, /[\u3040-\u30ff\u4e00-\u9fff]/);
    const trees = [section('📁 ディレクトリー構造'), section('📁 Directory structure', english)]
        .map(s => s.match(/```text\n([\s\S]*?)\n```/)[1].split('\n'));
    assert.deepEqual(trees[0].map(l => l.split('#')[0]), trees[1].map(l => l.split('#')[0]));
    for (const line of trees[1]) assert.match(line, /# [A-Za-z]/);
    assert.equal(new Set(trees[1].map(l => l.indexOf('#'))).size, 1);
    const images = source => [...source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]).filter(p => !/^https?:/.test(p));
    assert.equal(images(readme).length, 4);
    assert.equal(images(english).length, 3);
    const referenced = [...images(readme), ...images(english)];
    for (const file of referenced) assert.ok(fs.existsSync(path.join(root, file)), file);
    const pngs = ['assets', 'assets/en'].flatMap(folder => fs.readdirSync(path.join(root, folder))
        .filter(file => file.endsWith('.png')).map(file => folder + '/' + file));
    assert.deepEqual(pngs.sort(), referenced.sort());
});
test('E-3 Japanese README prose has no spaces at Japanese and ASCII boundaries', () => {
    const ranges = [[0x3000, 0x303f], [0x3040, 0x30ff], [0x4e00, 0x9fff], [0xff01, 0xff60]];
    const jp = '[' + ranges.map(([a, b]) => String.fromCodePoint(a) + '-' + String.fromCodePoint(b)).join('') + ']';
    const tick = String.fromCodePoint(0x60);
    const pattern = new RegExp(jp + ' +[A-Za-z0-9{' + tick + ']|[A-Za-z0-9}' + tick + '] +' + jp, 'g');

    const inline = new RegExp('(' + tick + '+)[^' + tick + ']*?\\1', 'g');
    const prose = readme.replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '')
        .replace(inline, tick + tick).replace(/https?:\/\/[^\s<>)]+/g, '').replace(/<[^>]*>/g, '');
    assert.deepEqual([...prose.matchAll(pattern)].map(match => match[0]), []);
});
