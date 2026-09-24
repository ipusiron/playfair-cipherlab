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
    assert.equal(testFiles.length, 8);
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
