class UI {
    constructor() {
        this.cipher = new PlayfairCipher();
        this.exerciseManager = new ExerciseManager({
            getItem(key) {
                try { return localStorage.getItem(key); } catch (_error) { return null; }
            },
            setItem(key, value) {
                try { localStorage.setItem(key, value); } catch (_error) { /* Keep in-memory progress. */ }
            }
        });
        this.currentTab = 'key-generation';
        this.playback = {
            encryption: { steps: [], done: 0, playing: false, timerId: null },
            decryption: { steps: [], done: 0, playing: false, timerId: null }
        };
        this.results = { encryption: null, decryption: null };
        this.currentChallenge = null;
        this.selectedChallenge = null;
    }

    init() {
        this.setupTabs();
        this.setupKeyGeneration();
        this.setupEncryption();
        this.setupDecryption();
        this.setupExercises();
        this.setupPlaybackControls();
        this.displayMatrix('key-matrix');
        this.setupI18n();
    }

    setupI18n() {
        // Listen for language changes
        window.addEventListener('languageChanged', (event) => {
            this.updateDynamicTexts();
        });
    }

    updateDynamicTexts() {
        // Update example categories
        this.updateExampleCategories();
        // Update progress summary
        this.updateProgressSummary();
        // Update any dynamic hint texts
        this.updateHintButton();
        // Force update dropdown contents
        this.updateAllDropdownContents();
        // Update challenge info if displayed
        this.updateChallengeInfoDisplay();
        this.render('encryption');
        this.render('decryption');
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
            this.populateExampleList(categorySelect.value);
        }
        
        const practiceTypeSelect = document.getElementById('practice-type');
        if (practiceTypeSelect && practiceTypeSelect.value) {
            this.populatePracticeList(practiceTypeSelect.value);
        }
    }

    populateExampleList(selectedCategory) {
        const exampleSelect = document.getElementById('example-list');
        const categories = this.exerciseManager.getExamplesByCategory('encryption');
        
        exampleSelect.innerHTML = `<option value="">${i18n.t('dropdown.select-example')}</option>`;
        
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
        
        practiceSelect.innerHTML = `<option value="">${i18n.t('dropdown.select-task')}</option>`;
        
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
                optgroup.label = i18n.getCurrentLanguage() === 'ja' ? `レベル ${level}` : `Level ${level}`;
                challenges[level].forEach(challenge => {
                    const option = document.createElement('option');
                    option.value = challenge.id;
                    const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
                        ? i18n.t(`example.${challenge.title}`) 
                        : challenge.title;
                    option.textContent = `${translatedTitle} (${challenge.points}pt)`;
                    
                    if (!this.exerciseManager.isLevelUnlocked('decryption', parseInt(level))) {
                        option.disabled = true;
                        const lockText = i18n.getCurrentLanguage() === 'ja' ? ' [ロック]' : ' [Locked]';
                        option.textContent += lockText;
                    }
                    
                    if (this.exerciseManager.isChallengeCompleted(challenge.id)) {
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

    updateHintButton() {
        const hintButton = document.getElementById('hint-button');
        if (hintButton && this.currentChallenge && this.currentChallenge.hints) {
            const hintDisplay = document.getElementById('hint-display');
            const currentHintIndex = parseInt(hintDisplay.dataset.hintIndex) || 0;
            const totalHints = this.currentChallenge.hints.length;
            
            if (currentHintIndex < totalHints) {
                const baseText = currentHintIndex === 0 ? i18n.t('decrypt.hint') : i18n.t('decrypt.hint-next');
                hintButton.innerHTML = `${baseText} <span id="hint-counter" class="hint-counter">(${currentHintIndex + 1}/${totalHints})</span>`;
            } else {
                hintButton.innerHTML = `${i18n.t('decrypt.hint-complete')} <span id="hint-counter" class="hint-counter">(${i18n.getCurrentLanguage() === 'ja' ? '完了' : 'Complete'})</span>`;
            }
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
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

    displayMatrix(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
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
                    errorDiv.textContent = i18n.t(validation.error.key, validation.error.params);
                    return;
                }
                
                const result = this.cipher.generateMatrixFromKeyword(keyword);
                this.cipher.setMatrix(result.matrix);
                
            } else {
                const text = textArea.value;
                const validation = this.cipher.validateMatrix(text);
                
                if (!validation.valid) {
                    errorDiv.textContent = i18n.t(validation.error.key, validation.error.params);
                    
                    if (validation.error.key === 'error.matrix-j') {
                        const correctedText = text.replace(/J/gi, 'I');
                        textArea.value = correctedText;
                    }
                    return;
                }
                
                const newMatrix = this.cipher.textToMatrix(text);
                this.cipher.setMatrix(newMatrix);
            }
            
            this.invalidateAll();
            this.displayMatrix('key-matrix');
            this.displayMatrix('encryption-matrix');
            this.displayMatrix('decryption-matrix');
            
            matrixContainer.querySelector('#key-matrix').classList.remove('hidden');
            editBtn.classList.remove('hidden');
            editor.classList.add('hidden');
            errorDiv.textContent = '';
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
            if (validationResult.warning) {
                errorDiv.textContent = validationResult.warning;
                errorDiv.style.color = '#f39c12'; // 警告は黄色系
            } else {
                errorDiv.textContent = '';
                errorDiv.style.color = ''; // デフォルトに戻す
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
                errorDiv.textContent = validationResult.error;
                processSection.classList.add('hidden');
                plaintextSection.classList.add('hidden');
                return;
            }
            
            errorDiv.textContent = '';
            
            // 復号設定を取得
            const samePairRule = document.querySelector('input[name="decrypt-same-pair-rule"]:checked').value;
            
            const result = this.cipher.decrypt(ciphertext, samePairRule);
            if (!result.ok) {
                errorDiv.textContent = i18n.t(result.error.key, result.error.params);
                processSection.classList.add('hidden');
                plaintextSection.classList.add('hidden');
                return;
            }
            
            this.startPlayback('decryption', result, samePairRule);

        });
        
        copyBtn.addEventListener('click', () => {
            const plaintext = document.getElementById('decrypted-text').textContent;
            this.copyToClipboard(plaintext);
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(i18n.t('message.copied'));
        });
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
            return { valid: false, error: 'テキストを入力してください。' };
        }
        
        // 英字のみかチェック（空白、改行、その他の文字は除外される）
        const alphabetOnly = /^[a-zA-Z\s\n\r]*$/;
        if (!alphabetOnly.test(text)) {
            const invalidChars = text.match(/[^a-zA-Z\s\n\r]/g);
            const uniqueInvalidChars = [...new Set(invalidChars)].join(', ');
            return { 
                valid: false, 
                error: `許可されていない文字が含まれています: ${uniqueInvalidChars}。英字のみ入力してください。` 
            };
        }
        
        // 英字が少なくとも1文字あるかチェック
        const hasAlphabet = /[a-zA-Z]/.test(text);
        if (!hasAlphabet) {
            return { valid: false, error: '少なくとも1文字の英字を入力してください。' };
        }
        
        return { valid: true };
    }

    validateInputForEncryption(text) {
        // 空文字チェック
        if (!text.trim()) {
            return { valid: false, error: 'テキストを入力してください。' };
        }
        
        // 英字が少なくとも1文字あるかチェック
        const hasAlphabet = /[a-zA-Z]/.test(text);
        if (!hasAlphabet) {
            return { valid: false, error: '少なくとも1文字の英字を入力してください。' };
        }
        
        // 英字以外の文字があるか警告チェック
        const nonAlphabetChars = text.match(/[^a-zA-Z\s\n\r]/g);
        if (nonAlphabetChars) {
            const uniqueChars = [...new Set(nonAlphabetChars)].join(', ');
            return { 
                valid: true, 
                warning: `次の文字は無視されます: ${uniqueChars}` 
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
        this.playback[tab].steps = [];
        this.playback[tab].done = 0;
        this.results[tab] = null;
        this.render(tab);
    }

    invalidateAll() {
        this.invalidate('encryption');
        this.invalidate('decryption');
    }

    startPlayback(tab, result, variant) {
        this.stopPlayback(tab);
        this.results[tab] = { ...result, variant };
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
        previewContainer.innerHTML = '';
        
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
            exampleSelect.innerHTML = `<option value="">${i18n.t('dropdown.select-example')}</option>`;
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
            practiceSelect.innerHTML = `<option value="">${i18n.t('dropdown.select-task')}</option>`;
            practiceSelect.disabled = !selectedType;
            loadButton.disabled = true;
            challengeInfo.classList.add('hidden');
            answerCheck.classList.add('hidden');
            this.currentChallenge = null;
            this.selectedChallenge = null;

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
                    optgroup.label = i18n.getCurrentLanguage() === 'ja' ? `レベル ${level}` : `Level ${level}`;
                    challenges[level].forEach(challenge => {
                        const option = document.createElement('option');
                        option.value = challenge.id;
                        const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
                            ? i18n.t(`example.${challenge.title}`) 
                            : challenge.title;
                        option.textContent = `${translatedTitle} (${challenge.points}pt)`;
                        
                        // ロックされているレベルかチェック
                        if (!this.exerciseManager.isLevelUnlocked('decryption', parseInt(level))) {
                            option.disabled = true;
                            const lockText = i18n.getCurrentLanguage() === 'ja' ? ' [ロック]' : ' [Locked]';
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
        const details = document.querySelector('.challenge-details');
        const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
            ? i18n.t(`example.${challenge.title}`) 
            : challenge.title;
        details.querySelector('.challenge-title').textContent = translatedTitle;
        
        // 説明文の翻訳（もし翻訳キーが存在すれば）
        const descKey = `challenge.${challenge.id}.description`;
        const translatedDesc = i18n.t(descKey) !== descKey ? i18n.t(descKey) : challenge.description;
        details.querySelector('.challenge-description').textContent = translatedDesc;
        
        // ヒントの翻訳（最初のヒント）
        const hintKey = `challenge.${challenge.id}.hint.0`;
        const translatedHint = i18n.t(hintKey) !== hintKey ? i18n.t(hintKey) : challenge.hints[0];
        details.querySelector('.challenge-hint').textContent = `${i18n.t('challenge.hint-label')}${translatedHint}`;
        
        details.querySelector('.challenge-points').textContent = `${i18n.t('challenge.points-label')}${challenge.points}${i18n.t('challenge.points-unit')}`;
    }

    loadPractice(practice) {
        this.invalidateAll();
        document.getElementById('ciphertext-input').value = practice.ciphertext;
        
        // キーワードがある場合は設定
        if (practice.keyword) {
            const result = this.cipher.generateMatrixFromKeyword(practice.keyword);
            this.cipher.setMatrix(result.matrix);
            this.displayMatrix('key-matrix');
            this.displayMatrix('encryption-matrix');
            this.displayMatrix('decryption-matrix');
        }

        const translatedTitle = i18n.t(`example.${practice.title}`) !== `example.${practice.title}` 
            ? i18n.t(`example.${practice.title}`) 
            : practice.title;
        this.showToast(i18n.t('exercise.loaded.practice', { title: translatedTitle }));
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('answer-check').classList.add('hidden');
        this.currentChallenge = null;
    }

    loadChallenge(challenge) {
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
        
        // ヒントボタンとカウンターを初期化
        const hintButton = document.getElementById('hint-button');
        const hintCounter = document.getElementById('hint-counter');
        if (challenge.hints && challenge.hints.length > 0) {
            hintButton.innerHTML = `${i18n.t('decrypt.hint')} <span id="hint-counter" class="hint-counter">(1/${challenge.hints.length})</span>`;
        } else {
            hintButton.innerHTML = `${i18n.t('decrypt.hint')} <span id="hint-counter" class="hint-counter hidden">(1/4)</span>`;
        }
        
        document.getElementById('answer-result').textContent = '';
        document.getElementById('hint-display').innerHTML = '';
        document.getElementById('hint-display').classList.add('hidden');
        document.getElementById('hint-display').dataset.hintIndex = '0';
        
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('answer-check').classList.remove('hidden');
        this.currentChallenge = challenge;
    }

    checkChallengeAnswer() {
        if (!this.currentChallenge) return;

        const userAnswer = document.getElementById('challenge-answer').value.trim();
        if (!userAnswer) {
            const resultDiv = document.getElementById('answer-result');
            resultDiv.textContent = i18n.t('message.enter-answer');
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
        resultDiv.textContent = i18n.t(`answer.${result.result}`);
        resultDiv.className = 'answer-result ' + (result.result === 'correct' ? 'correct' : 'incorrect');

        if (result.result === 'correct') {
            this.showToast(`${i18n.t('message.correct')} ${result.points}${i18n.getCurrentLanguage() === 'ja' ? 'ポイント獲得しました！' : ' points earned!'}`);
            this.updateProgressDisplay();
            this.refreshDecryptionChallenges();
            
            // 正解時は解答入力欄を無効化
            document.getElementById('challenge-answer').disabled = true;
            document.getElementById('check-answer').disabled = true;
        }
    }

    showHint() {
        if (!this.currentChallenge || !this.currentChallenge.hints) return;

        const hintDisplay = document.getElementById('hint-display');
        const hintButton = document.getElementById('hint-button');
        const hintCounter = document.getElementById('hint-counter');
        const hints = this.currentChallenge.hints;
        
        // 段階的にヒントを表示
        let currentHintIndex = hintDisplay.dataset.hintIndex || 0;
        currentHintIndex = parseInt(currentHintIndex);
        
        if (currentHintIndex < hints.length) {
            // ヒントの翻訳を試みる
            const hintKey = `challenge.${this.currentChallenge.id}.hint.${currentHintIndex}`;
            const translatedHint = i18n.t(hintKey) !== hintKey ? i18n.t(hintKey) : hints[currentHintIndex];
            
            const currentContent = hintDisplay.innerHTML;
            
            if (currentContent) {
                hintDisplay.innerHTML = currentContent + '<br>💡 ' + translatedHint;
            } else {
                hintDisplay.innerHTML = '💡 ' + translatedHint;
            }
            
            hintDisplay.classList.remove('hidden');
            hintDisplay.dataset.hintIndex = currentHintIndex + 1;
            
            // ヒントカウンターを更新
            const nextHintIndex = currentHintIndex + 1;
            if (nextHintIndex < hints.length) {
                hintCounter.textContent = `(${nextHintIndex + 1}/${hints.length})`;
                hintCounter.classList.remove('hidden');
                hintButton.innerHTML = `${i18n.t('decrypt.hint-next')} <span id="hint-counter" class="hint-counter">(${nextHintIndex + 1}/${hints.length})</span>`;
            } else {
                // 最後のヒントの場合ボタンを無効化
                hintButton.disabled = true;
                const completeText = i18n.getCurrentLanguage() === 'ja' ? '完了' : 'Complete';
                hintButton.innerHTML = `${i18n.t('decrypt.hint-complete')} <span id="hint-counter" class="hint-counter">(${completeText})</span>`;
            }
        }
    }

    getCurrentMatrixString() {
        return this.cipher.getMatrix().flat().join('');
    }

    setupProgressDisplay() {
        const progressToggle = document.getElementById('progress-toggle');
        const progressContent = document.getElementById('progress-content');
        const resetButton = document.getElementById('reset-progress');
        
        // アコーディオン開閉
        progressToggle.addEventListener('click', () => {
            const isExpanded = !progressContent.classList.contains('hidden');
            
            if (isExpanded) {
                progressContent.classList.add('hidden');
                progressToggle.classList.remove('expanded');
            } else {
                progressContent.classList.remove('hidden');
                progressToggle.classList.add('expanded');
            }
        });
        
        // リセット機能
        resetButton.addEventListener('click', () => {
            const confirmed = confirm(i18n.t('message.reset-confirm'));
            
            if (confirmed) {
                this.exerciseManager.resetProgress();
                this.updateProgressDisplay();
                this.updateProgressSummary();
                this.showToast(i18n.t('message.reset-success'));
                
                // UI状態もリセット
                this.resetExerciseUI();
            }
        });
    }

    updateProgressDisplay() {
        const progress = this.exerciseManager.getProgress();
        
        document.getElementById('total-points').textContent = progress.totalPoints;
        document.getElementById('completed-challenges').textContent = progress.completedChallenges.length;
        
        const decryptionLevel = progress.unlockedLevels.decryption;
        const maxLevel = decryptionLevel;
        document.getElementById('unlocked-levels').textContent = `${maxLevel}/3`;
        
        this.updateProgressSummary();
    }

    updateProgressSummary() {
        const progress = this.exerciseManager.getProgress();
        const decryptionLevel = progress.unlockedLevels.decryption;
        const maxLevel = decryptionLevel;
        
        const summary = i18n.t('progress.summary', {
            points: progress.totalPoints,
            challenges: progress.completedChallenges.length,
            level: maxLevel
        });
        document.getElementById('progress-summary').textContent = summary;
    }

    refreshDecryptionChallenges() {
        const typeSelect = document.getElementById('practice-type');
        const practiceSelect = document.getElementById('practice-list');
        
        // チャレンジタイプが選択されている場合のみ更新
        if (typeSelect.value === 'challenge') {
            practiceSelect.innerHTML = `<option value="">${i18n.t('dropdown.select-task')}</option>`;
            
            const challenges = this.exerciseManager.getChallengesByLevel('decryption');
            Object.keys(challenges).sort().forEach(level => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = i18n.getCurrentLanguage() === 'ja' ? `レベル ${level}` : `Level ${level}`;
                challenges[level].forEach(challenge => {
                    const option = document.createElement('option');
                    option.value = challenge.id;
                    const translatedTitle = i18n.t(`example.${challenge.title}`) !== `example.${challenge.title}` 
                        ? i18n.t(`example.${challenge.title}`) 
                        : challenge.title;
                    option.textContent = `${translatedTitle} (${challenge.points}pt)`;
                    
                    // ロックされているレベルかチェック
                    if (!this.exerciseManager.isLevelUnlocked('decryption', parseInt(level))) {
                        option.disabled = true;
                        const lockText = i18n.getCurrentLanguage() === 'ja' ? ' [ロック]' : ' [Locked]';
                        option.textContent += lockText;
                    }
                    
                    // 完了済みチャレンジにマーク
                    if (this.exerciseManager.isChallengeCompleted(challenge.id)) {
                        option.textContent += ' ✓';
                    }
                    
                    optgroup.appendChild(option);
                });
                practiceSelect.appendChild(optgroup);
            });
        }
    }

    resetExerciseUI() {
        // 例文選択をリセット
        document.getElementById('example-category').selectedIndex = 0;
        document.getElementById('example-list').innerHTML = `<option value="">${i18n.t('dropdown.select-example')}</option>`;
        document.getElementById('example-list').disabled = true;
        document.getElementById('load-example').disabled = true;
        
        // 課題選択をリセット
        document.getElementById('practice-type').selectedIndex = 0;
        document.getElementById('practice-list').innerHTML = `<option value="">${i18n.t('dropdown.select-task')}</option>`;
        document.getElementById('practice-list').disabled = true;
        document.getElementById('load-practice').disabled = true;
        
        // チャレンジ情報とチェック結果を隠す
        document.getElementById('challenge-info').classList.add('hidden');
        document.getElementById('answer-check').classList.add('hidden');
        document.getElementById('answer-result').textContent = '';
        
        this.currentChallenge = null;
    }
}
