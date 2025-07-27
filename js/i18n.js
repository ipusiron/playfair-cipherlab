class I18nManager {
    constructor() {
        this.currentLang = this.loadLanguage();
        this.translations = {
            ja: {
                // Header
                'header.title': 'Playfair CipherLab',
                'header.subtitle': 'ビジュアルで学ぶプレイフェア暗号ツール',
                
                // Progress
                'progress.title': '📊 学習進捗',
                'progress.total-points': '総ポイント',
                'progress.completed-challenges': 'クリア課題数',
                'progress.unlocked-levels': '解放レベル',
                'progress.reset': '🔄 進捗をリセット',
                'progress.tooltip.points': '復号タブの解読チャレンジをクリアするとポイントが獲得できます',
                'progress.tooltip.challenges': '復号タブの解読チャレンジを正解するとカウントされます',
                'progress.tooltip.levels': 'レベル内の全チャレンジをクリアすると次レベルが解放されます',
                
                // Tabs
                'tab.key-generation': '🔑 鍵生成',
                'tab.encryption': '🔐 暗号化',
                'tab.decryption': '🔓 復号',
                
                // Key Generation
                'key.title': '鍵マトリクスの生成',
                'key.edit': '編集',
                'key.mode.keyword': 'キーワード指定',
                'key.mode.matrix': 'マトリクス指定',
                'key.keyword.label': 'キーワード/キーフレーズ:',
                'key.keyword.placeholder': '例: PLAYFAIR EXAMPLE',
                'key.keyword.preview': '生成されるマトリクス:',
                'key.matrix.label': 'マトリクス（5行×5文字）:',
                'key.matrix.placeholder': '5行×5文字で入力',
                'key.save': '保存',
                'key.cancel': 'キャンセル',
                
                // Encryption
                'encrypt.title': '暗号化',
                'encrypt.examples': '例文から選択',
                'encrypt.examples.title': '例文から選択',
                'encrypt.select-category': 'カテゴリを選択...',
                'encrypt.select-example': '例文を選択...',
                'encrypt.load': '読み込み',
                'encrypt.plaintext': '平文入力:',
                'encrypt.plaintext.placeholder': '暗号化したいテキストを入力',
                'encrypt.same-pair-mode': '同一ペア処理モード',
                'encrypt.padding-char': '補完文字:',
                'encrypt.padding-char.insert': '補完文字を挿入',
                'encrypt.special-rule': '特別ルール選択',
                'encrypt.special-rule.label': '特別ルール選択',
                'encrypt.rule.no-change': '変化なし（同じ文字のまま）',
                'encrypt.rule.right-shift': '右隣の文字に置換（標準）',
                'encrypt.rule.bottom-right': '1つ右、1つ下の位置に移動',
                'encrypt.button': '暗号化',
                'encrypt.process': '処理過程',
                'encrypt.before-pairs': '変換前（2文字ペア）:',
                'encrypt.after-pairs': '変換後（2文字ペア）:',
                'encrypt.ciphertext': '暗号文',
                'encrypt.copy': 'コピー',
                'encrypt.restart': '🔄 最初から再生',
                
                // Decryption
                'decrypt.title': '復号',
                'decrypt.practices': '練習・課題から選択',
                'decrypt.practices.title': '練習・課題から選択',
                'decrypt.select-type': 'タイプを選択...',
                'decrypt.type.practice': '復号練習',
                'decrypt.type.challenge': '解読チャレンジ',
                'decrypt.select-task': '課題を選択...',
                'decrypt.ciphertext': '暗号文入力:',
                'decrypt.ciphertext.placeholder': '復号したい暗号文を入力',
                'decrypt.same-pair-rule': '同一ペア処理ルール',
                'decrypt.same-pair-rule.label': '同一ペア処理ルール',
                'decrypt.rule.left-restore': '右隣の文字から復元（左の文字に変換・標準）',
                'decrypt.rule.top-left-restore': '1つ右、1つ下の位置から復元（1つ左、1つ上に変換）',
                'decrypt.button': '復号',
                'decrypt.process': '処理過程',
                'decrypt.result': '復号結果',
                'decrypt.challenge-answer': '解読チャレンジ解答',
                'decrypt.answer-input': '復号した平文を入力してください:',
                'decrypt.answer.placeholder': '例: HELLO, ATTACK AT DAWN',
                'decrypt.check-answer': '解答をチェック',
                'decrypt.hint': 'ヒントを見る',
                'decrypt.hint-next': '次のヒントを見る',
                'decrypt.hint-complete': 'ヒント完了',
                
                // Animation Controls
                'anim.prev': '◀ 前',
                'anim.play': '▶ 再生',
                'anim.pause': '⏸ 停止',
                'anim.next': '次 ▶',
                
                // Categories and Examples
                'category.basic': '基本単語',
                'category.phrases': '定型文',
                'category.historical': '歴史的文書',
                'category.基本単語': '基本単語',
                'category.定型文': '定型文',
                'category.歴史的文書': '歴史的文書',
                'category.基本復号': '基本復号',
                'category.キーワード復号': 'キーワード復号',
                
                // Exercise Loading Messages
                'exercise.loaded.example': '例文「{title}」を読み込みました',
                'exercise.loaded.practice': '練習問題「{title}」を読み込みました',
                'exercise.loaded.challenge': 'チャレンジ「{title}」を読み込みました',
                'exercise.loaded.challenge.keyword': 'チャレンジ「{title}」を読み込みました。鍵を推測してください。',
                
                // Dropdown Options
                'dropdown.select-category': 'カテゴリを選択...',
                'dropdown.select-example': '例文を選択...',
                'dropdown.select-type': 'タイプを選択...',
                'dropdown.select-task': '課題を選択...',
                'dropdown.decryption-practice': '復号練習',
                'dropdown.decryption-challenge': '解読チャレンジ',
                
                // Progress Summary
                'progress.summary': '総ポイント: {points} | クリア課題: {challenges} | レベル: {level}/3',
                
                // Same Pair Rules
                'rule.no-change': '変化なし（同じ文字のまま）',
                'rule.right-shift': '右隣の文字に置換（標準）',
                'rule.bottom-right': '1つ右、1つ下の位置に移動',
                'rule.left-restore': '右隣の文字から復元（左の文字に変換・標準）',
                'rule.top-left-restore': '1つ右、1つ下の位置から復元（1つ左、1つ上に変換）',
                
                // Process and Results
                'process.title': '処理過程',
                'process.before': '変換前（2文字ペア）:',
                'process.after': '変換後（2文字ペア）:',
                'result.ciphertext': '暗号文',
                'result.plaintext': '復号結果',
                'challenge.answer.title': '解読チャレンジ解答',
                
                // Example and Challenge Titles
                'example.挨拶': '挨拶',
                'example.秘密': '秘密',
                'example.暗号': '暗号',
                'example.夜明けの攻撃': '夜明けの攻撃',
                'example.秘密の待ち合わせ': '秘密の待ち合わせ',
                'example.即座に撤退': '即座に撤退',
                'example.有名なパングラム': '有名なパングラム',
                'example.外交暗号': '外交暗号',
                'example.基本の暗号化': '基本の暗号化',
                'example.短い文の暗号化': '短い文の暗号化',
                'example.キーワード暗号': 'キーワード暗号',
                'example.長文暗号化': '長文暗号化',
                'example.複雑な暗号化': '複雑な暗号化',
                'example.挨拶の復号': '挨拶の復号',
                'example.短い単語': '短い単語',
                'example.動物の名前': '動物の名前',
                'example.謎の単語': '謎の単語',
                'example.秘密のメッセージ': '秘密のメッセージ',
                'example.軍事作戦': '軍事作戦',
                
                // Footer
                'footer.github': 'GitHubリポジトリはこちら',
                'footer.link': 'ipusiron/playfair-cipherlab',
                
                // Messages
                'message.copied': 'コピーしました！',
                'message.reset-confirm': '学習進捗をリセットしますか？\nこの操作は取り消せません。',
                'message.reset-success': '学習進捗をリセットしました',
                'message.correct': '正解です！',
                'message.incorrect': '答えが違います。もう一度確認してください。',
                'message.enter-answer': '解答を入力してください。',
                'message.padding-chars': '復号結果に x, q, z が含まれています。これらは補完文字の可能性があります。',
                'message.i-or-j': '復号結果の "i" は元のテキストでは "j" だった可能性があります。',
                
                // Challenge Info
                'challenge.hint-label': 'ヒント: ',
                'challenge.points-label': '獲得ポイント: ',
                'challenge.points-unit': 'pt',
                
                // Challenge Descriptions
                'challenge.mystery-01.description': '基本的な復号チャレンジ',
                'challenge.mystery-02.description': '中級レベルの暗号解読',
                'challenge.mystery-03.description': '上級者向けチャレンジ',
                
                // Challenge Hints
                'challenge.mystery-01.hint.0': '3文字以下の短い単語ではありません',
                'challenge.mystery-01.hint.1': '挨拶に使われる言葉です',
                'challenge.mystery-01.hint.2': 'デフォルトの鍵が使われています',
                'challenge.mystery-01.hint.3': '5文字の基本的な英単語です',
                
                'challenge.mystery-02.hint.0': '鍵マトリクスは「秘密」という意味の英単語をキーワードに生成しています',
                'challenge.mystery-02.hint.1': '待ち合わせに関する文章',
                'challenge.mystery-02.hint.2': '3つの単語で構成されています',
                'challenge.mystery-02.hint.3': '適切なスペースで単語を区切って入力してください',
                
                'challenge.mystery-03.hint.0': '軍事関連のキーワードです',
                'challenge.mystery-03.hint.1': '第二次大戦に関連するキーワードです',
                'challenge.mystery-03.hint.2': 'キーワードは8文字です',
                'challenge.mystery-03.hint.3': 'キーワード: MILITARY',
                
                // Help Modal
                'help.title': 'Playfair CipherLab ヘルプ',
                'help.progress.title': '📊 学習進捗',
                'help.progress.desc': 'タブの上にあるアコーディオン式の進捗パネルで学習状況を確認できます。',
                'help.progress.points': '<strong>総ポイント</strong>：復号タブの解読チャレンジをクリアすると獲得',
                'help.progress.challenges': '<strong>クリア課題数</strong>：正解した解読チャレンジの数',
                'help.progress.levels': '<strong>解放レベル</strong>：レベル内の全チャレンジクリアで次レベル解放',
                'help.progress.reset': '<strong>進捗リセット</strong>：確認ダイアログ付きで全進捗をリセット可能',
                'help.key.title': '🔑 鍵生成タブ',
                'help.key.desc': 'プレイフェア暗号で使用する5×5マトリクスを設定します。',
                'help.key.keyword': '<strong>キーワード指定</strong>：英単語からマトリクスを自動生成',
                'help.key.matrix': '<strong>マトリクス指定</strong>：25文字を直接入力して設定',
                'help.key.chars': '<strong>文字制限</strong>：A-Zの25文字（Jは使用不可、Iと統合）',
                'help.key.duplicate': '<strong>重複チェック</strong>：同じ文字が重複している場合はエラー',
                'help.encrypt.title': '🔐 暗号化タブ',
                'help.encrypt.desc': '平文をプレイフェア暗号で暗号化します。',
                'help.encrypt.examples': '<strong>例文選択</strong>：カテゴリ別の例文を読み込んで学習可能',
                'help.decrypt.title': '🔓 復号タブ',
                'help.decrypt.desc': '暗号文をプレイフェア暗号で復号します。',
                'help.animation.title': '🎬 アニメーション制御',
                'help.animation.desc': '暗号化・復号の過程をステップごとに確認できます。',
                'help.other.title': '🌙 その他の機能',
                'help.tips.title': '🎯 使い方のコツ',
                'help.warning.title': '⚠️ 注意事項',
                'help.warning.desc': '<strong>このツールは教育目的です。</strong>プレイフェア暗号は古典暗号であり、現代の暗号学的用途には適していません。'
            },
            en: {
                // Header
                'header.title': 'Playfair CipherLab',
                'header.subtitle': 'Visual Learning Tool for Playfair Cipher',
                
                // Progress
                'progress.title': '📊 Learning Progress',
                'progress.total-points': 'Total Points',
                'progress.completed-challenges': 'Completed Challenges',
                'progress.unlocked-levels': 'Unlocked Levels',
                'progress.reset': '🔄 Reset Progress',
                'progress.tooltip.points': 'Points are earned by completing decryption challenges',
                'progress.tooltip.challenges': 'Count of correctly solved decryption challenges',
                'progress.tooltip.levels': 'Next level unlocks when all challenges in current level are completed',
                
                // Tabs
                'tab.key-generation': '🔑 Key Generation',
                'tab.encryption': '🔐 Encryption',
                'tab.decryption': '🔓 Decryption',
                
                // Key Generation
                'key.title': 'Key Matrix Generation',
                'key.edit': 'Edit',
                'key.mode.keyword': 'Keyword Mode',
                'key.mode.matrix': 'Matrix Mode',
                'key.keyword.label': 'Keyword/Keyphrase:',
                'key.keyword.placeholder': 'e.g., PLAYFAIR EXAMPLE',
                'key.keyword.preview': 'Generated Matrix:',
                'key.matrix.label': 'Matrix (5×5 characters):',
                'key.matrix.placeholder': 'Enter 5×5 characters',
                'key.save': 'Save',
                'key.cancel': 'Cancel',
                
                // Encryption
                'encrypt.title': 'Encryption',
                'encrypt.examples': 'Select from Examples',
                'encrypt.examples.title': 'Select from Examples',
                'encrypt.select-category': 'Select Category...',
                'encrypt.select-example': 'Select Example...',
                'encrypt.load': 'Load',
                'encrypt.plaintext': 'Plaintext Input:',
                'encrypt.plaintext.placeholder': 'Enter text to encrypt',
                'encrypt.same-pair-mode': 'Same Pair Processing Mode',
                'encrypt.padding-char': 'Padding Character:',
                'encrypt.padding-char.insert': 'Insert Padding Character',
                'encrypt.special-rule': 'Special Rule Selection',
                'encrypt.special-rule.label': 'Special Rule Selection',
                'encrypt.rule.no-change': 'No Change (Keep Same Characters)',
                'encrypt.rule.right-shift': 'Replace with Right Adjacent (Standard)',
                'encrypt.rule.bottom-right': 'Move One Right, One Down',
                'encrypt.button': 'Encrypt',
                'encrypt.process': 'Process Steps',
                'encrypt.before-pairs': 'Before Transform (2-char pairs):',
                'encrypt.after-pairs': 'After Transform (2-char pairs):',
                'encrypt.ciphertext': 'Ciphertext',
                'encrypt.copy': 'Copy',
                'encrypt.restart': '🔄 Restart Animation',
                
                // Decryption
                'decrypt.title': 'Decryption',
                'decrypt.practices': 'Select Practice/Challenge',
                'decrypt.practices.title': 'Select Practice/Challenge',
                'decrypt.select-type': 'Select Type...',
                'decrypt.type.practice': 'Decryption Practice',
                'decrypt.type.challenge': 'Decryption Challenge',
                'decrypt.select-task': 'Select Task...',
                'decrypt.ciphertext': 'Ciphertext Input:',
                'decrypt.ciphertext.placeholder': 'Enter ciphertext to decrypt',
                'decrypt.same-pair-rule': 'Same Pair Processing Rule',
                'decrypt.same-pair-rule.label': 'Same Pair Processing Rule',
                'decrypt.rule.left-restore': 'Restore from Right Adjacent (Convert to Left・Standard)',
                'decrypt.rule.top-left-restore': 'Restore from One Right, One Down (Convert to One Left, One Up)',
                'decrypt.button': 'Decrypt',
                'decrypt.process': 'Process Steps',
                'decrypt.result': 'Decryption Result',
                'decrypt.challenge-answer': 'Challenge Answer',
                'decrypt.answer-input': 'Enter the decrypted plaintext:',
                'decrypt.answer.placeholder': 'e.g., HELLO, ATTACK AT DAWN',
                'decrypt.check-answer': 'Check Answer',
                'decrypt.hint': 'Show Hint',
                'decrypt.hint-next': 'Show Next Hint',
                'decrypt.hint-complete': 'All Hints Shown',
                
                // Animation Controls
                'anim.prev': '◀ Prev',
                'anim.play': '▶ Play',
                'anim.pause': '⏸ Pause',
                'anim.next': 'Next ▶',
                
                // Categories and Examples
                'category.basic': 'Basic Words',
                'category.phrases': 'Common Phrases',
                'category.historical': 'Historical Documents',
                'category.基本単語': 'Basic Words',
                'category.定型文': 'Common Phrases',
                'category.歴史的文書': 'Historical Documents',
                'category.基本復号': 'Basic Decryption',
                'category.キーワード復号': 'Keyword Decryption',
                
                // Exercise Loading Messages
                'exercise.loaded.example': 'Loaded example "{title}"',
                'exercise.loaded.practice': 'Loaded practice "{title}"',
                'exercise.loaded.challenge': 'Loaded challenge "{title}"',
                'exercise.loaded.challenge.keyword': 'Loaded challenge "{title}". Please guess the key.',
                
                // Dropdown Options
                'dropdown.select-category': 'Select Category...',
                'dropdown.select-example': 'Select Example...',
                'dropdown.select-type': 'Select Type...',
                'dropdown.select-task': 'Select Task...',
                'dropdown.decryption-practice': 'Decryption Practice',
                'dropdown.decryption-challenge': 'Decryption Challenge',
                
                // Progress Summary
                'progress.summary': 'Total Points: {points} | Completed: {challenges} | Level: {level}/3',
                
                // Same Pair Rules
                'rule.no-change': 'No Change (Keep Same Characters)',
                'rule.right-shift': 'Replace with Right Adjacent (Standard)',
                'rule.bottom-right': 'Move One Right, One Down',
                'rule.left-restore': 'Restore from Right Adjacent (Convert to Left・Standard)',
                'rule.top-left-restore': 'Restore from One Right, One Down (Convert to One Left, One Up)',
                
                // Process and Results
                'process.title': 'Process Steps',
                'process.before': 'Before Transform (2-char pairs):',
                'process.after': 'After Transform (2-char pairs):',
                'result.ciphertext': 'Ciphertext',
                'result.plaintext': 'Decryption Result',
                'challenge.answer.title': 'Challenge Answer',
                
                // Example and Challenge Titles
                'example.挨拶': 'Greeting',
                'example.秘密': 'Secret',
                'example.暗号': 'Cipher',
                'example.夜明けの攻撃': 'Attack at Dawn',
                'example.秘密の待ち合わせ': 'Secret Meeting',
                'example.即座に撤退': 'Immediate Retreat',
                'example.有名なパングラム': 'Famous Pangram',
                'example.外交暗号': 'Diplomatic Cipher',
                'example.基本の暗号化': 'Basic Encryption',
                'example.短い文の暗号化': 'Short Sentence Encryption',
                'example.キーワード暗号': 'Keyword Cipher',
                'example.長文暗号化': 'Long Text Encryption',
                'example.複雑な暗号化': 'Complex Encryption',
                'example.挨拶の復号': 'Greeting Decryption',
                'example.短い単語': 'Short Word',
                'example.動物の名前': 'Animal Name',
                'example.謎の単語': 'Mystery Word',
                'example.秘密のメッセージ': 'Secret Message',
                'example.軍事作戦': 'Military Operation',
                
                // Footer
                'footer.github': 'GitHub Repository: ',
                'footer.link': 'ipusiron/playfair-cipherlab',
                
                // Messages
                'message.copied': 'Copied!',
                'message.reset-confirm': 'Reset learning progress?\nThis action cannot be undone.',
                'message.reset-success': 'Learning progress has been reset',
                'message.correct': 'Correct!',
                'message.incorrect': 'Incorrect. Please try again.',
                'message.enter-answer': 'Please enter your answer.',
                'message.padding-chars': 'The decryption result contains x, q, z. These may be padding characters.',
                'message.i-or-j': 'The "i" in the decryption result may have been "j" in the original text.',
                
                // Challenge Info
                'challenge.hint-label': 'Hint: ',
                'challenge.points-label': 'Points: ',
                'challenge.points-unit': 'pt',
                
                // Challenge Descriptions
                'challenge.mystery-01.description': 'Basic decryption challenge',
                'challenge.mystery-02.description': 'Intermediate level decryption',
                'challenge.mystery-03.description': 'Advanced challenge',
                
                // Challenge Hints
                'challenge.mystery-01.hint.0': 'Not a short word with 3 letters or less',
                'challenge.mystery-01.hint.1': 'A word used for greeting',
                'challenge.mystery-01.hint.2': 'The default key is used',
                'challenge.mystery-01.hint.3': 'A 5-letter basic English word',
                
                'challenge.mystery-02.hint.0': 'The key matrix is generated with an English word meaning "secret"',
                'challenge.mystery-02.hint.1': 'A sentence about meeting',
                'challenge.mystery-02.hint.2': 'Consists of 3 words',
                'challenge.mystery-02.hint.3': 'Please separate words with appropriate spaces',
                
                'challenge.mystery-03.hint.0': 'Military-related keyword',
                'challenge.mystery-03.hint.1': 'Related to World War II',
                'challenge.mystery-03.hint.2': 'The keyword has 8 letters',
                'challenge.mystery-03.hint.3': 'Keyword: MILITARY',
                
                // Help Modal
                'help.title': 'Playfair CipherLab Help',
                'help.progress.title': '📊 Learning Progress',
                'help.progress.desc': 'You can check your learning status with the accordion-style progress panel above the tabs.',
                'help.progress.points': '<strong>Total Points</strong>: Earned by completing decryption challenges in the decryption tab',
                'help.progress.challenges': '<strong>Completed Challenges</strong>: Number of correctly solved decryption challenges',
                'help.progress.levels': '<strong>Unlocked Levels</strong>: Next level unlocks when all challenges in current level are completed',
                'help.progress.reset': '<strong>Progress Reset</strong>: Reset all progress with confirmation dialog',
                'help.key.title': '🔑 Key Generation Tab',
                'help.key.desc': 'Set up the 5×5 matrix used for Playfair cipher.',
                'help.key.keyword': '<strong>Keyword Mode</strong>: Automatically generate matrix from English words',
                'help.key.matrix': '<strong>Matrix Mode</strong>: Directly input 25 characters',
                'help.key.chars': '<strong>Character Restriction</strong>: 25 characters A-Z (J not used, merged with I)',
                'help.key.duplicate': '<strong>Duplicate Check</strong>: Error if same characters are duplicated',
                'help.encrypt.title': '🔐 Encryption Tab',
                'help.encrypt.desc': 'Encrypt plaintext using Playfair cipher.',
                'help.encrypt.examples': '<strong>Example Selection</strong>: Load examples by category for learning',
                'help.decrypt.title': '🔓 Decryption Tab',
                'help.decrypt.desc': 'Decrypt ciphertext using Playfair cipher.',
                'help.animation.title': '🎬 Animation Controls',
                'help.animation.desc': 'View encryption/decryption process step by step.',
                'help.other.title': '🌙 Other Features',
                'help.tips.title': '🎯 Usage Tips',
                'help.warning.title': '⚠️ Important Notice',
                'help.warning.desc': '<strong>This tool is for educational purposes.</strong> Playfair cipher is a classical cipher and not suitable for modern cryptographic use.'
            }
        };
    }

    loadLanguage() {
        const saved = localStorage.getItem('playfair-language');
        return saved || 'ja';
    }

    saveLanguage(lang) {
        localStorage.setItem('playfair-language', lang);
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.saveLanguage(lang);
        this.updateUI();
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
        // Replace parameters like {title} with actual values
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });
        
        return text;
    }

    updateUI() {
        // Update header
        const titleElement = document.querySelector('header h1');
        const subtitleElement = document.querySelector('header p');
        
        if (titleElement) titleElement.textContent = this.t('header.title');
        if (subtitleElement) subtitleElement.textContent = this.t('header.subtitle');

        // Update language toggle button text (show next language to switch to)
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLang === 'ja' ? 'EN' : 'JA';
        }

        // Update progress section
        this.updateElement('.progress-title', 'progress.title');
        this.updateElement('#total-points + .progress-stat-label', 'progress.total-points');
        this.updateElement('#completed-challenges + .progress-stat-label', 'progress.completed-challenges');
        this.updateElement('#unlocked-levels + .progress-stat-label', 'progress.unlocked-levels');
        this.updateElement('#reset-progress', 'progress.reset');

        // Update tabs
        this.updateTabButton('[data-tab="key-generation"]', 'tab.key-generation');
        this.updateTabButton('[data-tab="encryption"]', 'tab.encryption');
        this.updateTabButton('[data-tab="decryption"]', 'tab.decryption');

        // Update key generation tab
        this.updateElement('#key-generation h2', 'key.title');
        this.updateElement('#edit-matrix-btn', 'key.edit');
        this.updateElement('input[value="keyword"] + span', 'key.mode.keyword');
        this.updateElement('input[value="matrix"] + span', 'key.mode.matrix');
        this.updateElement('label[for="keyword-text"]', 'key.keyword.label');
        this.updateElement('label[for="matrix-text"]', 'key.matrix.label');
        this.updateElement('#save-matrix-btn', 'key.save');
        this.updateElement('#cancel-edit-btn', 'key.cancel');

        // Update encryption tab
        this.updateElement('#encryption h2', 'encrypt.title');
        this.updateElement('#encryption .exercise-section h3', 'encrypt.examples.title');
        this.updateElement('label[for="plaintext"]', 'encrypt.plaintext');
        this.updateElement('label[for="same-pair-mode"]', 'encrypt.same-pair-mode');
        this.updateElement('#encrypt-btn', 'encrypt.button');
        
        // Update encryption mode labels
        this.updateElement('#mode-on-settings .mode-label', 'encrypt.padding-char.insert');
        this.updateElement('#mode-off-settings .mode-label', 'encrypt.special-rule.label');
        this.updateElement('.padding-char-wrapper label', 'encrypt.padding-char');
        
        // Update keyword preview label
        this.updateElement('.keyword-preview label', 'key.keyword.preview');
        
        // Update encryption copy and restart buttons
        this.updateElement('#copy-ciphertext', 'encrypt.copy');
        this.updateElement('#restart-encryption', 'encrypt.restart');

        // Update decryption tab
        this.updateElement('#decryption h2', 'decrypt.title');
        this.updateElement('#decryption .exercise-section h3', 'decrypt.practices.title');
        this.updateElement('label[for="ciphertext-input"]', 'decrypt.ciphertext');
        this.updateElement('#decrypt-btn', 'decrypt.button');
        this.updateElement('#check-answer', 'decrypt.check-answer');
        
        // Update decryption same pair rule label
        this.updateElement('#decryption .settings-section .mode-label', 'decrypt.same-pair-rule.label');
        
        // Update decryption copy and restart buttons
        this.updateElement('#copy-plaintext', 'encrypt.copy');
        this.updateElement('#restart-decryption', 'encrypt.restart');
        
        // Update decryption result labels
        this.updateElement('label[for="challenge-answer"]', 'decrypt.answer-input');

        // Update placeholders
        this.updatePlaceholder('#keyword-text', 'key.keyword.placeholder');
        this.updatePlaceholder('#matrix-text', 'key.matrix.placeholder');
        this.updatePlaceholder('#plaintext', 'encrypt.plaintext.placeholder');
        this.updatePlaceholder('#ciphertext-input', 'decrypt.ciphertext.placeholder');
        this.updatePlaceholder('#challenge-answer', 'decrypt.answer.placeholder');

        // Update tooltips
        this.updateTooltip('[title*="復号タブの解読チャレンジをクリア"], [title*="Points are earned"]', 'progress.tooltip.points');
        this.updateTooltip('[title*="復号タブの解読チャレンジを正解"], [title*="Count of correctly"]', 'progress.tooltip.challenges');
        this.updateTooltip('[title*="レベル内の全チャレンジをクリア"], [title*="Next level unlocks"]', 'progress.tooltip.levels');

        // Update dropdown options
        this.updateDropdownOptions();

        // Update footer
        this.updateFooter();

        // Update animation controls
        this.updateAnimationControls();

        // Update help modal content
        this.updateElement('#help-modal h2', 'help.title');
        this.updateHelpModalContent();

        // Dispatch event for UI components to update
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLang } }));
    }

    updateElement(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = this.t(key);
        }
    }

    updateTabButton(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = this.t(key);
        }
    }

    updatePlaceholder(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            element.placeholder = this.t(key);
        }
    }

    updateTooltip(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            element.title = this.t(key);
        }
    }

    updateDropdownOptions() {
        // Update example category dropdown
        const categorySelect = document.getElementById('example-category');
        if (categorySelect && categorySelect.options.length > 0) {
            categorySelect.options[0].textContent = this.t('dropdown.select-category');
            
            // Update category options
            for (let i = 1; i < categorySelect.options.length; i++) {
                const option = categorySelect.options[i];
                const key = `category.${option.value}`;
                const translated = this.t(key);
                if (translated !== key) {
                    option.textContent = translated;
                }
            }
        }

        // Update example list dropdown
        const exampleSelect = document.getElementById('example-list');
        if (exampleSelect && exampleSelect.options.length > 0) {
            exampleSelect.options[0].textContent = this.t('dropdown.select-example');
        }

        // Update practice type dropdown
        const practiceTypeSelect = document.getElementById('practice-type');
        if (practiceTypeSelect && practiceTypeSelect.options.length > 0) {
            practiceTypeSelect.options[0].textContent = this.t('dropdown.select-type');
            
            // Update practice/challenge options
            for (let i = 1; i < practiceTypeSelect.options.length; i++) {
                const option = practiceTypeSelect.options[i];
                if (option.value === 'practice') {
                    option.textContent = this.t('dropdown.decryption-practice');
                } else if (option.value === 'challenge') {
                    option.textContent = this.t('dropdown.decryption-challenge');
                }
            }
        }

        // Update practice list dropdown
        const practiceSelect = document.getElementById('practice-list');
        if (practiceSelect && practiceSelect.options.length > 0) {
            practiceSelect.options[0].textContent = this.t('dropdown.select-task');
        }

        // Update load buttons
        this.updateElement('#load-example', 'encrypt.load');
        this.updateElement('#load-practice', 'encrypt.load');

        // Update same pair rule labels
        this.updateSamePairRules();

        // Update example titles in dropdowns
        this.updateExampleTitles();
    }

    updateFooter() {
        const footerElement = document.querySelector('footer .footer');
        if (footerElement) {
            const isJapanese = this.currentLang === 'ja';
            const openParen = isJapanese ? '（' : '(';
            const closeParen = isJapanese ? '）' : ')';
            footerElement.innerHTML = `🔗 ${this.t('footer.github')}${openParen}<a href="https://github.com/ipusiron/playfair-cipherlab" target="_blank">${this.t('footer.link')}</a>${closeParen}`;
        }
    }

    updateExampleTitles() {
        // Update example list dropdown options
        const exampleSelect = document.getElementById('example-list');
        if (exampleSelect) {
            for (let i = 1; i < exampleSelect.options.length; i++) {
                const option = exampleSelect.options[i];
                const originalTitle = option.textContent;
                const translatedTitle = this.translateExampleTitle(originalTitle);
                if (translatedTitle) {
                    option.textContent = translatedTitle;
                }
            }
        }

        // Update practice list dropdown options
        const practiceSelect = document.getElementById('practice-list');
        if (practiceSelect) {
            for (let i = 1; i < practiceSelect.options.length; i++) {
                const option = practiceSelect.options[i];
                const originalTitle = option.textContent;
                const translatedTitle = this.translateExampleTitle(originalTitle);
                if (translatedTitle) {
                    option.textContent = translatedTitle;
                }
            }
        }
    }

    translateExampleTitle(title) {
        // Remove completed mark if present
        const cleanTitle = title.replace(/^✓\s*/, '');
        
        const key = `example.${cleanTitle}`;
        const translated = this.t(key);
        
        // If translation exists and is different from the key (i.e., a translation was found)
        if (translated !== key) {
            return title.startsWith('✓') ? `✓ ${translated}` : translated;
        }
        return null;
    }

    updateAnimationControls() {
        // Update encryption animation controls
        this.updateElement('#prev-step-encryption', 'anim.prev');
        this.updateElement('#next-step-encryption', 'anim.next');
        
        // Update decryption animation controls  
        this.updateElement('#prev-step-decryption', 'anim.prev');
        this.updateElement('#next-step-decryption', 'anim.next');
        
        // Update play/pause buttons with default state (play)
        this.updateElement('#play-pause-encryption', 'anim.play');
        this.updateElement('#play-pause-decryption', 'anim.play');
        
        // Update process section headers
        this.updateElement('#encryption-process h3', 'encrypt.process');
        this.updateElement('#decryption-process h3', 'decrypt.process');
        
        // Update result section headers
        this.updateElement('#ciphertext-section h3', 'encrypt.ciphertext');
        this.updateElement('#plaintext-section h3', 'decrypt.result');
        this.updateElement('#answer-check h4', 'decrypt.challenge-answer');
        
        // Update process step labels (these are updated via their parent labels)
        this.updateProcessLabels();
    }

    updateHelpModalContent() {
        const modalBody = document.querySelector('#help-modal .modal-body');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <section>
                <h3>${this.t('help.progress.title')}</h3>
                <p>${this.t('help.progress.desc')}</p>
                <ul>
                    <li>${this.t('help.progress.points')}</li>
                    <li>${this.t('help.progress.challenges')}</li>
                    <li>${this.t('help.progress.levels')}</li>
                    <li>${this.t('help.progress.reset')}</li>
                </ul>
            </section>

            <section>
                <h3>${this.t('help.key.title')}</h3>
                <p>${this.t('help.key.desc')}</p>
                <ul>
                    <li>${this.t('help.key.keyword')}</li>
                    <li>${this.t('help.key.matrix')}</li>
                    <li>${this.t('help.key.chars')}</li>
                    <li>${this.t('help.key.duplicate')}</li>
                </ul>
            </section>

            <section>
                <h3>${this.t('help.encrypt.title')}</h3>
                <p>${this.t('help.encrypt.desc')}</p>
                <ul>
                    <li>${this.t('help.encrypt.examples')}</li>
                </ul>
            </section>

            <section>
                <h3>${this.t('help.decrypt.title')}</h3>
                <p>${this.t('help.decrypt.desc')}</p>
            </section>

            <section>
                <h3>${this.t('help.animation.title')}</h3>
                <p>${this.t('help.animation.desc')}</p>
            </section>

            <section>
                <h3>${this.t('help.other.title')}</h3>
            </section>

            <section>
                <h3>${this.t('help.tips.title')}</h3>
            </section>

            <section>
                <h3>${this.t('help.warning.title')}</h3>
                <p>${this.t('help.warning.desc')}</p>
            </section>
        `;
    }

    updateProcessLabels() {
        // Update encryption process labels
        const encryptionLabels = document.querySelectorAll('#encryption-process .state-container label');
        if (encryptionLabels.length >= 2) {
            encryptionLabels[0].textContent = this.t('encrypt.before-pairs');
            encryptionLabels[1].textContent = this.t('encrypt.after-pairs');
        }
        
        // Update decryption process labels
        const decryptionLabels = document.querySelectorAll('#decryption-process .state-container label');
        if (decryptionLabels.length >= 2) {
            decryptionLabels[0].textContent = this.t('encrypt.before-pairs');
            decryptionLabels[1].textContent = this.t('encrypt.after-pairs');
        }
    }

    updateSamePairRules() {
        // Update encryption same pair rules
        const encryptRules = document.querySelectorAll('input[name="same-pair-rule"]');
        encryptRules.forEach(input => {
            const label = input.parentElement;
            if (label && label.tagName === 'LABEL') {
                const checked = input.checked;
                if (input.value === 'no-change') {
                    label.innerHTML = `<input type="radio" name="same-pair-rule" value="no-change"${checked ? ' checked' : ''}>${this.t('rule.no-change')}`;
                } else if (input.value === 'right-shift') {
                    label.innerHTML = `<input type="radio" name="same-pair-rule" value="right-shift"${checked ? ' checked' : ''}>${this.t('rule.right-shift')}`;
                } else if (input.value === 'bottom-right') {
                    label.innerHTML = `<input type="radio" name="same-pair-rule" value="bottom-right"${checked ? ' checked' : ''}>${this.t('rule.bottom-right')}`;
                }
            }
        });
        
        // Update decryption same pair rules
        const decryptRules = document.querySelectorAll('input[name="decrypt-same-pair-rule"]');
        decryptRules.forEach(input => {
            const label = input.parentElement;
            if (input.value === 'no-change') {
                label.innerHTML = `<input type="radio" name="decrypt-same-pair-rule" value="no-change"${input.checked ? ' checked' : ''}><span>${this.t('rule.no-change')}</span>`;
            } else if (input.value === 'right-shift') {
                label.innerHTML = `<input type="radio" name="decrypt-same-pair-rule" value="right-shift"${input.checked ? ' checked' : ''}><span>${this.t('rule.left-restore')}</span>`;
            } else if (input.value === 'bottom-right') {
                label.innerHTML = `<input type="radio" name="decrypt-same-pair-rule" value="bottom-right"${input.checked ? ' checked' : ''}><span>${this.t('rule.top-left-restore')}</span>`;
            }
        });
    }

    init() {
        // Set initial language button text (show next language to switch to)
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLang === 'ja' ? 'EN' : 'JA';
        }

        // Add language toggle button event
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = this.currentLang === 'ja' ? 'en' : 'ja';
                this.setLanguage(newLang);
            });
        }

        // Initial UI update
        this.updateUI();
    }
}

// Global instance
const i18n = new I18nManager();