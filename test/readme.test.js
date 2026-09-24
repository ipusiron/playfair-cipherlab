const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { PlayfairCore: core } = require('../js/cipher.js');
const { ExerciseManager } = require('../js/exercises.js');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const readme = read('README.md');
const ja = vm.runInNewContext(read('js/i18n.js') + ';i18n.translations.ja;', {});
const challenges = new ExerciseManager().exercises.decryption.challenges;

function section(heading) {
    const start = readme.indexOf(`## ${heading}\n`);
    assert.ok(start >= 0, heading);
    const end = readme.indexOf('\n## ', start + 1);
    return readme.slice(start, end < 0 ? undefined : end);
}

function table(heading) {
    return section(heading).split('\n').filter(line => line.startsWith('|'))
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
    assert.equal(images.length, 3);
    for (const image of images) assert.ok(fs.existsSync(path.join(root, image)), image);
    const pngs = fs.readdirSync(path.join(root, 'assets')).filter(file => file.endsWith('.png'));
    assert.deepEqual(pngs.map(file => `assets/${file}`).sort(), images.sort());
    assert.ok(section('🧪 テスト').includes('npm test'));
    const testFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.test.js'));
    assert.equal(testFiles.length, 7);
    for (const file of testFiles) assert.ok(section('🧪 テスト').includes(`test/${file}`), file);
    for (const forbidden of ['ATTACK DAWN', 'ブラウザー間で保持', '右隣置換（標準）']) {
        assert.ok(!readme.includes(forbidden), forbidden);
    }
});
