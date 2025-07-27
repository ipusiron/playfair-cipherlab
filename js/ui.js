class UI {
    constructor() {
        this.cipher = new PlayfairCipher();
        this.currentTab = 'key-generation';
        this.animationQueue = [];
        this.isAnimating = false;
    }

    init() {
        this.setupTabs();
        this.setupKeyGeneration();
        this.setupEncryption();
        this.setupDecryption();
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
        const errorDiv = document.getElementById('matrix-error');
        
        editBtn.addEventListener('click', () => {
            matrixContainer.querySelector('#key-matrix').classList.add('hidden');
            editBtn.classList.add('hidden');
            editor.classList.remove('hidden');
            
            textArea.value = this.cipher.matrixToText();
            textArea.focus();
        });
        
        cancelBtn.addEventListener('click', () => {
            matrixContainer.querySelector('#key-matrix').classList.remove('hidden');
            editBtn.classList.remove('hidden');
            editor.classList.add('hidden');
            errorDiv.textContent = '';
        });
        
        saveBtn.addEventListener('click', () => {
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
        const samePairCheckbox = document.getElementById('same-pair-padding');
        const paddingCharContainer = document.getElementById('padding-char-container');
        
        // 初期状態でボタンを無効化
        encryptBtn.disabled = true;
        
        // 入力欄の変更を監視
        plaintextInput.addEventListener('input', () => {
            const hasText = plaintextInput.value.trim().length > 0;
            encryptBtn.disabled = !hasText;
        });
        
        // 同一ペア補完モードのチェックボックス変更時の処理
        samePairCheckbox.addEventListener('change', () => {
            const radios = paddingCharContainer.querySelectorAll('input[type="radio"]');
            if (samePairCheckbox.checked) {
                paddingCharContainer.classList.remove('disabled');
                radios.forEach(radio => radio.disabled = false);
            } else {
                paddingCharContainer.classList.add('disabled');
                radios.forEach(radio => radio.disabled = true);
            }
        });
        
        encryptBtn.addEventListener('click', () => {
            const plaintext = plaintextInput.value;
            if (!plaintext.trim()) return;
            
            // 入力検証
            const validationResult = this.validateInput(plaintext);
            if (!validationResult.valid) {
                errorDiv.textContent = validationResult.error;
                processSection.classList.add('hidden');
                ciphertextSection.classList.add('hidden');
                return;
            }
            
            errorDiv.textContent = '';
            
            const paddingChar = document.querySelector('input[name="padding-char"]:checked').value;
            const samePairPadding = document.getElementById('same-pair-padding').checked;
            
            const result = this.cipher.encrypt(plaintext, paddingChar, samePairPadding);
            
            this.displayPairs('pair-display', result.pairs, result.processed);
            this.displayEncryptionMessage(result.processed, paddingChar, samePairPadding);
            
            processSection.classList.remove('hidden');
            ciphertextSection.classList.remove('hidden');
            
            document.getElementById('ciphertext').textContent = result.ciphertext;
            
            this.animateEncryption(result.pairs, result.encryptedPairs);
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
            
            const result = this.cipher.decrypt(ciphertext);
            
            this.displayPairs('decrypt-pair-display', result.pairs);
            
            processSection.classList.remove('hidden');
            plaintextSection.classList.remove('hidden');
            
            document.getElementById('decrypted-text').textContent = result.plaintext;
            
            this.displayDecryptionNotes(result.plaintext);
            
            this.animateDecryption(result.pairs, result.decryptedPairs);
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

    displayEncryptionMessage(processed, paddingChar, samePairPadding) {
        const messageDiv = document.getElementById('encryption-message');
        const messages = [];
        
        for (let i = 0; i < processed.length - 1; i++) {
            if (processed[i] === processed[i + 1] && samePairPadding) {
                messages.push(`同一文字ペア "${processed[i]}${processed[i]}" を検出しました。間に補完文字 "${paddingChar}" を挿入しました。`);
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

    animateEncryption(pairs, encryptedPairs) {
        const matrixId = 'encryption-matrix';
        this.animateTransformation(pairs, encryptedPairs, matrixId);
    }

    animateDecryption(pairs, decryptedPairs) {
        const matrixId = 'decryption-matrix';
        this.animateTransformation(pairs, decryptedPairs, matrixId);
    }

    animateTransformation(pairs, transformedPairs, matrixId) {
        this.animationQueue = [];
        
        pairs.forEach((pair, index) => {
            this.animationQueue.push(() => {
                return this.animatePair(pair, transformedPairs[index], matrixId);
            });
        });
        
        this.processAnimationQueue();
    }

    async animatePair(originalPair, transformedPair, matrixId) {
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
        
        await this.delay(500);
        
        if (newPos1 && newPos2) {
            const newCell1 = matrix.querySelector(`[data-row="${newPos1.row}"][data-col="${newPos1.col}"]`);
            const newCell2 = matrix.querySelector(`[data-row="${newPos2.row}"][data-col="${newPos2.col}"]`);
            
            if (newCell1) newCell1.classList.add('highlight-target');
            if (newCell2) newCell2.classList.add('highlight-target');
        }
        
        await this.delay(500);
    }

    async processAnimationQueue() {
        if (this.isAnimating || this.animationQueue.length === 0) return;
        
        this.isAnimating = true;
        
        while (this.animationQueue.length > 0) {
            const animation = this.animationQueue.shift();
            await animation();
        }
        
        this.isAnimating = false;
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
}