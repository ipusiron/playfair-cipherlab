class I18nManager {
    constructor() {
        this.currentLang = this.loadLanguage();
        this.translations = {
            ja: {
                "mission.label": "{id}{separator}{title}",
                "mission.group.key": "鍵表",
                "mission.group.encryption": "暗号化",
                "mission.group.decryption": "復号",
                "mission.group.challenge": "解読チャレンジ",
                "mission.state.done": "達成",
                "mission.state.next": "次はこれ",
                "mission.state.open": "未",
                "mission.state.locked": "ロック",
                "mission.star": "ヒントなしで正解",
                "mission.unlock": "{title}をクリアすると開きます",
                "mission.challenge": "挑戦する",
                "roadmap.summary": "達成{done}/{total}・{points}/{maxPoints}pt",
                "roadmap.next": "次: {title}",
                "roadmap.complete": "すべて達成しました",
                "roadmap.explore": "変種のルールで同じ文を暗号化して、結果を比べてみましょう",
                "guide.start": "ナビ開始",
                "guide.again": "もう一度",
                "guide.short": "ナビ",
                "guide.title": "ナビ: {title}（{n}/{N}）",
                "guide.go": "この場所へ移動",
                "guide.close": "閉じる",
                "guide.next": "次のミッションへ",
                "guide.complete": "達成しました",
                "guide.advanced": "手順{n}に進みました",
                "guide.previous": "前の手順を先に済ませてください",
                "guide.restart": "『🔄 最初から再生』を押してから、『次』で1組ずつ進めてください",
                "guide.disabled": "このボタンはいまは押せません。手順の文を確かめてください",
                "guide.m3.remaining": "まだ見ていない規則: {rules}",
                "guide.m3.missing": "この文には{rules}の組がありません。例文『既知の例』→『Wikipediaの例』なら3つともそろいます",
                "rule.name.row": "同じ行",
                "rule.name.column": "同じ列",
                "rule.name.rectangle": "長方形",
                "guide.state.done": "済み",
                "guide.state.current": "いまここ",
                "guide.state.todo": "これから",
                "matrix.required-default": "必要な鍵表: 鍵語なし（既定の表）",
                "matrix.required-hint": "必要な鍵表: 鍵語はヒントから推理",
                "matrix.practice": "鍵語: {keyword}（練習なので教えます）",
                "matrix.current": "いまの鍵表",
                "matrix.default": "既定（鍵語なし）",
                "matrix.keyword": "鍵語{keyword}から作成",
                "matrix.matrix": "直接入力",
                "matrix.status": "鍵表: {description}",
                "matrix.current-line": "いまの鍵表: {description}",
                "matrix.match": "一致",
                "matrix.mismatch": "不一致",
                "matrix.reset": "既定の表に戻す",
                "mission.M1.title": "鍵語から鍵表を作る",
                "mission.M1.learn": "鍵語の文字を重複なしで並べ、残りのアルファベットで埋める。IとJは同じマス",
                "mission.M1.step.1": "鍵生成タブで「編集」を押す",
                "mission.M1.step.2": "鍵語にPLAYFAIR EXAMPLEと入力し、プレビューで鍵語の文字が色分けされるのを見る",
                "mission.M1.step.3": "「保存」を押す",
                "mission.M2.title": "埋め文字が入るところを見る",
                "mission.M2.learn": "組の2文字が同じならXを挟む（HELLO → HE LX LO）",
                "mission.M2.step.1": "鍵生成タブで「既定の表に戻す」を押す",
                "mission.M2.step.2": "暗号化タブの平文にHELLOと入力する（同一ペア処理モードはONのまま）",
                "mission.M2.step.3": "「暗号化」を押し、前処理のXの印を見る",
                "mission.M3.title": "3つの規則を再生で見る",
                "mission.M3.learn": "同じ行は右へ、同じ列は下へ、長方形は相手の列の文字へ",
                "mission.M3.step.1": "暗号化タブで例文「既知の例」→「Wikipediaの例」を読み込む（ほかの文でもよい）",
                "mission.M3.step.2": "「暗号化」を押す",
                "mission.M3.step.3": "「次」か「再生」で組を1つずつ進め、同じ行・同じ列・長方形の3つを見る（「最後まで」で飛ばすと数えない）",
                "mission.M4.title": "組の境目の同じ文字",
                "mission.M4.learn": "境目にまたがるEEにはXを挟まない（ME ET ME …）",
                "mission.M4.step.1": "鍵生成タブで「既定の表に戻す」を押す",
                "mission.M4.step.2": "平文にMEET ME TONIGHTと入力する",
                "mission.M4.step.3": "「暗号化」を押し、EEの間にXが入っていないことを見る",
                "mission.M5.title": "埋め文字の候補を見分ける",
                "mission.M5.learn": "復号結果のXは候補。本物のXと区別できないことがある",
                "mission.M5.step.1": "鍵生成タブで「既定の表に戻す」を押す",
                "mission.M5.step.2": "復号タブで「復号練習」→「挨拶の復号」を読み込む",
                "mission.M5.step.3": "「復号」を押し、候補の印と「候補を除いた文」を見る",
                "mission.M6.title": "鍵語を自分で設定して復号する",
                "mission.M6.learn": "復号には、暗号化と同じ鍵表が要る",
                "mission.M6.step.1": "鍵生成タブで「編集」を押す",
                "mission.M6.step.2": "鍵語にANIMALと入力して「保存」を押す",
                "mission.M6.step.3": "復号タブで「復号練習」→「動物の名前」を読み込む",
                "mission.M6.step.4": "「復号」を押す",
                "mission.C1.title": "謎の単語",
                "mission.C1.learn": "鍵語なしで解読する",
                "mission.C1.step.1": "鍵表を用意する（C1は既定の表。C2・C3はヒントから鍵語を推理して保存）",
                "mission.C1.step.2": "「挑戦する」で課題を読み込む",
                "mission.C1.step.3": "「復号」を押す",
                "mission.C1.step.4": "解答欄に答えを入れて「解答をチェック」を押す",
                "mission.C2.title": "秘密のメッセージ",
                "mission.C2.learn": "鍵語をヒントから推理して解読する",
                "mission.C2.step.1": "鍵表を用意する（C1は既定の表。C2・C3はヒントから鍵語を推理して保存）",
                "mission.C2.step.2": "「挑戦する」で課題を読み込む",
                "mission.C2.step.3": "「復号」を押す",
                "mission.C2.step.4": "解答欄に答えを入れて「解答をチェック」を押す",
                "mission.C3.title": "軍事作戦",
                "mission.C3.learn": "鍵語をヒントから推理して解読する",
                "mission.C3.step.1": "鍵表を用意する（C1は既定の表。C2・C3はヒントから鍵語を推理して保存）",
                "mission.C3.step.2": "「挑戦する」で課題を読み込む",
                "mission.C3.step.3": "「復号」を押す",
                "mission.C3.step.4": "解答欄に答えを入れて「解答をチェック」を押す",
                'tabs.label': '機能',
                'help.close': '閉じる',
                'help.open': 'ヘルプを表示',
                'theme.toggle': '配色を切り替え',
                'language.toggle': '言語を切り替え',
                'select.example-category': '例文の種類',
                'select.example-list': '例文',
                'select.practice-type': '練習またはチャレンジ',
                'select.practice-list': '課題',
                'level.label': 'レベル{level}',
                'level.locked': ' [ロック]',
                'hint.complete': '完了',
                'points.earned': '{points}ポイント獲得しました',
                'error.input-empty': 'テキストを入力してください。',
                'error.input-chars': '許可されていない文字が含まれています: {chars}。英字のみ入力してください。',
                'warning.input-chars': '次の文字は無視されます: {chars}',
                'message.copy-failed': 'コピーできませんでした。表示された文字列を選択してコピーしてください。',
                'decrypt-rule.standard': '標準のプレイフェア',
                'decrypt-rule.no-change': '変種: 同じ文字のまま',
                'decrypt-rule.right-shift': '変種: 左隣の文字へ戻す',
                'decrypt-rule.bottom-right': '変種: 左上の文字へ戻す',
                'footer.prefix': '🔗 GitHubリポジトリー（',
                'footer.suffix': '）',
                'help.body': `
<section>
<h3>鍵表と標準の規則</h3>
<p>鍵語から5×5の表を作ります。英字を大文字にし、JはIと同じ文字として扱います。</p>
<p>平文を左から2文字ずつ組にします。同じ文字の組には埋め文字を挟み、末尾が1文字なら埋め文字を足します。</p>
<p>埋め文字はX、Q、Zから選べます。元の文字が埋め文字と同じなら、Xの代わりにQ、それ以外の代わりにXを使います。</p>
<p>同じ行は右へ1つ、同じ列は下へ1つずらします。端では反対側へ戻ります。長方形は同じ行の相手の列の文字です。復号は左へ、上へずらします。</p>
</section>
<section><h3>変種</h3>
<p>同じ文字の組を分割しない設定は標準ではありません。変化なし、右隣、右下の3つの変種を選べます。復号にも同じ変種を指定してください。</p>
</section>
<section><h3>再生と埋め文字の候補</h3>
<p>前、再生、一時停止、次、🔄 最初から再生、最後までで組ごとの変換を確認できます。下線は追加した埋め文字です。</p>
<p>復号の点線下線は埋め文字の候補です。候補を除いた文も並べますが、復号結果から自動では消しません。</p>
<p>THE QUICK BROWN FOXの最後のXは本物ですが候補になります。候補を除くとTHEQUICKBROWNFOになり、元の文を失います。</p>
</section>
<section><h3>練習とチャレンジ</h3>
<p>チャレンジでは、いまの鍵表が課題の鍵表と一致する必要があります。鍵を設定してから課題を読み込み、復号します。解答の空白と大文字、小文字は問いません。</p>
<p>mystery-01は既定の表、mystery-02はSECRET、mystery-03はMILITARYを使います。得点は順に10、20、30で、正解時に1回だけ加算します。</p>
<p>HELLOの復号はHELXLOです。HELLOもHELXLOも正解ですが、HELLOXは不正解です。</p>
</section>
<section><h3>学習進捗とナビ</h3>
<p>9個のミッションを画面の操作で達成します。「次はこれ」はおすすめ順で、M1〜M6は自由に進められます。</p>
<ul>
<li>M1：鍵語から鍵表を作る。鍵語の文字を重複なしで並べ、残りのアルファベットで埋める。IとJは同じマス</li>
<li>M2：埋め文字が入るところを見る。組の2文字が同じならXを挟む（HELLO → HE LX LO）</li>
<li>M3：3つの規則を再生で見る。同じ行は右へ、同じ列は下へ、長方形は相手の列の文字へ</li>
<li>M4：組の境目の同じ文字。境目にまたがるEEにはXを挟まない（ME ET ME …）</li>
<li>M5：埋め文字の候補を見分ける。復号結果のXは候補。本物のXと区別できないことがある</li>
<li>M6：鍵語を自分で設定して復号する。復号には、暗号化と同じ鍵表が要る</li>
<li>C1：謎の単語。鍵語なしで解読する</li>
<li>C2：秘密のメッセージ。鍵語をヒントから推理して解読する</li>
<li>C3：軍事作戦。鍵語をヒントから推理して解読する</li>
</ul>
<p>C1、C2、C3は順に10、20、30点で計60点です。C1を達成するとC2、C2を達成するとC3が開きます。得点は各課題の初回正解だけです。</p>
<p>帯や各行の「ナビ開始」で下のカードを開きます。手順は操作に合わせて自動で済みになります。あとの手順を済ませた場合、前の手順も済みになります。</p>
<p>「この場所へ移動」はタブを開いて対象を枠で示し、フォーカスを移します。答え、鍵語、平文は入力しません。ナビによる減点はありません。</p>
<p>「次」か「再生」で見た暗号化の規則だけをM3に数えます。「最後まで」や動きを減らす設定で飛ばした組は数えません。</p>
<p>解読ヒントも減点しません。ヒントを見ずに初回正解した課題には★が付きます。旧版から移した進捗には★を付けません。</p>
<p>復号練習は鍵語を表示しますが、鍵表は変更しません。自分で鍵生成タブへ移って設定します。チャレンジの鍵語はヒントから推理します。</p>
<p>「挑戦する」で復号タブへ移り、課題の情報と解答欄を開きます。必要な鍵表と現在の鍵表の一致を確認してください。</p>
<p>「既定の表に戻す」で鍵語なしの表に戻せます。ナビはEscや「閉じる」で閉じ、開いたボタンへ戻ります。</p>
</section>
<section><h3>保存と安全性</h3>
<p>進捗、言語、配色だけを同じブラウザーに保存します。保存を許可しなくても使えます。入力した文章と鍵を外部へ送信しません。</p>
<p>このツールは教育用です。プレイフェア暗号は現代の秘密の保護には使えません。</p>
</section>
`,
                'playback.play': '▶ 再生',
                'playback.pause': '⏸ 一時停止',
                'playback.finish': '最後まで',
                'step.explanation': '{before} → {after}（{rule}）',
                'rule.encryption.row': '同じ行: 右へ1つずらす',
                'rule.encryption.column': '同じ列: 下へ1つずらす',
                'rule.encryption.rectangle': '長方形: 同じ行の、相手の列の文字',
                'rule.decryption.row': '同じ行: 左へ1つずらす',
                'rule.decryption.column': '同じ列: 上へ1つずらす',
                'rule.decryption.rectangle': '長方形: 同じ行の、相手の列の文字',
                'rule.variant.no-change': '変種: 同じ文字のまま',
                'rule.variant.right-shift': '変種: 右隣への置換を適用または復元',
                'rule.variant.bottom-right': '変種: 右下への置換を適用または復元',
                'padding.inserted-legend': '下線は挟んだ、または末尾に足した埋め文字です。',
                'padding.candidate-legend': '点線の下線は埋め文字の候補です。本物の文字の場合もあるため、自動では消しません。',
                'padding.stripped': '候補を除いた文',
                'category.phrase': '定型文',
                'category.known': '既知の例',
                'category.practice': '復号練習',
                'example.basic-01': '挨拶',
                'example.basic-02': '秘密',
                'example.basic-03': '暗号',
                'example.phrase-01': '夜明けの攻撃',
                'example.phrase-02': '秘密の待ち合わせ',
                'example.phrase-03': '即座に撤退',
                'example.historical-01': '末尾の本物のX',
                'example.historical-02': 'Wikipediaの例',
                'example.decrypt-01': '挨拶の復号',
                'example.decrypt-02': '短い単語',
                'example.decrypt-03': '動物の名前',
                'example.mystery-01': '謎の単語',
                'example.mystery-02': '秘密のメッセージ',
                'example.mystery-03': '軍事作戦',
                'exercise.basic-01.description': '同じ文字が並ぶLLに埋め文字が入る',
                'exercise.basic-02.description': '埋め文字が入らない例',
                'exercise.basic-03.description': '基本の単語',
                'exercise.phrase-01.description': '暗号の教科書で定番の例文',
                'exercise.phrase-02.description': 'EEが組の境目にあり、埋め文字は入らない',
                'exercise.phrase-03.description': 'MMに埋め文字が入り、末尾も埋まる',
                'exercise.historical-01.description': '末尾のXは本物だが、復号すると埋め文字の候補に見える例',
                'exercise.historical-02.description': 'Wikipediaの例。暗号文BMODZBXDNABEKUDMUIXMMOUVIFになる',
                'exercise.decrypt-01.description': '最も基本的な復号練習',
                'exercise.decrypt-02.description': '6文字の単語を復号',
                'exercise.decrypt-03.description': 'キーワードを使った復号',
                'exercise.decrypt-01.hint': '既定の表を使用。LLの間のXは埋め文字です',
                'exercise.decrypt-02.hint': '既定の表を使用',
                'exercise.decrypt-03.hint': '鍵語はANIMAL。末尾のXは埋め文字です',
                'exercise.mystery-01.description': '基本的な復号チャレンジ',
                'exercise.mystery-02.description': '中級レベルの暗号解読',
                'exercise.mystery-03.description': '上級レベルの暗号解読',
                'answer.correct': '正解です',
                'answer.wrong-key': '鍵が違います。課題に合う鍵表を設定してください。',
                'answer.incorrect': '不正解です',
                'answer.empty': '解答を入力してください',
                'error.keyword-empty': 'キーワードを入力してください。',
                'error.keyword-chars': '許可されていない文字が含まれています: {chars}。英字と空白のみ入力してください。',
                'error.keyword-letter': '少なくとも1文字の英字を入力してください。',
                'error.matrix-j': 'Jは使用できません。Iに置換されます。',
                'error.matrix-length': '25文字（5×5）で入力してください。',
                'error.matrix-duplicate': '重複する文字があります。',
                'error.odd-length': '暗号文の文字数は偶数にしてください。',
                'error.double-pair': '標準の暗号文に同じ文字の組{pair}は使用できません。',
                // Header
                'header.title': 'Playfair CipherLab',
                'header.subtitle': 'ビジュアルで学ぶプレイフェア暗号ツール',
                
                // Progress
                'progress.title': '📊 学習進捗',
                'progress.reset': '🔄 進捗をリセット',
                
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
                
                // Same Pair Rules
                'rule.no-change': '変種: 変化なし（同じ文字のまま）',
                'rule.right-shift': '変種: 右隣の文字に置換',
                'rule.bottom-right': '変種: 右下の文字に置換',
                'rule.left-restore': '変種: 左隣の文字へ戻す',
                'rule.top-left-restore': '変種: 左上の文字へ戻す',
                
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
                'message.padding-chars': '復号結果にx, q, zが含まれています。これらは補完文字の可能性があります。',
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
                'challenge.mystery-01.hint.0': '挨拶に使われる言葉です',
                'challenge.mystery-01.hint.1': '鍵語は設定しません（既定の表）',
                'challenge.mystery-01.hint.2': '5文字の英単語です',
                'challenge.mystery-01.hint.3': '復号すると埋め文字のXが1つ入っています',
                'challenge.mystery-02.hint.0': '鍵表は『秘密』という意味の英単語から作ります',
                'challenge.mystery-02.hint.1': '待ち合わせに関する文です',
                'challenge.mystery-02.hint.2': '3つの単語でできています',
                'challenge.mystery-02.hint.3': '解答の空白と大文字・小文字は問いません',
                'challenge.mystery-03.hint.0': '鍵表は軍事に関係する英単語から作ります',
                'challenge.mystery-03.hint.1': '鍵語は8文字です',
                'challenge.mystery-03.hint.2': '暗号の教科書で定番の例文です',
                'challenge.mystery-03.hint.3': '時刻に関する単語が入っています',
                
                // Help Modal
                'help.title': 'Playfair CipherLabヘルプ',
                'help.progress.title': '📊 学習進捗',
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
                "mission.label": "{id} {title}",
                "mission.group.key": "Key matrix",
                "mission.group.encryption": "Encryption",
                "mission.group.decryption": "Decryption",
                "mission.group.challenge": "Decryption challenges",
                "mission.state.done": "Done",
                "mission.state.next": "Next",
                "mission.state.open": "Not yet",
                "mission.state.locked": "Locked",
                "mission.star": "Solved without hints",
                "mission.unlock": "Complete {title} to unlock",
                "mission.challenge": "Start challenge",
                "roadmap.summary": "Done {done}/{total} · {points}/{maxPoints}pt",
                "roadmap.next": "Next: {title}",
                "roadmap.complete": "All missions completed",
                "roadmap.explore": "Try encrypting the same text with the variant rules and compare the results.",
                "guide.start": "Start guide",
                "guide.again": "Try again",
                "guide.short": "Guide",
                "guide.title": "Guide: {title} ({n}/{N})",
                "guide.go": "Go to this step",
                "guide.close": "Close",
                "guide.next": "Next mission",
                "guide.complete": "Completed",
                "guide.advanced": "Moved to step {n}",
                "guide.previous": "Complete the previous steps first.",
                "guide.restart": "Press Restart Animation, then use Next to advance one pair at a time.",
                "guide.disabled": "This button is not available now. Check the step instructions.",
                "guide.m3.remaining": "Rules not seen yet: {rules}",
                "guide.m3.missing": "This text has no {rules} pairs. Choose Known Examples → Wikipedia Example to see all three rules.",
                "rule.name.row": "Same row",
                "rule.name.column": "Same column",
                "rule.name.rectangle": "Rectangle",
                "guide.state.done": "Done",
                "guide.state.current": "Current step",
                "guide.state.todo": "To do",
                "matrix.required-default": "Required matrix: no keyword (default matrix)",
                "matrix.required-hint": "Required matrix: infer the keyword from hints",
                "matrix.practice": "Keyword: {keyword} (provided for practice)",
                "matrix.current": "Current matrix",
                "matrix.default": "default (no keyword)",
                "matrix.keyword": "created from keyword {keyword}",
                "matrix.matrix": "entered directly",
                "matrix.status": "Matrix: {description}",
                "matrix.current-line": "Current matrix: {description}",
                "matrix.match": "Match",
                "matrix.mismatch": "Mismatch",
                "matrix.reset": "Restore default matrix",
                "mission.M1.title": "Build a matrix from a keyword",
                "mission.M1.learn": "Remove repeated keyword letters, then fill with the remaining alphabet. I and J share a cell.",
                "mission.M1.step.1": "Press “Edit” on the Key Generation tab.",
                "mission.M1.step.2": "Enter PLAYFAIR EXAMPLE as the keyword and see the keyword letters highlighted in the preview.",
                "mission.M1.step.3": "Press “Save”.",
                "mission.M2.title": "See where padding is inserted",
                "mission.M2.learn": "Insert X between identical letters in a pair (HELLO → HE LX LO).",
                "mission.M2.step.1": "Press “Restore default matrix” on the Key Generation tab.",
                "mission.M2.step.2": "Enter HELLO in the Encryption tab (leave Same Pair Processing Mode ON).",
                "mission.M2.step.3": "Press “Encrypt” and look for the marked X in the prepared pairs.",
                "mission.M3.title": "Play all three rules",
                "mission.M3.learn": "Same row: move right. Same column: move down. Rectangle: use the other letter’s column.",
                "mission.M3.step.1": "On the Encryption tab, load “Known Examples” → “Wikipedia Example” (another text is also fine).",
                "mission.M3.step.2": "Press “Encrypt”.",
                "mission.M3.step.3": "Use “Next” or “Play” pair by pair to see row, column and rectangle rules. “Go to end” skips pairs; they do not count.",
                "mission.M4.title": "Identical letters across pair boundaries",
                "mission.M4.learn": "Do not insert X between EE across pair boundaries (ME ET ME …).",
                "mission.M4.step.1": "Press “Restore default matrix” on the Key Generation tab.",
                "mission.M4.step.2": "Enter MEET ME TONIGHT as the plaintext.",
                "mission.M4.step.3": "Press “Encrypt” and check that no X was inserted between EE.",
                "mission.M5.title": "Identify possible padding",
                "mission.M5.learn": "An X in decrypted text is only a candidate. It may be a genuine X.",
                "mission.M5.step.1": "Press “Restore default matrix” on the Key Generation tab.",
                "mission.M5.step.2": "On the Decryption tab, load “Decryption Practice” → “Decrypt a greeting”.",
                "mission.M5.step.3": "Press “Decrypt” and look at the candidates and “Text without candidates”.",
                "mission.M6.title": "Set the keyword yourself and decrypt",
                "mission.M6.learn": "Decryption needs the same matrix as encryption.",
                "mission.M6.step.1": "Press “Edit” on the Key Generation tab.",
                "mission.M6.step.2": "Enter ANIMAL as the keyword and press “Save”.",
                "mission.M6.step.3": "On the Decryption tab, load “Decryption Practice” → “Animal name”.",
                "mission.M6.step.4": "Press “Decrypt”.",
                "mission.C1.title": "Mystery word",
                "mission.C1.learn": "Decode without a keyword.",
                "mission.C1.step.1": "Prepare the matrix (default for C1; for C2/C3 infer the keyword from hints and save it).",
                "mission.C1.step.2": "Load the challenge with “Start challenge”.",
                "mission.C1.step.3": "Press “Decrypt”.",
                "mission.C1.step.4": "Enter your answer and press “Check Answer”.",
                "mission.C2.title": "Secret message",
                "mission.C2.learn": "Infer the keyword from hints and decode.",
                "mission.C2.step.1": "Prepare the matrix (default for C1; for C2/C3 infer the keyword from hints and save it).",
                "mission.C2.step.2": "Load the challenge with “Start challenge”.",
                "mission.C2.step.3": "Press “Decrypt”.",
                "mission.C2.step.4": "Enter your answer and press “Check Answer”.",
                "mission.C3.title": "Military operation",
                "mission.C3.learn": "Infer the keyword from hints and decode.",
                "mission.C3.step.1": "Prepare the matrix (default for C1; for C2/C3 infer the keyword from hints and save it).",
                "mission.C3.step.2": "Load the challenge with “Start challenge”.",
                "mission.C3.step.3": "Press “Decrypt”.",
                "mission.C3.step.4": "Enter your answer and press “Check Answer”.",
                'tabs.label': 'Features',
                'help.close': 'Close',
                'help.open': 'Open help',
                'theme.toggle': 'Toggle theme',
                'language.toggle': 'Switch language',
                'select.example-category': 'Example category',
                'select.example-list': 'Example',
                'select.practice-type': 'Practice or challenge',
                'select.practice-list': 'Task',
                'level.label': 'Level {level}',
                'level.locked': ' [Locked]',
                'hint.complete': 'Complete',
                'points.earned': '{points} points earned',
                'error.input-empty': 'Enter some text.',
                'error.input-chars': 'Unsupported characters: {chars}. Enter letters only.',
                'warning.input-chars': 'These characters will be ignored: {chars}',
                'message.copy-failed': 'Copy failed. Select and copy the displayed text manually.',
                'decrypt-rule.standard': 'Standard Playfair',
                'decrypt-rule.no-change': 'Variant: leave identical letters unchanged',
                'decrypt-rule.right-shift': 'Variant: restore identical letters from the left',
                'decrypt-rule.bottom-right': 'Variant: restore identical letters from the top left',
                'footer.prefix': '🔗 GitHub repository (',
                'footer.suffix': ')',
                'help.body': `
<section>
<h3>Key matrix and standard rules</h3>
<p>Build a 5 by 5 matrix from a keyword. Letters are uppercase, with J treated as I.</p>
<p>Process plaintext in pairs from left to right. Insert padding only within a pair of identical letters, or append it to a single final letter.</p>
<p>Select X, Q, or Z as padding. If a letter matches the padding, use Q instead of X, or X instead of any other padding.</p>
<p>Shift right in the same row and down in the same column, wrapping at the edge. For a rectangle, keep each row and use the other letter's column.
Decryption shifts left and up.</p>
</section>
<section><h3>Variants</h3>
<p>Not splitting identical-letter pairs is nonstandard. Choose no change, right shift, or bottom-right shift. Use the same variant for decryption.</p>
</section>
<section><h3>Playback and padding candidates</h3>
<p>Use Prev, Play, Pause, Next, Restart Animation, and Go to end to inspect each pair. Underlines mark inserted padding.</p>
<p>Dotted underlines in decrypted text mark possible padding. A separate line excludes these candidates, but the full decryption is never shortened
automatically.</p>
<p>The final X in THE QUICK BROWN FOX is genuine but is marked as a candidate. Removing it gives THEQUICKBROWNFO, losing part of the original message.</p>
</section>
<section><h3>Practice and challenges</h3>
<p>The current matrix must match the challenge matrix. Set the key, load the task, and decrypt. Spaces and letter case do not matter in answers.</p>
<p>mystery-01 uses the default matrix, mystery-02 uses SECRET, and mystery-03 uses MILITARY. They award 10, 20, and 30 points respectively, once each.</p>
<p>HELLO decrypts as HELXLO. Both HELLO and HELXLO are accepted, but HELLOX is incorrect.</p>
</section>
<section><h3>Learning roadmap and guide</h3>
<p>Complete nine missions through screen actions. “Next” recommends an order; M1–M6 remain freely available.</p>
<ul>
<li>M1: Build a matrix from a keyword. Remove repeated keyword letters, then fill with the remaining alphabet. I and J share a cell.</li>
<li>M2: See where padding is inserted. Insert X between identical letters in a pair (HELLO → HE LX LO).</li>
<li>M3: Play all three rules. Same row: move right. Same column: move down. Rectangle: use the other letter’s column.</li>
<li>M4: Identical letters across pair boundaries. Do not insert X between EE across pair boundaries (ME ET ME …).</li>
<li>M5: Identify possible padding. An X in decrypted text is only a candidate. It may be a genuine X.</li>
<li>M6: Set the keyword yourself and decrypt. Decryption needs the same matrix as encryption.</li>
<li>C1: Mystery word. Decode without a keyword.</li>
<li>C2: Secret message. Infer the keyword from hints and decode.</li>
<li>C3: Military operation. Infer the keyword from hints and decode.</li>
</ul>
<p>C1, C2 and C3 award 10, 20 and 30 points, for 60 total. C1 unlocks C2; C2 unlocks C3. Only the first correct answer earns points.</p>
<p>Open the bottom card with “Start guide” in the summary or a mission row. Steps are checked automatically from screen state.</p>
<p>Completing a later step also checks earlier steps. “Go to this step” switches tabs, outlines the control and moves focus.</p>
<p>The guide never enters an answer, keyword or plaintext. It costs no points. Use “Next mission” after completing a mission.</p>
<p>M3 counts only encryption rules displayed with “Next” or “Play”. Pairs skipped by “Go to end” or reduced motion do not count.</p>
<p>Decryption hints cost no points either. A first correct answer without hints earns a star (★). Migrated old progress has no stars.</p>
<p>Practice shows the keyword but does not change the matrix. Set it yourself on the Key Generation tab. Infer challenge keywords from hints.</p>
<p>“Start challenge” opens its information and answer field on the Decryption tab. Check that the required and current matrices match.</p>
<p>“Restore default matrix” restores the no-keyword matrix. Close the guide with Escape or “Close” to return focus to its opener.</p>
</section>
<section><h3>Storage and safety</h3>
<p>Only progress, language, and theme are saved in this browser. Storage is optional. Text and keys are not sent to external services.</p>
<p>This tool is educational. Playfair is not suitable for protecting modern secrets.</p>
</section>
`,
                'playback.play': '▶ Play',
                'playback.pause': '⏸ Pause',
                'playback.finish': 'Go to end',
                'step.explanation': '{before} → {after} ({rule})',
                'rule.encryption.row': 'Same row: shift one place right',
                'rule.encryption.column': 'Same column: shift one place down',
                'rule.encryption.rectangle': 'Rectangle: same row, other letter\'s column',
                'rule.decryption.row': 'Same row: shift one place left',
                'rule.decryption.column': 'Same column: shift one place up',
                'rule.decryption.rectangle': 'Rectangle: same row, other letter\'s column',
                'rule.variant.no-change': 'Variant: leave identical letters unchanged',
                'rule.variant.right-shift': 'Variant: apply or reverse the right shift',
                'rule.variant.bottom-right': 'Variant: apply or reverse the bottom-right shift',
                'padding.inserted-legend': 'Underlined letters are inserted or appended padding.',
                'padding.candidate-legend': 'Dotted underlines mark possible padding. Genuine letters may be marked, so none are removed automatically.',
                'padding.stripped': 'Text with candidates removed',
                'category.phrase': 'Common phrases',
                'category.known': 'Known examples',
                'category.practice': 'Decryption practice',
                'example.basic-01': 'Greeting',
                'example.basic-02': 'Secret',
                'example.basic-03': 'Cipher',
                'example.phrase-01': 'Attack at dawn',
                'example.phrase-02': 'Secret meeting',
                'example.phrase-03': 'Immediate retreat',
                'example.historical-01': 'A genuine final X',
                'example.historical-02': 'Wikipedia example',
                'example.decrypt-01': 'Decrypt a greeting',
                'example.decrypt-02': 'Short word',
                'example.decrypt-03': 'Animal name',
                'example.mystery-01': 'Mystery word',
                'example.mystery-02': 'Secret message',
                'example.mystery-03': 'Military operation',
                'exercise.basic-01.description': 'A padding letter is inserted between the repeated letters LL',
                'exercise.basic-02.description': 'An example without padding',
                'exercise.basic-03.description': 'A basic word',
                'exercise.phrase-01.description': 'A common example in cryptography textbooks',
                'exercise.phrase-02.description': 'EE crosses a pair boundary, so no padding is inserted between the two letters',
                'exercise.phrase-03.description': 'Padding is inserted between MM and at the end',
                'exercise.historical-01.description': 'The final X is genuine, but looks like possible padding after decryption',
                'exercise.historical-02.description': 'The Wikipedia example. Its ciphertext is BMODZBXDNABEKUDMUIXMMOUVIF',
                'exercise.decrypt-01.description': 'Basic decryption practice',
                'exercise.decrypt-02.description': 'Decrypt a six-letter word',
                'exercise.decrypt-03.description': 'Decrypt with a keyword',
                'exercise.decrypt-01.hint': 'Use the default matrix. The X between LL is padding',
                'exercise.decrypt-02.hint': 'Use the default matrix',
                'exercise.decrypt-03.hint': 'Use ANIMAL as the keyword. The final X is padding',
                'exercise.mystery-01.description': 'Basic decryption challenge',
                'exercise.mystery-02.description': 'Intermediate decryption challenge',
                'exercise.mystery-03.description': 'Advanced decryption challenge',
                'answer.correct': 'Correct',
                'answer.wrong-key': 'Wrong key. Set the matrix required by this challenge.',
                'answer.incorrect': 'Incorrect',
                'answer.empty': 'Enter your answer',
                'error.keyword-empty': 'Enter a keyword.',
                'error.keyword-chars': 'Unsupported characters: {chars}. Enter letters and spaces only.',
                'error.keyword-letter': 'Enter at least one letter.',
                'error.matrix-j': 'J cannot be used. It will be replaced with I.',
                'error.matrix-length': 'Enter 25 letters (5 by 5).',
                'error.matrix-duplicate': 'The matrix contains duplicate letters.',
                'error.odd-length': 'Ciphertext must contain an even number of letters.',
                'error.double-pair': 'Standard ciphertext cannot contain the double-letter pair {pair}.',
                // Header
                'header.title': 'Playfair CipherLab',
                'header.subtitle': 'Visual Learning Tool for Playfair Cipher',
                
                // Progress
                'progress.title': '📊 Learning Progress',
                'progress.reset': '🔄 Reset Progress',
                
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
                'category.basic': 'Basic words',
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
                
                // Same Pair Rules
                'rule.no-change': 'Variant: leave identical letters unchanged',
                'rule.right-shift': 'Variant: shift identical letters right',
                'rule.bottom-right': 'Variant: shift identical letters down and right',
                'rule.left-restore': 'Variant: restore identical letters from the left',
                'rule.top-left-restore': 'Variant: restore identical letters from the top left',
                
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
                'example.挨拶の復号': 'Decrypt a greeting',
                'example.短い単語': 'Short Word',
                'example.動物の名前': 'Animal name',
                'example.謎の単語': 'Mystery word',
                'example.秘密のメッセージ': 'Secret message',
                'example.軍事作戦': 'Military operation',
                
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
                'challenge.mystery-01.hint.0': 'A word used as a greeting',
                'challenge.mystery-01.hint.1': 'Do not set a keyword; use the default matrix',
                'challenge.mystery-01.hint.2': 'A five-letter English word',
                'challenge.mystery-01.hint.3': 'Decryption contains one padding X',
                'challenge.mystery-02.hint.0': 'Build the key matrix from the English word meaning secret',
                'challenge.mystery-02.hint.1': 'A sentence about meeting someone',
                'challenge.mystery-02.hint.2': 'It contains three words',
                'challenge.mystery-02.hint.3': 'Spaces and letter case do not matter in your answer',
                'challenge.mystery-03.hint.0': 'Build the key matrix from an English word related to the military',
                'challenge.mystery-03.hint.1': 'The keyword has eight letters',
                'challenge.mystery-03.hint.2': 'A common example in cryptography textbooks',
                'challenge.mystery-03.hint.3': 'It contains a word referring to a time of day',
                
                // Help Modal
                'help.title': 'Playfair CipherLab Help',
                'help.progress.title': '📊 Learning Progress',
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
                'help.warning.desc': '<strong>This tool is for educational purposes.</strong> ' +
                    'Playfair cipher is a classical cipher and not suitable for modern cryptographic use.'
            }
        };
    }

    loadLanguage() {
        try {
            const requested = new URLSearchParams(location.search).get('lang');
            if (requested === 'ja' || requested === 'en') return requested;
        } catch (_error) { /* No location in a non-browser test environment. */ }
        try {
            const saved = localStorage.getItem('playfair-language');
            if (saved === 'ja' || saved === 'en') return saved;
        } catch (_error) { /* Fall back to the browser language. */ }
        return typeof navigator !== 'undefined' && /^ja/i.test(navigator.language) ? 'ja' : 'en';
    }

    saveLanguage(lang) {
        try {
            localStorage.setItem('playfair-language', lang);
        } catch (_error) {
            // The current page can still switch language.
        }
    }

    setLanguage(lang) {
        if (lang !== 'ja' && lang !== 'en') return;
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
            text = text.split(`{${param}}`).join(String(params[param]));
        });
        
        return text;
    }

    updateUI() {
        document.documentElement.lang = this.currentLang;
        for (const element of document.querySelectorAll('[data-i18n]')) {
            element.textContent = this.t(element.dataset.i18n);
        }
        document.title = this.t('header.title') + ' - ' + this.t('header.subtitle');
        for (const element of document.querySelectorAll('[data-i18n-aria]')) {
            element.setAttribute('aria-label', this.t(element.dataset.i18nAria));
        }
        this.updateElement('#hint-button', 'decrypt.hint');
        for (const [id, key] of [['help-toggle', 'help.open'], ['theme-toggle', 'theme.toggle'], ['lang-toggle', 'language.toggle']]) {
            document.getElementById(id).setAttribute('aria-label', this.t(key));
        }
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
        this.updateElement('.padding-char-wrapper .field-heading', 'encrypt.padding-char');
        
        // Update keyword preview label
        this.updateElement('.keyword-preview .field-heading', 'key.keyword.preview');
        
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
            element.textContent = this.t(key);
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
            const link = document.createElement('a');
            link.href = 'https://github.com/ipusiron/playfair-cipherlab';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = this.t('footer.link');
            footerElement.textContent = this.t('footer.prefix');
            footerElement.append(link, this.t('footer.suffix'));
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
        if (modalBody) modalBody.innerHTML = this.t('help.body');
    }

    updateProcessLabels() {
        // Update encryption process labels
        const encryptionLabels = document.querySelectorAll('#encryption-process .state-container .field-heading');
        if (encryptionLabels.length >= 2) {
            encryptionLabels[0].textContent = this.t('encrypt.before-pairs');
            encryptionLabels[1].textContent = this.t('encrypt.after-pairs');
        }
        
        // Update decryption process labels
        const decryptionLabels = document.querySelectorAll('#decryption-process .state-container .field-heading');
        if (decryptionLabels.length >= 2) {
            decryptionLabels[0].textContent = this.t('encrypt.before-pairs');
            decryptionLabels[1].textContent = this.t('encrypt.after-pairs');
        }
    }

    updateSamePairRules() {
        for (const name of ['same-pair-rule', 'decrypt-same-pair-rule']) {
            for (const input of document.querySelectorAll(`input[name="${name}"]`)) {
                const span = input.parentElement.querySelector('span');
                const key = name === 'decrypt-same-pair-rule' ? `decrypt-rule.${input.value}` : `rule.${input.value}`;
                if (span) span.textContent = this.t(key);
            }
        }
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
