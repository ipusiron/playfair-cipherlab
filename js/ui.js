class UI {
    constructor() {
        this.cipher = new PlayfairCipher();
        this.exerciseManager = new ExerciseManager();
        this.progress = this.loadProgress();
        this.matrixSource = { type: 'default' };
        this.loaded = null;
        this.hintsUsed = {};
        this.rulesSeenNow = [];
        this.lastCorrect = null;
        this.renderedDone = { encryption: 0, decryption: 0 };
        this.currentTab = 'key-generation';
        this.playback = {
            encryption: { steps: [], done: 0, playing: false, timerId: null },
            decryption: { steps: [], done: 0, playing: false, timerId: null }
        };
        this.results = { encryption: null, decryption: null };
        this.analysisResult = null;
        this.selectedReversed = null;
        this.analysisEmpty = false;
        this.currentChallenge = null;
        this.selectedChallenge = null;
        this.notices = {};
        this.recoveryState = null;
        this.recoveryHints = {};
        this.lastRecoverySolved = null;
    }

    init() {
        this.setupTabs();
        this.setupKeyGeneration();
        this.setupEncryption();
        this.setupDecryption();
        this.setupAnalysis();
        this.setupRecovery();
        this.setupExercises();
        this.setupPlaybackControls();
        this.displayMatrix('key-matrix');
        this.setupI18n();
        this.updateMatrixStatus();
        this.guide = new Guide(this);
    }

    setupI18n() {
        // Listen for language changes
        window.addEventListener('languageChanged', (event) => {
            this.updateDynamicTexts();
        });
    }

    updateDynamicTexts() {
        document.getElementById('toast').classList.add('hidden');
        for (const [id, notice] of Object.entries(this.notices)) {
            document.getElementById(id).textContent = i18n.t(notice.key, notice.params);
        }
        this.renderHints();
        // Update example categories
        this.updateExampleCategories();
        // Update progress summary
        this.updateProgressDisplay();
        this.updateMatrixStatus();
        // Update any dynamic hint texts
        this.updateHintButton();
        // Force update dropdown contents
        this.updateAllDropdownContents();
        // Update challenge info if displayed
        this.updateChallengeInfoDisplay();
        this.render('encryption');
        this.render('decryption');
        this.renderAnalysis();
        this.renderRecovery();
    }

    setupRecovery() {
        const grid = document.getElementById('recovery-grid');
        const palette = document.getElementById('recovery-palette');
        for (let cell = 0; cell < 25; cell++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.cell = cell;
            button.addEventListener('click', () => this.selectRecoveryCell(cell));
            grid.appendChild(button);
        }
        for (const letter of PlayfairCore.ALPHABET) {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.letter = letter;
            button.addEventListener('click', () => this.placeRecoveryLetter(letter));
            palette.appendChild(button);
        }
        grid.addEventListener('keydown', event => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -5, ArrowDown: 5 };
            const cell = this.recoveryState.selected;
            if (Object.hasOwn(moves, event.key)) {
                event.preventDefault();
                this.selectRecoveryCell((cell + moves[event.key] + 25) % 25, true);
            } else if (/^[a-z]$/i.test(event.key)) {
                event.preventDefault();
                this.placeRecoveryLetter(event.key.toUpperCase().replace('J', 'I'));
            } else if (['Backspace', 'Delete'].includes(event.key)) {
                event.preventDefault();
                this.placeRecoveryLetter('');
            }
        });
        document.getElementById('recovery-problem').addEventListener('change', event => this.startRecovery(event.target.value));
        document.getElementById('recovery-reset').addEventListener('click', () => this.startRecovery(this.recoveryState.p.id));
        document.getElementById('recovery-hint').addEventListener('click', () => this.showRecoveryHint());
        this.startRecovery('recover-01');
    }

    isRecoveryLocked(id) {
        return ProgressCore.isLocked(this.progress, id);
    }

    startRecovery(id) {
        const p = PlayfairRecovery.problem(id);
        if (!p || this.isRecoveryLocked(id)) return;
        this.recoveryState = { p, grid: [...p.givens], selected: p.givens.indexOf(''), wrong: -1, notice: null };
        this.renderRecovery();
        this.guide?.render();
    }

    selectRecoveryCell(cell, focus = false) {
        this.recoveryState.selected = cell;
        this.renderRecovery();
        if (focus) document.querySelector(`#recovery-grid [data-cell="${cell}"]`).focus();
    }

    placeRecoveryLetter(letter) {
        const s = this.recoveryState, cell = s.selected;
        if (s.p.givens[cell] || (letter && s.p.givens.includes(letter))) {
            s.notice = { key: 'recovery.fixed' };
        } else {
            const from = letter ? s.grid.indexOf(letter) : -1;
            if (from >= 0 && from !== cell) {
                s.grid[from] = '';
                s.notice = { key: 'recovery.moved', params: { letter, row: Math.floor(from / 5) + 1, col: from % 5 + 1 } };
            } else s.notice = null;
            s.grid[cell] = letter;
            s.wrong = -1;
            this.completeRecovery();
        }
        this.renderRecovery();
        this.guide?.render();
    }

    completeRecovery() {
        const s = this.recoveryState;
        if (PlayfairRecovery.isSolved(s.p, s.grid)) {
            this.lastRecoverySolved = s.p.id;
            this.recordProgress({ type: 'recovery-solved', id: s.p.id, hintsUsed: this.recoveryHints[s.p.id] || 0 });
        }
    }

    showRecoveryHint() {
        const s = this.recoveryState;
        const count = (this.recoveryHints[s.p.id] || 0) + 1;
        this.recoveryHints[s.p.id] = count;
        const h = PlayfairRecovery.hint(s.p, s.grid, Math.min(count, 3));
        s.notice = null;
        s.wrong = -1;
        if (h?.type === 'wrong') {
            s.wrong = h.cell;
            s.selected = h.cell;
            s.notice = { key: 'recovery.wrong' };
        } else if (h?.type === 'place') {
            s.grid[h.cell] = h.letter;
            s.selected = h.cell;
            s.notice = { key: 'recovery.placed', params: { letter: h.letter, row: Math.floor(h.cell / 5) + 1, col: h.cell % 5 + 1 } };
            this.completeRecovery();
        }
        this.renderRecovery();
        this.guide?.render();
    }

    renderRecovery() {
        const s = this.recoveryState;
        if (!s) return;
        const count = this.recoveryHints[s.p.id] || 0;
        const select = document.getElementById('recovery-problem');
        if (!select.options.length) for (const p of PlayfairRecovery.PROBLEMS) {
            const option = document.createElement('option');
            option.value = p.id;
            select.appendChild(option);
        }
        [...select.options].forEach((option, index) => {
            option.disabled = this.isRecoveryLocked(option.value);
            option.textContent = i18n.t(`recovery.problem.${option.value}`);
            if (option.disabled) option.textContent += ' — ' + i18n.t('recovery.locked', { previous: `R${index}` });
        });
        select.value = s.p.id;
        document.getElementById('recovery-crib-plain').textContent = s.p.cribPlain;
        const prepared = document.getElementById('recovery-crib-prepared');
        const inserted = PlayfairCore.prepare(s.p.cribPlain).inserted;
        prepared.replaceChildren(...[...s.p.cribPrepared].map((letter, index) => {
            const span = document.createElement(inserted.includes(index) ? 'mark' : 'span');
            span.textContent = letter;
            if (inserted.includes(index)) {
                span.className = 'recovery-inserted';
                span.title = i18n.t('recovery.inserted');
            }
            return span;
        }));
        document.getElementById('recovery-crib-cipher').textContent = s.p.cribCipher;
        [...document.querySelectorAll('#recovery-grid button')].forEach((button, cell) => {
            const given = !!s.p.givens[cell], letter = s.grid[cell];
            const key = given ? 'recovery.cell.given' : letter ? 'recovery.cell.letter' : 'recovery.cell.empty';
            button.textContent = letter || '·';
            button.setAttribute('aria-label', i18n.t(key, { row: Math.floor(cell / 5) + 1, col: cell % 5 + 1, letter }));
            button.setAttribute('aria-pressed', String(cell === s.selected));
            button.tabIndex = cell === s.selected ? 0 : -1;
            button.classList.toggle('recovery-given', given);
            button.classList.toggle('recovery-wrong', cell === s.wrong);
        });
        for (const button of document.querySelectorAll('#recovery-palette button')) {
            const letter = button.dataset.letter, used = s.grid.includes(letter);
            button.textContent = letter + (used ? ' ✓' : '');
            button.disabled = s.p.givens.includes(letter);
            button.setAttribute('aria-label', i18n.t(used ? 'recovery.letter.used' : 'recovery.letter', { letter }));
        }
        const statuses = s.p.pairs.map(pair => PlayfairRecovery.pairStatus(s.grid, pair));
        document.getElementById('recovery-pairs').replaceChildren(...s.p.pairs.map((pair, index) => {
            const li = document.createElement('li');
            li.dataset.pair = pair.plain;
            li.dataset.state = statuses[index];
            li.className = 'recovery-pair recovery-' + statuses[index];
            li.textContent = `${pair.plain}→${pair.cipher} ` + i18n.t(`recovery.pair.${statuses[index]}`);
            if (count >= 2) li.textContent += ' · ' + i18n.t(`rule.name.${pair.kind}`);
            return li;
        }));
        document.getElementById('recovery-rules').hidden = !count;
        const hintCountKey = count === 1 ? 'recovery.hints.one' : 'recovery.hints.other';
        document.getElementById('recovery-hint-count').textContent = i18n.t(hintCountKey, { n: count });
        document.getElementById('recovery-hint').textContent = i18n.t('recovery.hint', { n: Math.min(count + 1, 3) });
        const solved = PlayfairRecovery.isSolved(s.p, s.grid);
        document.getElementById('recovery-hint').disabled = solved;
        const status = i18n.t('recovery.status', { n: s.grid.filter(Boolean).length,
            k: statuses.filter(x => x === 'ok').length, N: statuses.length, m: statuses.filter(x => x === 'ng').length });
        const separator = i18n.currentLang === 'ja' ? String.fromCodePoint(0x3002) : ' ';
        const notice = s.notice ? separator + i18n.t(s.notice.key, s.notice.params) : '';
        const full = !solved && s.grid.every(Boolean) ? separator + i18n.t('recovery.full-wrong') : '';
        const statusNode = document.getElementById('recovery-status');
        const message = status + notice + full + (solved ? separator + i18n.t('recovery.solved') : '');
        if (statusNode.textContent !== message) statusNode.textContent = message;
        document.getElementById('recovery-result').hidden = !solved;
        const plain = solved ? PlayfairCore.decrypt(s.grid.join(''), s.p.secretCipher).plaintext : '';
        document.getElementById('recovery-secret-cipher').textContent = solved ? s.p.secretCipher : '';
        document.getElementById('recovery-secret-plain').textContent = plain;
        document.getElementById('recovery-secret-stripped').textContent = PlayfairCore.stripCandidates(plain, PlayfairCore.paddingCandidates(plain));
    }

    updateExampleCategories() {
        // Update category dropdown options
        const categorySelect = document.getElementById('example-category');
        if (categorySelect) {
            // Update the first option (placeholder)
            if (categorySelect.options.length > 0) {
                categorySelect.options[0].textContent = i18n.t('dropdown.select-category');
            }
            
            // Update category names
            for (let i = 1; i < categorySelect.options.length; i++) {
                const option = categorySelect.options[i];
                const translatedCategory = this.translateCategory(option.value);
                if (translatedCategory) {
                    option.textContent = translatedCategory;
                }
            }
        }
    }

    translateCategory(category) {
        const key = `category.${category}`;
        const translated = i18n.t(key);
        
        // If translation exists and is different from the key (i.e., a translation was found)
        return translated !== key ? translated : category;
    }

    updateAllDropdownContents() {
        // Re-trigger category population to update with translations
        const categorySelect = document.getElementById('example-category');
        if (categorySelect && categorySelect.value) {
            const value = document.getElementById('example-list').value;
            this.populateExampleList(categorySelect.value);
            document.getElementById('example-list').value = value;
        }
        
        const practiceTypeSelect = document.getElementById('practice-type');
        if (practiceTypeSelect && practiceTypeSelect.value) {
            const value = document.getElementById('practice-list').value;
            this.populatePracticeList(practiceTypeSelect.value);
            document.getElementById('practice-list').value = value;
        }
    }

    populateExampleList(selectedCategory) {
        const exampleSelect = document.getElementById('example-list');
        const categories = this.exerciseManager.getExamplesByCategory('encryption');
        
        this.resetSelect(exampleSelect, 'dropdown.select-example');
        
        if (selectedCategory && categories[selectedCategory]) {
            const examples = categories[selectedCategory];
            examples.forEach(example => {
                const option = document.createElement('option');
                option.value = example.id;
                const translatedTitle = i18n.t(`example.${example.title}`) !== `example.${example.title}` 
                    ? i18n.t(`example.${example.title}`) 
                    : example.title;
                option.textContent = `${translatedTitle} - "${example.plaintext}"`;
                exampleSelect.appendChild(option);
            });
        }
    }

    populatePracticeList(selectedType) {
        const practiceSelect = document.getElementById('practice-list');
        
        this.resetSelect(practiceSelect, 'dropdown.select-task');
        
        if (selectedType === 'practice') {
            const practices = this.exerciseManager.getPracticesByCategory();
            Object.keys(practices).forEach(category => {
                const optgroup = document.createElement('optgroup');
                const translatedCategory = i18n.t(`category.${category}`) !== `category.${category}` 
                    ? i18n.t(`category.${category}`) 
                    : category;
                optgroup.label = translatedCategory;
                practices[category].forEach(practice => {
                    const option = document.createElement('option');
                    option.value = practice.id;
                    const translatedTitle = i18n.t(`example.${practice.title}`) !== `example.${practice.title}` 
                        ? i18n.t(`example.${practice.title}`) 
                        : practice.title;
                    option.textContent = `${translatedTitle} - ${practice.ciphertext}`;
                    optgroup.appendChild(option);
                });
                practiceSelect.appendChild(optgroup);
            });
        } else if (selectedType === 'challenge') {
            const challenges = this.exerciseManager.getChallengesByLevel('decryption');
            Object.keys(challenges).sort().forEach(level => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = i18n.t('level.label', { level });
                challenges[level].forEach(challenge => {
                    const option = document.createElement('option');
                    option.value = challenge.id;
                    const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
                        ? i18n.t(`example.${challenge.title}`) 
                        : challenge.title;
                    option.textContent = `${translatedTitle} (${challenge.points}pt)`;
                    
                    if (ProgressCore.isLocked(this.progress, challenge.id)) {
                        option.disabled = true;
                        const lockText = i18n.t('level.locked');
                        option.textContent += lockText;
                    }
                    
                    if (Object.hasOwn(this.progress.challenges, challenge.id)) {
                        option.textContent += ' ✓';
                    }
                    
                    optgroup.appendChild(option);
                });
                practiceSelect.appendChild(optgroup);
            });
        }
    }

    updateChallengeInfoDisplay() {
        // チャレンジ情報が表示されている場合は再表示
        if (this.selectedChallenge) {
            const challengeInfo = document.getElementById('challenge-info');
            if (challengeInfo && !challengeInfo.classList.contains('hidden')) {
                this.displayChallengeInfo(this.selectedChallenge);
            }
        }
        
        // 現在アクティブなチャレンジも更新
        if (this.currentChallenge) {
            const answerCheck = document.getElementById('answer-check');
            if (answerCheck && !answerCheck.classList.contains('hidden')) {
                // ヒントボタンのテキストを更新
                this.updateHintButton();
            }
        }
    }

    resetSelect(select, key) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = i18n.t(key);
        select.replaceChildren(option);
    }

    setNotice(id, key, params = {}) {
        this.notices[id] = { key, params };
        document.getElementById(id).textContent = i18n.t(key, params);
    }

    updateHintButton() {
        const button = document.getElementById('hint-button');
        const hints = this.currentChallenge ? this.currentChallenge.hints : [];
        const shown = Number(document.getElementById('hint-display').dataset.hintIndex || 0);
        const complete = hints.length > 0 && shown >= hints.length;
        const key = complete ? 'decrypt.hint-complete' : shown ? 'decrypt.hint-next' : 'decrypt.hint';
        const counter = document.createElement('span');
        counter.id = 'hint-counter';
        counter.className = 'hint-counter';
        counter.textContent = complete ? i18n.t('hint.complete') : `(${shown + 1}/${hints.length || 4})`;
        button.replaceChildren(document.createTextNode(i18n.t(key) + ' '), counter);
        button.disabled = complete;
    }

    renderHints() {
        const display = document.getElementById('hint-display');
        display.replaceChildren();
        if (!this.currentChallenge) return;
        const shown = Number(display.dataset.hintIndex || 0);
        for (const key of this.currentChallenge.hints.slice(0, shown)) {
            const line = document.createElement('p');
            line.textContent = '💡 ' + i18n.t(key);
            display.appendChild(line);
        }
        display.classList.toggle('hidden', shown === 0);
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', event => {
                if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                const delta = event.key === 'ArrowRight' ? 1 : -1;
                const target = tabButtons[(index + delta + tabButtons.length) % tabButtons.length];
                target.focus();
                target.click();
            });
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', String(btn === button));
                    btn.tabIndex = btn === button ? 0 : -1;
                });
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                if (this.playback[this.currentTab]) this.stopPlayback(this.currentTab);
                this.currentTab = targetTab;
                
                if (targetTab === 'encryption') {
                    this.render('encryption');
                } else if (targetTab === 'decryption') {
                    this.render('decryption');
                }
            });
        });
    }

    setupAnalysis() {
        const input = document.getElementById('analysis-input');
        const sample = document.getElementById('analysis-sample');
        input.addEventListener('input', () => {
            sample.value = '';
            this.invalidateAnalysis();
        });
        sample.addEventListener('change', () => {
            input.value = sample.value;
            this.invalidateAnalysis();
        });
        document.getElementById('analyze-btn').addEventListener('click', () => this.analyzeCiphertext());
        for (const tab of ['encryption', 'decryption']) {
            document.getElementById('send-to-analysis-' + tab).addEventListener('click', () => {
                input.value = tab === 'encryption' ? document.getElementById('ciphertext').textContent
                    : document.getElementById('ciphertext-input').value;
                sample.value = '';
                document.getElementById('tab-analysis').click();
                this.analyzeCiphertext();
                input.focus();
            });
        }
    }

    invalidateAnalysis() {
        this.analysisResult = null;
        this.selectedReversed = null;
        this.analysisEmpty = false;
        this.renderAnalysis();
    }

    analyzeCiphertext() {
        const result = PlayfairAnalysis.analyze(document.getElementById('analysis-input').value);
        this.analysisResult = result.verdict === 'empty' ? null : result;
        this.selectedReversed = null;
        this.analysisEmpty = result.verdict === 'empty';
        this.renderAnalysis();
        this.recordProgress({ type: 'analyzed', verdict: result.verdict, reversedCount: result.reversed.length });
    }

    analysisBadge(index) {
        return index < 20 ? String.fromCodePoint(0x2460 + index) : `(${index + 1})`;
    }

    analysisPositions(positions) {
        return i18n.t(`analysis.positions.${positions.length === 1 ? 'one' : 'other'}`, {
            at: positions.map(n => n + 1).join(i18n.t('analysis.position-separator'))
        });
    }

    renderAnalysis() {
        const result = this.analysisResult;
        document.getElementById('analysis-empty').textContent = this.analysisEmpty ? i18n.t('analysis.empty') : '';
        document.getElementById('analysis-result').hidden = !result;
        const frequencyLink = document.getElementById('analysis-open-frequency');
        frequencyLink.removeAttribute('href');
        frequencyLink.hidden = true;
        document.getElementById('analysis-frequency-description').hidden = true;
        document.getElementById('analysis-frequency-too-long').hidden = true;
        if (!result) {
            for (const id of ['analysis-verdict', 'analysis-checks', 'analysis-ignored', 'analysis-pairs',
                'analysis-reversed-list', 'analysis-top-pairs', 'analysis-distinct', 'analysis-decrypted', 'matrix-status-analysis']) {
                document.getElementById(id).replaceChildren();
            }
            document.getElementById('analysis-selection').hidden = true;
            return;
        }
        const verdict = document.getElementById('analysis-verdict');
        verdict.textContent = i18n.t(`analysis.${result.verdict}`);
        verdict.classList.toggle('analysis-impossible', result.verdict === 'impossible');
        const checks = document.getElementById('analysis-checks');
        checks.replaceChildren();
        for (const name of ['even', 'noJ', 'noDoublePair']) {
            const item = document.createElement('li');
            item.dataset.check = name;
            item.dataset.pass = String(result.checks[name]);
            const suffix = name === 'even' ? `.${result.length === 1 ? 'one' : 'other'}` : '';
            item.textContent = (result.checks[name] ? '✓ ' : '✗ ') + i18n.t(`analysis.check.${name}${suffix}`, { n: result.length });
            if (name === 'noDoublePair' && result.doubles.length) {
                item.textContent += ': ' + result.doubles.map(({ pair, index }) =>
                    i18n.t('analysis.double', { n: index + 1, pair })).join(', ');
            }
            checks.appendChild(item);
        }
        document.getElementById('analysis-ignored').textContent = result.ignored.length
            ? i18n.t(`analysis.ignored.${result.ignored.length === 1 ? 'one' : 'other'}`, { chars: result.ignored.join(' ') }) : '';
        const reversedLookup = new Map();
        result.reversed.forEach((entry, index) => {
            reversedLookup.set(entry.pair, index);
            reversedLookup.set(entry.reverse, index);
        });
        const pairs = document.getElementById('analysis-pairs');
        const fragment = document.createDocumentFragment();
        for (let offset = 0; offset < result.letters.length; offset += 2) {
            const pair = result.letters.slice(offset, offset + 2);
            const item = document.createElement('li');
            item.className = 'analysis-pair';
            item.dataset.pair = pair;
            item.dataset.index = offset / 2;
            const number = document.createElement('span');
            number.className = 'analysis-pair-number';
            number.textContent = i18n.t('analysis.pair-number', { n: offset / 2 + 1 });
            const letters = document.createElement('strong');
            letters.textContent = pair;
            item.append(number, letters);
            const double = pair.length === 2 && pair[0] === pair[1];
            item.classList.toggle('analysis-double', double);
            if (double || reversedLookup.has(pair)) {
                const badge = document.createElement('span');
                badge.className = 'analysis-badge';
                badge.textContent = double ? '✗' : this.analysisBadge(reversedLookup.get(pair));
                badge.setAttribute('aria-label', i18n.t(double ? 'analysis.double-mark' : 'analysis.reverse-mark', { n: badge.textContent }));
                item.appendChild(badge);
            }
            fragment.appendChild(item);
        }
        pairs.replaceChildren(fragment);
        const list = document.getElementById('analysis-reversed-list');
        list.replaceChildren();
        result.reversed.forEach((entry, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline analysis-reversed-button';
            button.dataset.pair = entry.pair;
            button.textContent = i18n.t('analysis.reverse-entry', { badge: this.analysisBadge(index), pair: entry.pair,
                reverse: entry.reverse, at: this.analysisPositions(entry.at), reverseAt: this.analysisPositions(entry.reverseAt) });
            button.addEventListener('click', () => {
                this.selectedReversed = entry;
                this.renderAnalysisSelection();
                this.recordProgress({ type: 'reversed-selected' });
            });
            list.appendChild(button);
        });
        if (!result.reversed.length) list.textContent = i18n.t('analysis.no-reversed');
        const rows = result.topPairs.map(([pair, count]) => {
            const row = document.createElement('tr');
            for (const value of [pair, count]) {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            }
            return row;
        });
        document.getElementById('analysis-top-pairs').replaceChildren(...rows);
        document.getElementById('analysis-distinct').textContent =
            i18n.t(`analysis.distinct.${result.distinct === 1 ? 'one' : 'other'}`, { n: result.distinct });
        const frequencyUrl = PlayfairAnalysis.frequencyAnalyzerUrl(document.getElementById('analysis-input').value);
        if (frequencyUrl) {
            frequencyLink.href = frequencyUrl;
            frequencyLink.hidden = false;
            document.getElementById('analysis-frequency-description').hidden = false;
        } else {
            document.getElementById('analysis-frequency-too-long').hidden = false;
        }
        this.renderAnalysisSelection();
    }

    renderAnalysisSelection() {
        const selected = this.selectedReversed;
        document.getElementById('analysis-selection').hidden = !selected;
        for (const item of document.querySelectorAll('#analysis-pairs li')) {
            item.classList.toggle('analysis-selected', !!selected && [selected.pair, selected.reverse].includes(item.dataset.pair));
        }
        for (const button of document.querySelectorAll('#analysis-reversed-list button')) {
            button.setAttribute('aria-pressed', String(button.dataset.pair === selected?.pair));
        }
        if (!selected) return;
        const text = document.getElementById('analysis-decrypted');
        if (selected.pair.includes('J')) {
            text.textContent = i18n.t('analysis.no-j-decrypt');
        } else {
            const decrypted = PlayfairAnalysis.reversePairsDecrypt(this.getCurrentMatrixString(), selected.pair);
            text.textContent = i18n.t('analysis.decrypted', { ...decrypted, reverse: selected.reverse });
        }
        document.getElementById('matrix-status-analysis').textContent = i18n.t('matrix.status', { description: this.matrixDescription() });
    }

    displayMatrix(containerId) {
        const container = document.getElementById(containerId);
        container.replaceChildren();
        
        const matrix = this.cipher.getMatrix();
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const char = matrix[row][col];
                cell.textContent = char === 'I' ? 'I/J' : char;
                
                container.appendChild(cell);
            }
        }
    }

    setupKeyGeneration() {
        const editBtn = document.getElementById('edit-matrix-btn');
        const saveBtn = document.getElementById('save-matrix-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const matrixContainer = document.querySelector('.key-matrix-container');
        const editor = document.getElementById('matrix-editor');
        const textArea = document.getElementById('matrix-text');
        const keywordInput = document.getElementById('keyword-text');
        const keywordInputDiv = document.getElementById('keyword-input');
        const matrixInputDiv = document.getElementById('matrix-input');
        const errorDiv = document.getElementById('matrix-error');
        const editModeRadios = document.querySelectorAll('input[name="edit-mode"]');
        
        // 編集モード切り替え
        editModeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'keyword') {
                    keywordInputDiv.classList.remove('hidden');
                    matrixInputDiv.classList.add('hidden');
                } else {
                    keywordInputDiv.classList.add('hidden');
                    matrixInputDiv.classList.remove('hidden');
                }
                errorDiv.textContent = '';
            });
        });
        
        // キーワード入力時のプレビュー更新
        keywordInput.addEventListener('input', () => {
            this.updateKeywordPreview(keywordInput.value);
        });
        
        editBtn.addEventListener('click', () => {
            matrixContainer.querySelector('#key-matrix').classList.add('hidden');
            editBtn.classList.add('hidden');
            editor.classList.remove('hidden');
            
            // デフォルトでキーワードモードを選択
            document.querySelector('input[name="edit-mode"][value="keyword"]').checked = true;
            keywordInputDiv.classList.remove('hidden');
            matrixInputDiv.classList.add('hidden');
            
            textArea.value = this.cipher.matrixToText();
            keywordInput.value = '';
            this.updateKeywordPreview('');
            keywordInput.focus();
        });
        
        cancelBtn.addEventListener('click', () => {
            matrixContainer.querySelector('#key-matrix').classList.remove('hidden');
            editBtn.classList.remove('hidden');
            editor.classList.add('hidden');
            errorDiv.textContent = '';
        });
        
        saveBtn.addEventListener('click', () => {
            const selectedMode = document.querySelector('input[name="edit-mode"]:checked').value;
            
            if (selectedMode === 'keyword') {
                const keyword = keywordInput.value;
                const validation = this.cipher.validateKeyword(keyword);
                
                if (!validation.valid) {
                    this.setNotice('matrix-error', validation.error.key, validation.error.params);
                    return;
                }
                
                const result = this.cipher.generateMatrixFromKeyword(keyword);
                this.cipher.setMatrix(result.matrix);
                this.matrixSource = { type: 'keyword', keyword: keyword.toUpperCase().trim().replace(/\s+/g, ' ') };
                
            } else {
                const text = textArea.value;
                const validation = this.cipher.validateMatrix(text);
                
                if (!validation.valid) {
                    this.setNotice('matrix-error', validation.error.key, validation.error.params);
                    
                    if (validation.error.key === 'error.matrix-j') {
                        const correctedText = text.replace(/J/gi, 'I');
                        textArea.value = correctedText;
                    }
                    return;
                }
                
                const newMatrix = this.cipher.textToMatrix(text);
                this.cipher.setMatrix(newMatrix);
                this.matrixSource = { type: 'matrix' };
            }
            
            this.invalidateAll();
            this.displayMatrix('key-matrix');
            this.displayMatrix('encryption-matrix');
            this.displayMatrix('decryption-matrix');
            
            matrixContainer.querySelector('#key-matrix').classList.remove('hidden');
            editBtn.classList.remove('hidden');
            editor.classList.add('hidden');
            errorDiv.textContent = '';
            delete this.notices['matrix-error'];
            this.updateMatrixStatus();
            this.recordProgress({ type: 'matrix-saved', matrix: this.getCurrentMatrixString() });
        });
        document.getElementById('reset-matrix-btn').addEventListener('click', () => {
            this.cipher.setMatrix(this.cipher.textToMatrix(PlayfairCore.ALPHABET));
            this.matrixSource = { type: 'default' };
            this.invalidateAll();
            this.displayMatrix('key-matrix');
            document.getElementById('key-matrix').classList.remove('hidden');
            editBtn.classList.remove('hidden');
            editor.classList.add('hidden');
            errorDiv.textContent = '';
            delete this.notices['matrix-error'];
            this.updateMatrixStatus();
            this.recordProgress({ type: 'matrix-saved', matrix: this.getCurrentMatrixString() });
        });
    }

    setupEncryption() {
        const encryptBtn = document.getElementById('encrypt-btn');
        const plaintextInput = document.getElementById('plaintext');
        const processSection = document.getElementById('encryption-process');
        const ciphertextSection = document.getElementById('ciphertext-section');
        const copyBtn = document.getElementById('copy-ciphertext');
        const errorDiv = document.getElementById('plaintext-error');
        const samePairModeToggle = document.getElementById('same-pair-mode');
        const modeOnSettings = document.getElementById('mode-on-settings');
        const modeOffSettings = document.getElementById('mode-off-settings');
        
        // 初期状態でボタンを無効化
        encryptBtn.disabled = true;
        
        // 入力欄の変更を監視
        plaintextInput.addEventListener('input', () => {
            const hasText = plaintextInput.value.trim().length > 0;
            encryptBtn.disabled = !hasText;
        });
        
        // 同一ペア処理モードのトグル変更時の処理
        samePairModeToggle.addEventListener('change', () => {
            if (samePairModeToggle.checked) {
                modeOnSettings.classList.remove('hidden');
                modeOffSettings.classList.add('hidden');
            } else {
                modeOnSettings.classList.add('hidden');
                modeOffSettings.classList.remove('hidden');
            }
        });
        
        encryptBtn.addEventListener('click', () => {
            const plaintext = plaintextInput.value;
            if (!plaintext.trim()) return;
            
            // 入力検証（暗号化では警告のみ）
            const validationResult = this.validateInputForEncryption(plaintext);
            if (!validationResult.valid) {
                this.invalidate('encryption');
                this.setNotice('plaintext-error', validationResult.error.key, validationResult.error.params);
                return;
            }
            if (validationResult.warning) {
                this.setNotice('plaintext-error', validationResult.warning.key, validationResult.warning.params);
                errorDiv.classList.add('warning-message');
            } else {
                errorDiv.textContent = '';
                errorDiv.classList.remove('warning-message');
            }
            
            const samePairMode = samePairModeToggle.checked;
            let paddingChar = 'X';
            let samePairRule = 'right-shift';
            
            if (samePairMode) {
                paddingChar = document.querySelector('input[name="padding-char"]:checked').value;
            } else {
                samePairRule = document.querySelector('input[name="same-pair-rule"]:checked').value;
            }
            
            const result = this.cipher.encrypt(plaintext, paddingChar, samePairMode, samePairRule);
            
            this.startPlayback('encryption', result, samePairMode ? null : samePairRule);
            this.recordProgress({ type: 'encrypted', input: PlayfairCore.normalize(plaintext),
                variant: samePairMode ? null : samePairRule, matrix: this.getCurrentMatrixString() });

        });
        
        copyBtn.addEventListener('click', () => {
            const ciphertext = document.getElementById('ciphertext').textContent;
            this.copyToClipboard(ciphertext);
        });
    }

    setupDecryption() {
        const decryptBtn = document.getElementById('decrypt-btn');
        const ciphertextInput = document.getElementById('ciphertext-input');
        const processSection = document.getElementById('decryption-process');
        const plaintextSection = document.getElementById('plaintext-section');
        const copyBtn = document.getElementById('copy-plaintext');
        const errorDiv = document.getElementById('ciphertext-error');
        
        // 初期状態でボタンを無効化
        decryptBtn.disabled = true;
        
        // 入力欄の変更を監視
        ciphertextInput.addEventListener('input', () => {
            const hasText = ciphertextInput.value.trim().length > 0;
            decryptBtn.disabled = !hasText;
        });
        
        decryptBtn.addEventListener('click', () => {
            const ciphertext = ciphertextInput.value;
            if (!ciphertext.trim()) return;
            
            // 入力検証
            const validationResult = this.validateInput(ciphertext);
            if (!validationResult.valid) {
                this.setNotice('ciphertext-error', validationResult.error.key, validationResult.error.params);
                processSection.classList.add('hidden');
                plaintextSection.classList.add('hidden');
                return;
            }
            
            errorDiv.textContent = '';
            
            // 復号設定を取得
            const samePairRule = document.querySelector('input[name="decrypt-same-pair-rule"]:checked').value;
            
            const variant = samePairRule === 'standard' ? null : samePairRule;
            const result = this.cipher.decrypt(ciphertext, variant);
            if (!result.ok) {
                this.setNotice('ciphertext-error', result.error.key, result.error.params);
                processSection.classList.add('hidden');
                plaintextSection.classList.add('hidden');
                return;
            }
            
            this.startPlayback('decryption', result, variant);
            this.recordProgress({ type: 'decrypted', ciphertext: PlayfairCore.normalize(ciphertext),
                variant, matrix: this.getCurrentMatrixString() });

        });
        
        copyBtn.addEventListener('click', () => {
            const plaintext = document.getElementById('decrypted-text').textContent;
            this.copyToClipboard(plaintext);
        });
    }

    async copyToClipboard(text) {
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('clipboard unavailable');
            await navigator.clipboard.writeText(text);
            this.showToast(i18n.t('message.copied'));
        } catch (_error) {
            this.showToast(i18n.t('message.copy-failed'));
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }


    validateInput(text) {
        // 空文字チェック
        if (!text.trim()) {
            return { valid: false, error: { key: 'error.input-empty', params: {} } };
        }
        
        // 英字のみかチェック（空白、改行、その他の文字は除外される）
        const alphabetOnly = /^[a-zA-Z\s\n\r]*$/;
        if (!alphabetOnly.test(text)) {
            const invalidChars = text.match(/[^a-zA-Z\s\n\r]/g);
            const uniqueInvalidChars = [...new Set(invalidChars)].join(', ');
            return { 
                valid: false, 
                error: { key: 'error.input-chars', params: { chars: uniqueInvalidChars } }
            };
        }
        
        // 英字が少なくとも1文字あるかチェック
        const hasAlphabet = /[a-zA-Z]/.test(text);
        if (!hasAlphabet) {
            return { valid: false, error: { key: 'error.keyword-letter', params: {} } };
        }
        
        return { valid: true };
    }

    validateInputForEncryption(text) {
        // 空文字チェック
        if (!text.trim()) {
            return { valid: false, error: { key: 'error.input-empty', params: {} } };
        }
        
        // 英字が少なくとも1文字あるかチェック
        const hasAlphabet = /[a-zA-Z]/.test(text);
        if (!hasAlphabet) {
            return { valid: false, error: { key: 'error.keyword-letter', params: {} } };
        }
        
        // 英字以外の文字があるか警告チェック
        const nonAlphabetChars = text.match(/[^a-zA-Z\s\n\r]/g);
        if (nonAlphabetChars) {
            const uniqueChars = [...new Set(nonAlphabetChars)].join(', ');
            return { 
                valid: true, 
                warning: { key: 'warning.input-chars', params: { chars: uniqueChars } }
            };
        }
        
        return { valid: true };
    }

    clearMatrix(matrixId) {
        const matrix = document.getElementById(matrixId);
        const cells = matrix.querySelectorAll('.matrix-cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight-source', 'highlight-target');
        });
    }

    showMatrixHighlight(originalPair, transformedPair, matrixId) {
        const matrix = document.getElementById(matrixId);
        const cells = matrix.querySelectorAll('.matrix-cell');
        
        // すべてのハイライトをクリア
        cells.forEach(cell => {
            cell.classList.remove('highlight-source', 'highlight-target');
        });
        
        const pos1 = this.cipher.findPosition(originalPair[0]);
        const pos2 = this.cipher.findPosition(originalPair[1]);
        const newPos1 = this.cipher.findPosition(transformedPair[0]);
        const newPos2 = this.cipher.findPosition(transformedPair[1]);
        
        // 元のペアの位置をハイライト
        if (pos1 && pos2) {
            const cell1 = matrix.querySelector(`[data-row="${pos1.row}"][data-col="${pos1.col}"]`);
            const cell2 = matrix.querySelector(`[data-row="${pos2.row}"][data-col="${pos2.col}"]`);
            
            if (cell1) cell1.classList.add('highlight-source');
            if (cell2) cell2.classList.add('highlight-source');
        }
        
        // 変換後の位置もハイライト（異なる場合）
        if (newPos1 && newPos2) {
            const newCell1 = matrix.querySelector(`[data-row="${newPos1.row}"][data-col="${newPos1.col}"]`);
            const newCell2 = matrix.querySelector(`[data-row="${newPos2.row}"][data-col="${newPos2.col}"]`);
            
            if (newCell1 && !newCell1.classList.contains('highlight-source')) {
                newCell1.classList.add('highlight-target');
            }
            if (newCell2 && !newCell2.classList.contains('highlight-source')) {
                newCell2.classList.add('highlight-target');
            }
        }
    }

    setupPlaybackControls() {
        for (const tab of ['encryption', 'decryption']) {
            document.getElementById(`prev-step-${tab}`).addEventListener('click', () => this.movePlayback(tab, -1));
            document.getElementById(`next-step-${tab}`).addEventListener('click', () => this.movePlayback(tab, 1));
            document.getElementById(`restart-${tab}`).addEventListener('click', () => this.seekPlayback(tab, 0));
            document.getElementById(`finish-${tab}`).addEventListener('click', () => {
                this.seekPlayback(tab, this.playback[tab].steps.length);
            });
            document.getElementById(`play-pause-${tab}`).addEventListener('click', () => {
                if (this.playback[tab].playing) this.stopPlayback(tab);
                else this.play(tab);
            });
            const panel = document.getElementById(tab);
            panel.querySelectorAll('textarea, input[name], select').forEach(input => {
                input.addEventListener(input.tagName === 'TEXTAREA' ? 'input' : 'change', () => this.invalidate(tab));
            });
        }
    }

    stopPlayback(tab) {
        const state = this.playback[tab];
        clearInterval(state.timerId);
        state.timerId = null;
        state.playing = false;
        this.render(tab);
    }

    invalidate(tab) {
        this.stopPlayback(tab);
        for (const id of tab === 'encryption' ? ['plaintext-error'] : ['ciphertext-error', 'answer-result']) {
            delete this.notices[id];
            document.getElementById(id).textContent = '';
        }
        this.playback[tab].steps = [];
        this.playback[tab].done = 0;
        this.results[tab] = null;
        this.render(tab);
    }

    invalidateAll() {
        this.invalidate('encryption');
        this.invalidate('decryption');
        this.invalidateAnalysis();
    }

    startPlayback(tab, result, variant) {
        this.stopPlayback(tab);
        this.renderedDone[tab] = 0;
        const input = PlayfairCore.normalize(document.getElementById(tab === 'encryption' ? 'plaintext' : 'ciphertext-input').value);
        this.results[tab] = { ...result, variant, matrix: this.getCurrentMatrixString(),
            ...(tab === 'encryption' ? { input } : { ciphertext: input }) };
        const state = this.playback[tab];
        state.steps = result.pairs.map((pair, index) => ({
            pair, output: result.outPairs[index], rule: result.rules[index]
        }));
        state.done = matchMedia('(prefers-reduced-motion: reduce)').matches ? state.steps.length : 0;
        this.render(tab);
        if (state.done < state.steps.length) this.play(tab);
    }

    play(tab) {
        const state = this.playback[tab];
        if (state.playing || state.done >= state.steps.length) return;
        state.playing = true;
        state.timerId = setInterval(() => {
            state.done = Math.min(state.done + 1, state.steps.length);
            if (state.done === state.steps.length) this.stopPlayback(tab);
            else this.render(tab);
        }, 1200);
        this.render(tab);
    }

    movePlayback(tab, delta) {
        this.seekPlayback(tab, this.playback[tab].done + delta);
    }

    seekPlayback(tab, done) {
        this.stopPlayback(tab);
        const state = this.playback[tab];
        state.done = Math.max(0, Math.min(done, state.steps.length));
        this.render(tab);
    }

    markedText(container, text, positions, className) {
        container.replaceChildren();
        const marks = new Set(positions);
        [...text].forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            if (marks.has(index)) span.className = className;
            container.appendChild(span);
        });
    }

    render(tab) {
        const state = this.playback[tab];
        const result = this.results[tab];
        const encryption = tab === 'encryption';
        const process = document.getElementById(`${tab}-process`);
        const section = document.getElementById(encryption ? 'ciphertext-section' : 'plaintext-section');
        process.classList.toggle('hidden', !result);
        section.classList.toggle('hidden', !result);
        process.dataset.done = state.done;
        process.dataset.playing = state.playing;
        document.getElementById(`step-info-${tab}`).textContent = `${state.done} / ${state.steps.length}`;
        const converted = document.getElementById(encryption ? 'encrypted-pair-display' : 'decrypted-pair-display');
        converted.replaceChildren();
        for (const step of state.steps.slice(0, state.done)) {
            const span = document.createElement('span');
            span.textContent = step.output;
            converted.appendChild(span);
        }
        this.displayMatrix(`${tab}-matrix`);
        const explanation = document.getElementById(`step-description-${tab}`);
        explanation.textContent = '';
        if (state.done > 0) {
            const step = state.steps[state.done - 1];
            this.showMatrixHighlight(step.pair, step.output, `${tab}-matrix`);
            const key = step.rule === 'same' ? `rule.variant.${result.variant}` : `rule.${tab}.${step.rule}`;
            explanation.textContent = i18n.t('step.explanation', {
                before: step.pair, after: step.output, rule: i18n.t(key)
            });
        }
        document.getElementById(`prev-step-${tab}`).disabled = !result || state.done === 0;
        document.getElementById(`next-step-${tab}`).disabled = !result || state.done === state.steps.length;
        document.getElementById(`finish-${tab}`).disabled = !result || state.done === state.steps.length;
        const playButton = document.getElementById(`play-pause-${tab}`);
        playButton.disabled = !result || state.done === state.steps.length;
        playButton.textContent = i18n.t(state.playing ? 'playback.pause' : 'playback.play');
        document.getElementById(`finish-${tab}`).textContent = i18n.t('playback.finish');
        if (this.renderedDone[tab] !== state.done) {
            this.renderedDone[tab] = state.done;
            if (state.done > 0 && result.variant === null) {
                const rule = state.steps[state.done - 1].rule;
                if (tab === 'encryption' && ['row', 'column', 'rectangle'].includes(rule) && !this.rulesSeenNow.includes(rule)) {
                    this.rulesSeenNow.push(rule);
                }
                this.recordProgress({ type: 'step-rendered', tab, rule });
            }
        }
        this.guide?.render();
        if (!result) return;
        const source = document.getElementById(encryption ? 'pair-display' : 'decrypt-pair-display');
        source.replaceChildren();
        let position = 0;
        for (const pair of result.pairs) {
            const span = document.createElement('span');
            const marks = encryption ? result.inserted.filter(index => index >= position && index < position + 2) : [];
            this.markedText(span, pair, marks.map(index => index - position), 'pad-inserted');
            source.appendChild(span);
            position += 2;
        }
        if (encryption) {
            document.getElementById('ciphertext').textContent = result.ciphertext;
            document.getElementById('encryption-message').textContent = i18n.t('padding.inserted-legend');
        } else {
            this.markedText(document.getElementById('decrypted-text'), result.plaintext, result.candidates, 'pad-candidate');
            document.getElementById('decryption-notes').textContent = i18n.t('padding.candidate-legend');
            document.getElementById('candidate-plain').textContent =
                PlayfairCore.stripCandidates(result.plaintext, result.candidates);
            document.getElementById('candidate-label').textContent = i18n.t('padding.stripped');
        }
    }

    updateKeywordPreview(keyword) {
        const previewContainer = document.getElementById('keyword-matrix-preview');
        previewContainer.replaceChildren();
        
        if (!keyword.trim()) {
            // 空の場合は空のマトリクスを表示
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-preview-cell';
                cell.textContent = '';
                previewContainer.appendChild(cell);
            }
            return;
        }
        
        try {
            const result = this.cipher.generateMatrixFromKeyword(keyword);
            const matrix = result.matrix;
            const keywordLength = result.keywordLength;
            
            let charIndex = 0;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'matrix-preview-cell';
                    
                    if (charIndex < keywordLength) {
                        cell.classList.add('keyword-char');
                    }
                    
                    const char = matrix[row][col];
                    cell.textContent = char === 'I' ? 'I/J' : char;
                    previewContainer.appendChild(cell);
                    charIndex++;
                }
            }
        } catch (error) {
            // エラーの場合は空のマトリクスを表示
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-preview-cell';
                cell.textContent = '';
                previewContainer.appendChild(cell);
            }
        }
    }

    setupExercises() {
        this.setupEncryptionExercises();
        this.setupDecryptionExercises();
        this.setupProgressDisplay();
        this.updateProgressDisplay();
    }

    setupEncryptionExercises() {
        const categorySelect = document.getElementById('example-category');
        const exampleSelect = document.getElementById('example-list');
        const loadButton = document.getElementById('load-example');

        // カテゴリ選択肢を構築
        const categories = this.exerciseManager.getExamplesByCategory('encryption');
        Object.keys(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.translateCategory(category);
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            this.resetSelect(exampleSelect, 'dropdown.select-example');
            exampleSelect.disabled = !selectedCategory;
            loadButton.disabled = true;

            if (selectedCategory) {
                const examples = categories[selectedCategory];
                examples.forEach(example => {
                    const option = document.createElement('option');
                    option.value = example.id;
                    const translatedTitle = i18n.t(`example.${example.title}`) !== `example.${example.title}` 
                        ? i18n.t(`example.${example.title}`) 
                        : example.title;
                    option.textContent = `${translatedTitle} - "${example.plaintext}"`;
                    exampleSelect.appendChild(option);
                });
                exampleSelect.disabled = false;
            }
        });

        exampleSelect.addEventListener('change', () => {
            loadButton.disabled = !exampleSelect.value;
        });

        loadButton.addEventListener('click', () => {
            const selectedExample = this.exerciseManager.getExamples('encryption')
                .find(ex => ex.id === exampleSelect.value);
            
            if (selectedExample) {
                this.invalidate('encryption');
                document.getElementById('plaintext').value = selectedExample.plaintext;
                
                // キーワードがある場合は設定
                if (selectedExample.keyword) {
                    this.invalidateAll();
                    const result = this.cipher.generateMatrixFromKeyword(selectedExample.keyword);
                    this.cipher.setMatrix(result.matrix);
                    this.matrixSource = { type: 'keyword', keyword: selectedExample.keyword };
                    this.updateMatrixStatus();
                    this.displayMatrix('key-matrix');
                    this.displayMatrix('encryption-matrix');
                    this.displayMatrix('decryption-matrix');
                }

                const translatedTitle = i18n.t(`example.${selectedExample.title}`) !== `example.${selectedExample.title}` 
                    ? i18n.t(`example.${selectedExample.title}`) 
                    : selectedExample.title;
                this.showToast(i18n.t('exercise.loaded.example', { title: translatedTitle }));
                
                // 暗号化ボタンを有効化
                document.getElementById('encrypt-btn').disabled = false;
            }
        });
    }

    setupDecryptionExercises() {
        const typeSelect = document.getElementById('practice-type');
        const practiceSelect = document.getElementById('practice-list');
        const loadButton = document.getElementById('load-practice');
        const challengeInfo = document.getElementById('challenge-info');
        const answerCheck = document.getElementById('answer-check');

        typeSelect.addEventListener('change', () => {
            const selectedType = typeSelect.value;
            this.resetSelect(practiceSelect, 'dropdown.select-task');
            practiceSelect.disabled = !selectedType;
            loadButton.disabled = true;
            challengeInfo.classList.add('hidden');
            answerCheck.classList.add('hidden');
            this.currentChallenge = null;
            this.selectedChallenge = null;
            this.loaded = null;

            if (selectedType === 'practice') {
                const practices = this.exerciseManager.getPracticesByCategory();
                Object.keys(practices).forEach(category => {
                    const optgroup = document.createElement('optgroup');
                    const translatedCategory = i18n.t(`category.${category}`) !== `category.${category}` 
                        ? i18n.t(`category.${category}`) 
                        : category;
                    optgroup.label = translatedCategory;
                    practices[category].forEach(practice => {
                        const option = document.createElement('option');
                        option.value = practice.id;
                        const translatedTitle = i18n.t(`example.${practice.title}`) !== `example.${practice.title}` 
                            ? i18n.t(`example.${practice.title}`) 
                            : practice.title;
                        option.textContent = `${translatedTitle} - ${practice.ciphertext}`;
                        optgroup.appendChild(option);
                    });
                    practiceSelect.appendChild(optgroup);
                });
                practiceSelect.disabled = false;
            } else if (selectedType === 'challenge') {
                const challenges = this.exerciseManager.getChallengesByLevel('decryption');
                Object.keys(challenges).sort().forEach(level => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = i18n.t('level.label', { level });
                    challenges[level].forEach(challenge => {
                        const option = document.createElement('option');
                        option.value = challenge.id;
                        const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
                            ? i18n.t(`example.${challenge.title}`) 
                            : challenge.title;
                        option.textContent = `${translatedTitle} (${challenge.points}pt)`;
                        
                        // ロックされているレベルかチェック
                        if (ProgressCore.isLocked(this.progress, challenge.id)) {
                            option.disabled = true;
                            const lockText = i18n.t('level.locked');
                            option.textContent += lockText;
                        }
                        
                        optgroup.appendChild(option);
                    });
                    practiceSelect.appendChild(optgroup);
                });
                practiceSelect.disabled = false;
            }
        });

        practiceSelect.addEventListener('change', () => {
            const selectedId = practiceSelect.value;
            this.currentChallenge = null;
            this.selectedChallenge = null;
            this.loaded = null;
            answerCheck.classList.add('hidden');
            loadButton.disabled = !selectedId;
            challengeInfo.classList.add('hidden');

            if (selectedId && typeSelect.value === 'challenge') {
                const challenge = this.exerciseManager.getChallenges('decryption')
                    .find(c => c.id === selectedId);
                
                if (challenge) {
                    this.selectedChallenge = challenge; // 選択されたチャレンジを保存
                    this.displayChallengeInfo(challenge);
                    challengeInfo.classList.remove('hidden');
                }
            }
        });

        loadButton.addEventListener('click', () => {
            const selectedType = typeSelect.value;
            const selectedId = practiceSelect.value;
            
            if (selectedType === 'practice') {
                const practice = this.exerciseManager.getPractices()
                    .find(p => p.id === selectedId);
                
                if (practice) {
                    this.loadPractice(practice);
                }
            } else if (selectedType === 'challenge') {
                const challenge = this.exerciseManager.getChallenges('decryption')
                    .find(c => c.id === selectedId);
                
                if (challenge) {
                    this.loadChallenge(challenge);
                }
            }
        });

        // 解答チェックボタン
        document.getElementById('check-answer').addEventListener('click', () => {
            this.checkChallengeAnswer();
        });
        
        // ヒントボタン
        document.getElementById('hint-button').addEventListener('click', () => {
            this.showHint();
        });
    }

    displayChallengeInfo(challenge) {
        const practice = !challenge.points;
        document.getElementById('challenge-info').classList.remove('hidden');
        document.querySelector('.challenge-title').textContent = i18n.t(`example.${challenge.title}`);
        document.querySelector('.challenge-description').textContent = i18n.t(challenge.description);
        const required = practice && challenge.keyword
            ? i18n.t('matrix.practice', { keyword: challenge.keyword })
            : i18n.t(challenge.keyword ? 'matrix.required-hint' : 'matrix.required-default');
        document.getElementById('challenge-required').textContent = required;
        document.getElementById('challenge-matrix').textContent = i18n.t('matrix.current-line', { description: this.matrixDescription() });
        const matches = this.getCurrentMatrixString() === PlayfairCore.matrixFromKeyword(challenge.keyword || '');
        document.getElementById('challenge-match').textContent = (matches ? '✅ ' : '✗ ') + i18n.t(matches ? 'matrix.match' : 'matrix.mismatch');
        document.querySelector('.challenge-points').textContent = practice ? '' : challenge.points + 'pt';
        document.getElementById('challenge-guide').hidden = practice;
    }

    loadPractice(practice) {
        this.invalidate('decryption');
        document.getElementById('ciphertext-input').value = practice.ciphertext;
        this.showToast(i18n.t('exercise.loaded.practice', { title: i18n.t(`example.${practice.title}`) }));
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('answer-check').classList.add('hidden');
        this.currentChallenge = null;
        this.selectedChallenge = practice;
        this.loaded = { kind: 'practice', id: practice.id };
        this.displayChallengeInfo(practice);
    }

    loadChallenge(challenge) {
        if (ProgressCore.isLocked(this.progress, challenge.id)) return;
        this.selectedChallenge = challenge;
        this.loaded = { kind: 'challenge', id: challenge.id };
        this.displayChallengeInfo(challenge);
        this.invalidate('decryption');
        document.getElementById('ciphertext-input').value = challenge.ciphertext;
        
        const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
            ? i18n.t(`example.${challenge.title}`) 
            : challenge.title;
        
        // キーワードがある場合は設定（チャレンジでは初期状態では設定しない）
        if (challenge.keyword) {
            // チャレンジなのでキーワードはユーザーが見つける必要がある
            this.showToast(i18n.t('exercise.loaded.challenge.keyword', { title: translatedTitle }));
        } else {
            this.showToast(i18n.t('exercise.loaded.challenge', { title: translatedTitle }));
        }
        
        // チャレンジUI状態をリセット
        document.getElementById('challenge-answer').value = '';
        document.getElementById('challenge-answer').disabled = false;
        document.getElementById('check-answer').disabled = false;
        document.getElementById('hint-button').disabled = false;
        
        document.getElementById('answer-result').textContent = '';
        document.getElementById('hint-display').replaceChildren();
        document.getElementById('hint-display').classList.add('hidden');
        document.getElementById('hint-display').dataset.hintIndex = this.hintsUsed[challenge.id] || 0;
        
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('answer-check').classList.remove('hidden');
        this.currentChallenge = challenge;
        this.renderHints();
        this.updateHintButton();
    }

    checkChallengeAnswer() {
        if (!this.currentChallenge) return;

        const userAnswer = document.getElementById('challenge-answer').value.trim();
        if (!userAnswer) {
            const resultDiv = document.getElementById('answer-result');
            this.setNotice('answer-result', 'message.enter-answer');
            resultDiv.className = 'answer-result incorrect';
            return;
        }

        const currentMatrix = this.getCurrentMatrixString();
        
        const result = this.exerciseManager.validateAnswer(
            this.currentChallenge.id, 
            userAnswer, 
            currentMatrix
        );

        const resultDiv = document.getElementById('answer-result');
        this.setNotice('answer-result', `answer.${result.result}`);
        resultDiv.className = 'answer-result ' + (result.result === 'correct' ? 'correct' : 'incorrect');

        if (result.result === 'correct') {
            const previousPoints = ProgressCore.summary(this.progress).points;
            this.lastCorrect = this.currentChallenge.id;
            this.recordProgress({ type: 'challenge-correct', id: this.currentChallenge.id,
                hintsUsed: this.hintsUsed[this.currentChallenge.id] || 0 });
            this.showToast(i18n.t('points.earned', { points: ProgressCore.summary(this.progress).points - previousPoints }));
            this.refreshDecryptionChallenges();
            
            // 正解時は解答入力欄を無効化
            document.getElementById('challenge-answer').disabled = true;
            document.getElementById('check-answer').disabled = true;
        }
    }

    showHint() {
        if (!this.currentChallenge) return;
        const display = document.getElementById('hint-display');
        const shown = Number(display.dataset.hintIndex || 0);
        display.dataset.hintIndex = Math.min(shown + 1, this.currentChallenge.hints.length);
        this.hintsUsed[this.currentChallenge.id] = Number(display.dataset.hintIndex);
        this.renderHints();
        this.updateHintButton();
    }

    getCurrentMatrixString() {
        return this.cipher.getMatrix().flat().join('');
    }


    getSnapshot() {
        return {
            activeTab: this.currentTab,
            editorOpen: !document.getElementById('matrix-editor').classList.contains('hidden'),
            keywordDraft: PlayfairCore.normalize(document.getElementById('keyword-text').value),
            plaintextDraft: PlayfairCore.normalize(document.getElementById('plaintext').value),
            ciphertextDraft: PlayfairCore.normalize(document.getElementById('ciphertext-input').value),
            analysisDraft: document.getElementById('analysis-input').value.trim(),
            analysis: this.analysisResult, selectedReversed: this.selectedReversed,
            recovery: this.recoveryState ? { id: this.recoveryState.p.id,
                placed: this.recoveryState.grid.filter((letter, cell) => letter && !this.recoveryState.p.givens[cell]).length } : null,
            lastRecoverySolved: this.lastRecoverySolved,
            matrix: this.getCurrentMatrixString(), loaded: this.loaded,
            encryption: this.results.encryption, decryption: this.results.decryption,
            rulesSeenNow: [...this.rulesSeenNow], lastCorrect: this.lastCorrect
        };
    }

    loadProgress() {
        try { return ProgressCore.migrate(localStorage.getItem('playfair-progress')); }
        catch (_error) { return ProgressCore.initial(); }
    }

    saveProgress() {
        try { localStorage.setItem('playfair-progress', ProgressCore.serialize(this.progress)); }
        catch (_error) { /* Keep progress in this page when storage is blocked. */ }
    }

    recordProgress(event) {
        this.progress = ProgressCore.reduce(this.progress, event);
        this.saveProgress();
        this.updateProgressDisplay();
        this.guide?.render();
    }

    requestGuide(id, opener) {
        this.guide?.open(id, opener);
    }

    setupProgressDisplay() {
        document.getElementById('progress-toggle').addEventListener('click', () => {
            this.openProgress(document.getElementById('progress-content').classList.contains('hidden'));
        });
        document.getElementById('progress-next-guide').addEventListener('click', event => {
            this.requestGuide(ProgressCore.summary(this.progress).next, event.currentTarget);
        });
        document.getElementById('challenge-guide').addEventListener('click', event => {
            const mission = ProgressCore.MISSIONS.find(item => item.challengeId === this.selectedChallenge?.id);
            if (mission) this.requestGuide(mission.id, event.currentTarget);
        });
        document.getElementById('reset-progress').addEventListener('click', () => {
            if (!confirm(i18n.t('message.reset-confirm'))) return;
            this.progress = ProgressCore.initial();
            this.saveProgress();
            this.rulesSeenNow = [];
            this.lastCorrect = null;
            this.hintsUsed = {};
            this.recoveryHints = {};
            this.lastRecoverySolved = null;
            this.startRecovery('recover-01');
            this.invalidateAll();
            this.resetExerciseUI();
            this.updateProgressDisplay();
            this.guide?.close();
            this.showToast(i18n.t('message.reset-success'));
        });
    }

    openProgress(open = true) {
        const toggle = document.getElementById('progress-toggle');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.classList.toggle('expanded', open);
        document.getElementById('progress-content').classList.toggle('hidden', !open);
    }

    startChallenge(id) {
        if (ProgressCore.isLocked(this.progress, id)) return;
        const challenge = this.exerciseManager.getChallenges('decryption').find(item => item.id === id);
        if (!challenge) return;
        document.getElementById('tab-decryption').click();
        document.getElementById('practice-type').value = 'challenge';
        this.populatePracticeList('challenge');
        document.getElementById('practice-list').disabled = false;
        document.getElementById('practice-list').value = id;
        document.getElementById('load-practice').disabled = false;
        this.loadChallenge(challenge);
        document.getElementById('challenge-heading').focus();
    }

    updateProgressDisplay() {
        const list = document.getElementById('mission-list');
        const statuses = ProgressCore.statuses(this.progress);
        for (const group of ['key', 'encryption', 'decryption', 'analysis', 'challenge', 'recovery']) {
            let section = document.getElementById('mission-group-' + group);
            if (!section) {
                section = document.createElement('section');
                section.id = 'mission-group-' + group;
                section.className = 'mission-group';
                section.appendChild(document.createElement('h3'));
                list.appendChild(section);
            }
            section.querySelector('h3').textContent = i18n.t(`mission.group.${group}`);
            for (const mission of ProgressCore.MISSIONS.filter(item => item.group === group)) {
                const status = statuses.find(item => item.id === mission.id);
                let row = document.getElementById('mission-' + mission.id);
                if (!row) {
                    row = document.createElement('div');
                    row.id = 'mission-' + mission.id;
                    row.className = 'mission-row';
                    for (const name of ['state', 'title', 'learn', 'points', 'lock']) {
                        const text = document.createElement('p');
                        text.className = 'mission-' + name;
                        row.appendChild(text);
                    }
                    const buttons = document.createElement('div');
                    buttons.className = 'mission-actions';
                    row.appendChild(buttons);
                    section.appendChild(row);
                }
                row.dataset.state = status.state;
                if (status.state === 'next') row.setAttribute('aria-current', 'step');
                else row.removeAttribute('aria-current');
                const symbols = { done: '✅', next: '▶', open: '○', locked: '🔒' };
                row.querySelector('.mission-state').textContent = symbols[status.state] + ' ' + i18n.t(`mission.state.${status.state}`);
                const title = i18n.t(`mission.${mission.id}.title`);
                row.querySelector('.mission-title').textContent = i18n.t('mission.label', {
                    id: mission.id, title, separator: /^[A-Za-z0-9]/.test(title) ? ' ' : ''
                });
                row.querySelector('.mission-learn').textContent = i18n.t(`mission.${mission.id}.learn`);
                row.querySelector('.mission-points').textContent = mission.points
                    ? mission.points + 'pt' + (status.star ? ' ★ ' + i18n.t('mission.star') : '') : '';
                row.querySelector('.mission-lock').textContent = status.state === 'locked'
                    ? i18n.t('mission.unlock', { title: i18n.t(`mission.${mission.requires}.title`) }) : '';
                const buttons = row.querySelector('.mission-actions');
                if (status.state === 'locked') {
                    buttons.replaceChildren();
                    continue;
                }
                let guide = document.getElementById('mission-guide-' + mission.id);
                if (!guide) {
                    guide = document.createElement('button');
                    guide.type = 'button';
                    guide.id = 'mission-guide-' + mission.id;
                    guide.className = 'btn btn-secondary';
                    guide.addEventListener('click', event => this.requestGuide(mission.id, event.currentTarget));
                    buttons.appendChild(guide);
                }
                guide.textContent = i18n.t(status.state === 'done' ? 'guide.again' : 'guide.start');
                if (mission.group === 'challenge') {
                    let start = document.getElementById('challenge-start-' + mission.challengeId);
                    if (!start) {
                        start = document.createElement('button');
                        start.type = 'button';
                        start.id = 'challenge-start-' + mission.challengeId;
                        start.className = 'btn btn-primary';
                        start.addEventListener('click', () => this.startChallenge(mission.challengeId));
                        buttons.appendChild(start);
                    }
                    start.textContent = i18n.t('mission.challenge');
                }
            }
        }
        this.updateProgressSummary();
    }

    updateProgressSummary() {
        const summary = ProgressCore.summary(this.progress);
        document.getElementById('progress-summary').textContent = i18n.t('roadmap.summary', summary);
        document.getElementById('progress-next-title').textContent = summary.next
            ? i18n.t('roadmap.next', { title: i18n.t(`mission.${summary.next}.title`) }) : i18n.t('roadmap.complete');
        document.getElementById('progress-next-guide').hidden = !summary.next;
        const complete = document.getElementById('progress-complete');
        complete.hidden = !!summary.next;
        complete.textContent = i18n.t('roadmap.explore');
    }

    refreshDecryptionChallenges() {
        const type = document.getElementById('practice-type').value;
        if (type !== 'challenge') return;
        const select = document.getElementById('practice-list');
        const value = select.value;
        this.populatePracticeList(type);
        select.value = value;
    }

    matrixDescription() {
        return i18n.t(`matrix.${this.matrixSource.type}`, this.matrixSource);
    }

    updateMatrixStatus() {
        for (const tab of ['encryption', 'decryption']) {
            document.getElementById('matrix-status-' + tab).textContent = i18n.t('matrix.status', { description: this.matrixDescription() });
        }
        this.updateChallengeInfoDisplay();
    }

    resetExerciseUI() {
        document.getElementById('example-category').selectedIndex = 0;
        this.resetSelect(document.getElementById('example-list'), 'dropdown.select-example');
        document.getElementById('example-list').disabled = true;
        document.getElementById('load-example').disabled = true;
        document.getElementById('practice-type').selectedIndex = 0;
        this.resetSelect(document.getElementById('practice-list'), 'dropdown.select-task');
        document.getElementById('practice-list').disabled = true;
        document.getElementById('load-practice').disabled = true;
        document.getElementById('challenge-info').classList.add('hidden');
        document.getElementById('answer-check').classList.add('hidden');
        document.getElementById('answer-result').textContent = '';
        this.currentChallenge = null;
        this.selectedChallenge = null;
        this.loaded = null;
    }
}
