class UI {
    constructor() {
        this.cipher = new PlayfairCipher();
        this.exerciseManager = new ExerciseManager();
        this.currentTab = 'key-generation';
        this.animationQueue = [];
        this.isAnimating = false;
        this.lastEncryptionData = null;
        this.lastDecryptionData = null;
        this.encryptionSteps = [];
        this.decryptionSteps = [];
        this.currentEncryptionStep = 0;
        this.currentDecryptionStep = 0;
        this.autoPlayTimer = null;
        this.currentChallenge = null;
    }

    init() {
        this.setupTabs();
        this.setupKeyGeneration();
        this.setupEncryption();
        this.setupDecryption();
        this.setupExercises();
        this.displayMatrix('key-matrix');
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
                
                this.currentTab = targetTab;
                
                if (targetTab === 'encryption') {
                    this.displayMatrix('encryption-matrix');
                } else if (targetTab === 'decryption') {
                    this.displayMatrix('decryption-matrix');
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
                    errorDiv.textContent = validation.error;
                    return;
                }
                
                const result = this.cipher.generateMatrixFromKeyword(keyword);
                this.cipher.setMatrix(result.matrix);
                
            } else {
                const text = textArea.value;
                const validation = this.cipher.validateMatrix(text);
                
                if (!validation.valid) {
                    errorDiv.textContent = validation.error;
                    
                    if (validation.warning) {
                        const correctedText = text.replace(/J/gi, 'I');
                        textArea.value = correctedText;
                    }
                    return;
                }
                
                const newMatrix = this.cipher.textToMatrix(text);
                this.cipher.setMatrix(newMatrix);
            }
            
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
            
            this.displayPairs('pair-display', result.pairs, result.processed);
            this.displayEncryptionMessage(result.processed, paddingChar, samePairMode, samePairRule);
            
            // 変換後の表示エリアを初期化
            this.initializeEncryptedPairsDisplay(result.encryptedPairs.length);
            
            processSection.classList.remove('hidden');
            ciphertextSection.classList.remove('hidden');
            
            document.getElementById('ciphertext').textContent = result.ciphertext;
            
            // アニメーションデータを保存
            this.lastEncryptionData = { pairs: result.pairs, encryptedPairs: result.encryptedPairs };
            this.setupEncryptionSteps(result.pairs, result.encryptedPairs);
            
            this.startEncryptionAnimation();
        });
        
        // アニメーション制御ボタンのイベント
        document.getElementById('play-pause-encryption').addEventListener('click', () => {
            this.toggleEncryptionAnimation();
        });
        
        document.getElementById('prev-step-encryption').addEventListener('click', () => {
            this.prevEncryptionStep();
        });
        
        document.getElementById('next-step-encryption').addEventListener('click', () => {
            this.nextEncryptionStep();
        });
        
        document.getElementById('restart-encryption').addEventListener('click', () => {
            this.restartEncryptionAnimation();
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
            
            const result = this.cipher.decrypt(ciphertext, samePairRule, 'X', false);
            
            this.displayPairs('decrypt-pair-display', result.pairs);
            
            // 変換後の表示エリアを初期化
            this.initializeDecryptedPairsDisplay(result.decryptedPairs.length);
            
            processSection.classList.remove('hidden');
            plaintextSection.classList.remove('hidden');
            
            document.getElementById('decrypted-text').textContent = result.plaintext;
            
            this.displayDecryptionNotes(result.plaintext);
            
            // アニメーションデータを保存
            this.lastDecryptionData = { pairs: result.pairs, decryptedPairs: result.decryptedPairs };
            this.setupDecryptionSteps(result.pairs, result.decryptedPairs);
            
            this.startDecryptionAnimation();
        });
        
        // アニメーション制御ボタンのイベント
        document.getElementById('play-pause-decryption').addEventListener('click', () => {
            this.toggleDecryptionAnimation();
        });
        
        document.getElementById('prev-step-decryption').addEventListener('click', () => {
            this.prevDecryptionStep();
        });
        
        document.getElementById('next-step-decryption').addEventListener('click', () => {
            this.nextDecryptionStep();
        });
        
        document.getElementById('restart-decryption').addEventListener('click', () => {
            this.restartDecryptionAnimation();
        });
        
        copyBtn.addEventListener('click', () => {
            const plaintext = document.getElementById('decrypted-text').textContent;
            this.copyToClipboard(plaintext);
        });
    }

    displayPairs(containerId, pairs, processedText = null) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        pairs.forEach((pair, index) => {
            const span = document.createElement('span');
            span.textContent = pair;
            
            if (processedText && pair[0] === pair[1]) {
                span.classList.add('same-pair');
            }
            
            container.appendChild(span);
            
            if (index < pairs.length - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        });
    }

    displayEncryptionMessage(processed, paddingChar, samePairMode, samePairRule) {
        const messageDiv = document.getElementById('encryption-message');
        const messages = [];
        
        if (samePairMode) {
            // 補完モードONの場合
            for (let i = 0; i < processed.length - 1; i++) {
                if (processed[i] === processed[i + 1]) {
                    messages.push(`同一文字ペア "${processed[i]}${processed[i]}" を検出しました。間に補完文字 "${paddingChar}" を挿入しました。`);
                }
            }
        } else {
            // 補完モードOFFの場合
            const pairs = this.cipher.createPairs(processed);
            const samePairs = pairs.filter(pair => pair[0] === pair[1]);
            
            if (samePairs.length > 0) {
                if (samePairRule === 'right-shift') {
                    messages.push(`同一文字ペア ${samePairs.map(p => `"${p}"`).join(', ')} を検出しました。右隣の文字に置換して処理しました。`);
                } else if (samePairRule === 'bottom-right') {
                    messages.push(`同一文字ペア ${samePairs.map(p => `"${p}"`).join(', ')} を検出しました。各文字を1つ右、1つ下の位置に移動して処理しました。`);
                } else {
                    messages.push(`同一文字ペア ${samePairs.map(p => `"${p}"`).join(', ')} を検出しました。変化なしで処理しました。`);
                }
            }
        }
        
        if (messages.length > 0) {
            messageDiv.textContent = messages.join(' ');
            messageDiv.classList.remove('hidden');
        } else {
            messageDiv.classList.add('hidden');
        }
    }

    displayDecryptionNotes(plaintext) {
        const notesDiv = document.getElementById('decryption-notes');
        const notes = [];
        
        if (plaintext.includes('x') || plaintext.includes('q') || plaintext.includes('z')) {
            notes.push('復号結果に x, q, z が含まれています。これらは補完文字の可能性があります。');
        }
        
        if (plaintext.includes('i')) {
            notes.push('復号結果の "i" は元のテキストでは "j" だった可能性があります。');
        }
        
        if (notes.length > 0) {
            notesDiv.innerHTML = notes.join('<br>');
            notesDiv.classList.remove('hidden');
        } else {
            notesDiv.classList.add('hidden');
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('クリップボードにコピーしました');
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


    async animatePair(originalPair, transformedPair, matrixId, index) {
        const matrix = document.getElementById(matrixId);
        const cells = matrix.querySelectorAll('.matrix-cell');
        
        cells.forEach(cell => {
            cell.classList.remove('highlight-source', 'highlight-target');
        });
        
        const pos1 = this.cipher.findPosition(originalPair[0]);
        const pos2 = this.cipher.findPosition(originalPair[1]);
        const newPos1 = this.cipher.findPosition(transformedPair[0]);
        const newPos2 = this.cipher.findPosition(transformedPair[1]);
        
        if (pos1 && pos2) {
            const cell1 = matrix.querySelector(`[data-row="${pos1.row}"][data-col="${pos1.col}"]`);
            const cell2 = matrix.querySelector(`[data-row="${pos2.row}"][data-col="${pos2.col}"]`);
            
            if (cell1) cell1.classList.add('highlight-source');
            if (cell2) cell2.classList.add('highlight-source');
        }
        
        await this.delay(800);
        
        if (newPos1 && newPos2) {
            const newCell1 = matrix.querySelector(`[data-row="${newPos1.row}"][data-col="${newPos1.col}"]`);
            const newCell2 = matrix.querySelector(`[data-row="${newPos2.row}"][data-col="${newPos2.col}"]`);
            
            if (newCell1) newCell1.classList.add('highlight-target');
            if (newCell2) newCell2.classList.add('highlight-target');
            
            // 変換後の表示を更新
            if (matrixId === 'encryption-matrix') {
                this.updateEncryptedPairDisplay(index, transformedPair);
            } else if (matrixId === 'decryption-matrix') {
                this.updateDecryptedPairDisplay(index, transformedPair);
            }
        }
        
        await this.delay(800);
    }


    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    setupEncryptionSteps(pairs, encryptedPairs) {
        this.encryptionSteps = pairs.map((pair, index) => ({
            originalPair: pair,
            encryptedPair: encryptedPairs[index],
            index: index
        }));
        this.currentEncryptionStep = 0;
        this.updateEncryptionStepInfo();
        this.updateEncryptionControls();
    }

    setupDecryptionSteps(pairs, decryptedPairs) {
        this.decryptionSteps = pairs.map((pair, index) => ({
            originalPair: pair,
            decryptedPair: decryptedPairs[index],
            index: index
        }));
        this.currentDecryptionStep = 0;
        this.updateDecryptionStepInfo();
        this.updateDecryptionControls();
    }

    updateEncryptionStepInfo() {
        const stepInfo = document.getElementById('step-info-encryption');
        stepInfo.textContent = `${this.currentEncryptionStep} / ${this.encryptionSteps.length}`;
    }

    updateDecryptionStepInfo() {
        const stepInfo = document.getElementById('step-info-decryption');
        stepInfo.textContent = `${this.currentDecryptionStep} / ${this.decryptionSteps.length}`;
    }

    updateEncryptionControls() {
        const prevBtn = document.getElementById('prev-step-encryption');
        const nextBtn = document.getElementById('next-step-encryption');
        const playPauseBtn = document.getElementById('play-pause-encryption');
        
        prevBtn.disabled = this.currentEncryptionStep === 0;
        nextBtn.disabled = this.currentEncryptionStep === this.encryptionSteps.length;
        
        // アニメーション完了時は再生ボタンを無効化
        if (this.currentEncryptionStep === this.encryptionSteps.length) {
            playPauseBtn.disabled = true;
            playPauseBtn.textContent = '▶ 再生';
        } else {
            playPauseBtn.disabled = false;
        }
    }

    updateDecryptionControls() {
        const prevBtn = document.getElementById('prev-step-decryption');
        const nextBtn = document.getElementById('next-step-decryption');
        const playPauseBtn = document.getElementById('play-pause-decryption');
        
        prevBtn.disabled = this.currentDecryptionStep === 0;
        nextBtn.disabled = this.currentDecryptionStep === this.decryptionSteps.length;
        
        // アニメーション完了時は再生ボタンを無効化
        if (this.currentDecryptionStep === this.decryptionSteps.length) {
            playPauseBtn.disabled = true;
            playPauseBtn.textContent = '▶ 再生';
        } else {
            playPauseBtn.disabled = false;
        }
    }

    startEncryptionAnimation() {
        this.initializeEncryptedPairsDisplay(this.encryptionSteps.length);
        this.currentEncryptionStep = 0;
        this.updateEncryptionStepInfo();
        this.updateEncryptionControls();
        this.clearMatrix('encryption-matrix');
        this.toggleEncryptionAnimation();
    }

    startDecryptionAnimation() {
        this.initializeDecryptedPairsDisplay(this.decryptionSteps.length);
        this.currentDecryptionStep = 0;
        this.updateDecryptionStepInfo();
        this.updateDecryptionControls();
        this.clearMatrix('decryption-matrix');
        this.toggleDecryptionAnimation();
    }

    toggleEncryptionAnimation() {
        const playPauseBtn = document.getElementById('play-pause-encryption');
        
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
            playPauseBtn.textContent = '▶ 再生';
        } else {
            playPauseBtn.textContent = '⏸ 停止';
            this.autoPlayEncryption();
        }
    }

    toggleDecryptionAnimation() {
        const playPauseBtn = document.getElementById('play-pause-decryption');
        
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
            playPauseBtn.textContent = '▶ 再生';
        } else {
            playPauseBtn.textContent = '⏸ 停止';
            this.autoPlayDecryption();
        }
    }

    autoPlayEncryption() {
        if (this.currentEncryptionStep < this.encryptionSteps.length) {
            this.nextEncryptionStep();
            this.autoPlayTimer = setTimeout(() => {
                this.autoPlayEncryption();
            }, 1600); // 800ms * 2 for each step
        } else {
            const playPauseBtn = document.getElementById('play-pause-encryption');
            playPauseBtn.textContent = '▶ 再生';
            playPauseBtn.disabled = true;
            this.autoPlayTimer = null;
        }
    }

    autoPlayDecryption() {
        if (this.currentDecryptionStep < this.decryptionSteps.length) {
            this.nextDecryptionStep();
            this.autoPlayTimer = setTimeout(() => {
                this.autoPlayDecryption();
            }, 1600);
        } else {
            const playPauseBtn = document.getElementById('play-pause-decryption');
            playPauseBtn.textContent = '▶ 再生';
            playPauseBtn.disabled = true;
            this.autoPlayTimer = null;
        }
    }

    prevEncryptionStep() {
        if (this.currentEncryptionStep > 0) {
            this.currentEncryptionStep--;
            this.updateEncryptionStepInfo();
            this.updateEncryptionControls();
            this.refreshEncryptionDisplay();
        }
    }

    nextEncryptionStep() {
        if (this.currentEncryptionStep < this.encryptionSteps.length) {
            this.showEncryptionStep(this.currentEncryptionStep);
            this.currentEncryptionStep++;
            this.updateEncryptionStepInfo();
            this.updateEncryptionControls();
        }
    }

    prevDecryptionStep() {
        if (this.currentDecryptionStep > 0) {
            this.currentDecryptionStep--;
            this.updateDecryptionStepInfo();
            this.updateDecryptionControls();
            this.refreshDecryptionDisplay();
        }
    }

    nextDecryptionStep() {
        if (this.currentDecryptionStep < this.decryptionSteps.length) {
            this.showDecryptionStep(this.currentDecryptionStep);
            this.currentDecryptionStep++;
            this.updateDecryptionStepInfo();
            this.updateDecryptionControls();
        }
    }

    async showEncryptionStep(stepIndex) {
        const step = this.encryptionSteps[stepIndex];
        if (step) {
            await this.animatePair(step.originalPair, step.encryptedPair, 'encryption-matrix', step.index);
        }
    }

    async showDecryptionStep(stepIndex) {
        const step = this.decryptionSteps[stepIndex];
        if (step) {
            await this.animatePair(step.originalPair, step.decryptedPair, 'decryption-matrix', step.index);
        }
    }

    clearMatrix(matrixId) {
        const matrix = document.getElementById(matrixId);
        const cells = matrix.querySelectorAll('.matrix-cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight-source', 'highlight-target');
        });
    }

    refreshEncryptionDisplay() {
        this.initializeEncryptedPairsDisplay(this.encryptionSteps.length);
        this.clearMatrix('encryption-matrix');
        
        // Show all steps up to current step
        for (let i = 0; i < this.currentEncryptionStep; i++) {
            const step = this.encryptionSteps[i];
            this.updateEncryptedPairDisplay(i, step.encryptedPair);
        }
    }

    refreshDecryptionDisplay() {
        this.initializeDecryptedPairsDisplay(this.decryptionSteps.length);
        this.clearMatrix('decryption-matrix');
        
        // Show all steps up to current step
        for (let i = 0; i < this.currentDecryptionStep; i++) {
            const step = this.decryptionSteps[i];
            this.updateDecryptedPairDisplay(i, step.decryptedPair);
        }
    }

    initializeEncryptedPairsDisplay(pairCount) {
        const container = document.getElementById('encrypted-pair-display');
        container.innerHTML = '';
        
        for (let i = 0; i < pairCount; i++) {
            const span = document.createElement('span');
            span.className = 'pair-slot';
            span.dataset.index = i;
            span.textContent = '--';
            span.style.opacity = '0.3';
            container.appendChild(span);
            
            if (i < pairCount - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        }
    }

    initializeDecryptedPairsDisplay(pairCount) {
        const container = document.getElementById('decrypted-pair-display');
        container.innerHTML = '';
        
        for (let i = 0; i < pairCount; i++) {
            const span = document.createElement('span');
            span.className = 'pair-slot';
            span.dataset.index = i;
            span.textContent = '--';
            span.style.opacity = '0.3';
            container.appendChild(span);
            
            if (i < pairCount - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        }
    }

    updateEncryptedPairDisplay(index, encryptedPair) {
        const container = document.getElementById('encrypted-pair-display');
        const slot = container.querySelector(`span[data-index="${index}"]`);
        
        if (slot) {
            slot.textContent = encryptedPair;
            slot.className = 'encrypted-pair';
            slot.style.opacity = '1';
        }
    }

    updateDecryptedPairDisplay(index, decryptedPair) {
        const container = document.getElementById('decrypted-pair-display');
        const slot = container.querySelector(`span[data-index="${index}"]`);
        
        if (slot) {
            slot.textContent = decryptedPair;
            slot.className = 'decrypted-pair';
            slot.style.opacity = '1';
        }
    }

    restartEncryptionAnimation() {
        // 自動再生を停止
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        // 初期状態にリセット
        this.currentEncryptionStep = 0;
        this.updateEncryptionStepInfo();
        this.updateEncryptionControls();
        this.refreshEncryptionDisplay();
        
        // 再生ボタンを有効化
        const playPauseBtn = document.getElementById('play-pause-encryption');
        playPauseBtn.textContent = '▶ 再生';
        playPauseBtn.disabled = false;
    }

    restartDecryptionAnimation() {
        // 自動再生を停止
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        // 初期状態にリセット
        this.currentDecryptionStep = 0;
        this.updateDecryptionStepInfo();
        this.updateDecryptionControls();
        this.refreshDecryptionDisplay();
        
        // 再生ボタンを有効化
        const playPauseBtn = document.getElementById('play-pause-decryption');
        playPauseBtn.textContent = '▶ 再生';
        playPauseBtn.disabled = false;
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
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            exampleSelect.innerHTML = '<option value="">例文を選択...</option>';
            exampleSelect.disabled = !selectedCategory;
            loadButton.disabled = true;

            if (selectedCategory) {
                const examples = categories[selectedCategory];
                examples.forEach(example => {
                    const option = document.createElement('option');
                    option.value = example.id;
                    option.textContent = `${example.title} - "${example.plaintext}"`;
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
                document.getElementById('plaintext').value = selectedExample.plaintext;
                
                // キーワードがある場合は設定
                if (selectedExample.keyword) {
                    const result = this.cipher.generateMatrixFromKeyword(selectedExample.keyword);
                    this.cipher.setMatrix(result.matrix);
                    this.displayMatrix('key-matrix');
                    this.displayMatrix('encryption-matrix');
                    this.displayMatrix('decryption-matrix');
                }

                this.showToast(`例文「${selectedExample.title}」を読み込みました`);
                
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
            practiceSelect.innerHTML = '<option value="">課題を選択...</option>';
            practiceSelect.disabled = !selectedType;
            loadButton.disabled = true;
            challengeInfo.classList.add('hidden');
            answerCheck.classList.add('hidden');
            this.currentChallenge = null;

            if (selectedType === 'practice') {
                const practices = this.exerciseManager.getPracticesByCategory();
                Object.keys(practices).forEach(category => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = category;
                    practices[category].forEach(practice => {
                        const option = document.createElement('option');
                        option.value = practice.id;
                        option.textContent = `${practice.title} - ${practice.ciphertext}`;
                        optgroup.appendChild(option);
                    });
                    practiceSelect.appendChild(optgroup);
                });
                practiceSelect.disabled = false;
            } else if (selectedType === 'challenge') {
                const challenges = this.exerciseManager.getChallengesByLevel('decryption');
                Object.keys(challenges).sort().forEach(level => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = `レベル ${level}`;
                    challenges[level].forEach(challenge => {
                        const option = document.createElement('option');
                        option.value = challenge.id;
                        option.textContent = `${challenge.title} (${challenge.points}pt)`;
                        
                        // ロックされているレベルかチェック
                        if (!this.exerciseManager.isLevelUnlocked('decryption', parseInt(level))) {
                            option.disabled = true;
                            option.textContent += ' [ロック]';
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
        details.querySelector('.challenge-title').textContent = challenge.title;
        details.querySelector('.challenge-description').textContent = challenge.description;
        details.querySelector('.challenge-hint').textContent = `ヒント: ${challenge.hints[0]}`;
        details.querySelector('.challenge-points').textContent = `獲得ポイント: ${challenge.points}pt`;
    }

    loadPractice(practice) {
        document.getElementById('ciphertext-input').value = practice.ciphertext;
        
        // キーワードがある場合は設定
        if (practice.keyword) {
            const result = this.cipher.generateMatrixFromKeyword(practice.keyword);
            this.cipher.setMatrix(result.matrix);
            this.displayMatrix('key-matrix');
            this.displayMatrix('encryption-matrix');
            this.displayMatrix('decryption-matrix');
        }

        this.showToast(`練習問題「${practice.title}」を読み込みました`);
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('answer-check').classList.add('hidden');
        this.currentChallenge = null;
    }

    loadChallenge(challenge) {
        document.getElementById('ciphertext-input').value = challenge.ciphertext;
        
        // キーワードがある場合は設定（チャレンジでは初期状態では設定しない）
        if (challenge.keyword) {
            // チャレンジなのでキーワードはユーザーが見つける必要がある
            this.showToast(`チャレンジ「${challenge.title}」を読み込みました。鍵を推測してください。`);
        } else {
            this.showToast(`チャレンジ「${challenge.title}」を読み込みました`);
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
            hintButton.innerHTML = `ヒントを見る <span id="hint-counter" class="hint-counter">(1/${challenge.hints.length})</span>`;
        } else {
            hintButton.innerHTML = 'ヒントを見る <span id="hint-counter" class="hint-counter hidden">(1/4)</span>';
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
            resultDiv.textContent = '解答を入力してください。';
            resultDiv.className = 'answer-result incorrect';
            return;
        }

        const userKeyword = this.getCurrentKeyword();
        
        const result = this.exerciseManager.validateAnswer(
            'decryption', 
            this.currentChallenge.id, 
            userAnswer, 
            userKeyword
        );

        const resultDiv = document.getElementById('answer-result');
        resultDiv.textContent = result.message;
        resultDiv.className = 'answer-result ' + (result.correct ? 'correct' : 'incorrect');

        if (result.correct && result.points) {
            this.showToast(`正解！ ${result.points}ポイント獲得しました！`);
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
            const hintText = hints[currentHintIndex];
            const currentContent = hintDisplay.innerHTML;
            
            if (currentContent) {
                hintDisplay.innerHTML = currentContent + '<br>💡 ' + hintText;
            } else {
                hintDisplay.innerHTML = '💡 ' + hintText;
            }
            
            hintDisplay.classList.remove('hidden');
            hintDisplay.dataset.hintIndex = currentHintIndex + 1;
            
            // ヒントカウンターを更新
            const nextHintIndex = currentHintIndex + 1;
            if (nextHintIndex < hints.length) {
                hintCounter.textContent = `(${nextHintIndex + 1}/${hints.length})`;
                hintCounter.classList.remove('hidden');
                hintButton.innerHTML = `次のヒントを見る <span id="hint-counter" class="hint-counter">(${nextHintIndex + 1}/${hints.length})</span>`;
            } else {
                // 最後のヒントの場合ボタンを無効化
                hintButton.disabled = true;
                hintButton.innerHTML = 'ヒント完了 <span id="hint-counter" class="hint-counter">(完了)</span>';
            }
        }
    }

    getCurrentKeyword() {
        // チャレンジ解答時は、チャレンジのキーワードを使用
        if (this.currentChallenge && this.currentChallenge.keyword) {
            return this.currentChallenge.keyword;
        }
        
        // 現在設定されているマトリクスからキーワードを推測するのは困難なので、
        // ここでは空文字を返す（将来的に改善可能）
        return '';
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
            const confirmed = confirm(
                '学習進捗をリセットしますか？\n\n' +
                '- 獲得ポイントが0になります\n' +
                '- クリア済み課題の記録が消去されます\n' +
                '- レベル解放状況がリセットされます\n\n' +
                'この操作は取り消せません。'
            );
            
            if (confirmed) {
                this.exerciseManager.resetProgress();
                this.updateProgressDisplay();
                this.updateProgressSummary();
                this.showToast('学習進捗をリセットしました');
                
                // UI状態もリセット
                this.resetExerciseUI();
            }
        });
    }

    updateProgressDisplay() {
        const progress = this.exerciseManager.getProgress();
        
        document.getElementById('total-points').textContent = progress.totalPoints;
        document.getElementById('completed-challenges').textContent = progress.completedChallenges.length;
        
        const encryptionLevel = progress.unlockedLevels.encryption;
        const decryptionLevel = progress.unlockedLevels.decryption;
        const maxLevel = Math.max(encryptionLevel, decryptionLevel);
        document.getElementById('unlocked-levels').textContent = `${maxLevel}/3`;
        
        this.updateProgressSummary();
    }

    updateProgressSummary() {
        const progress = this.exerciseManager.getProgress();
        const encryptionLevel = progress.unlockedLevels.encryption;
        const decryptionLevel = progress.unlockedLevels.decryption;
        const maxLevel = Math.max(encryptionLevel, decryptionLevel);
        
        const summary = `総ポイント: ${progress.totalPoints} | クリア課題: ${progress.completedChallenges.length} | レベル: ${maxLevel}/3`;
        document.getElementById('progress-summary').textContent = summary;
    }

    refreshDecryptionChallenges() {
        const typeSelect = document.getElementById('practice-type');
        const practiceSelect = document.getElementById('practice-list');
        
        // チャレンジタイプが選択されている場合のみ更新
        if (typeSelect.value === 'challenge') {
            practiceSelect.innerHTML = '<option value="">課題を選択...</option>';
            
            const challenges = this.exerciseManager.getChallengesByLevel('decryption');
            Object.keys(challenges).sort().forEach(level => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `レベル ${level}`;
                challenges[level].forEach(challenge => {
                    const option = document.createElement('option');
                    option.value = challenge.id;
                    option.textContent = `${challenge.title} (${challenge.points}pt)`;
                    
                    // ロックされているレベルかチェック
                    if (!this.exerciseManager.isLevelUnlocked('decryption', parseInt(level))) {
                        option.disabled = true;
                        option.textContent += ' [ロック]';
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
        document.getElementById('example-list').innerHTML = '<option value="">例文を選択...</option>';
        document.getElementById('example-list').disabled = true;
        document.getElementById('load-example').disabled = true;
        
        // 課題選択をリセット
        document.getElementById('practice-type').selectedIndex = 0;
        document.getElementById('practice-list').innerHTML = '<option value="">課題を選択...</option>';
        document.getElementById('practice-list').disabled = true;
        document.getElementById('load-practice').disabled = true;
        
        // チャレンジ情報とチェック結果を隠す
        document.getElementById('challenge-info').classList.add('hidden');
        document.getElementById('answer-check').classList.add('hidden');
        document.getElementById('answer-result').textContent = '';
        
        this.currentChallenge = null;
    }
}