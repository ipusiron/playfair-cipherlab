class I18nManager {
    constructor() {
        this.currentLang = this.loadLanguage();
        this.translations = {
            ja: {
                'recovery.conflicts': '矛盾している組: {pairs}',
                'recovery.kind.row': '行',
                'recovery.kind.column': '列',
                'recovery.kind.rectangle': '長方形',
                'encipher.heading': '暗号化チャレンジ',
                'encipher.choose': '挑戦する課題',
                'encipher.answer': '手で求めた暗号文:',
                'encipher.check': '解答をチェック',
                'encipher.hint': 'ヒント',
                'encipher.plaintext': '平文: {text}',
                'encipher.keyword': '鍵語: {keyword}',
                'encipher.keyword-none': 'なし（既定の表）',
                'encipher.star-warning': '暗号化ボタンで確かめると★は付きません',
                'encipher.hint.1': '前処理の組（埋め文字に印）: ',
                'encipher.hint.2': '組ごとの規則: {rules}',
                'encipher.hint.3': '最初の組の答え: {pair}→{answer}',
                'mission.group.encipher': '暗号化チャレンジ',
                'mission.group.history': '史料',
                'mission.E1.title': '暗号化チャレンジ（入門）',
                'mission.E1.learn': '埋め文字を挟んで、手で暗号化する',
                'mission.E1.step.1': '『挑戦する』で暗号化課題を読み込む',
                'mission.E1.step.2': '『🔑 鍵生成』タブで既定の表に戻し、表を見ながら手で求める',
                'mission.E1.step.3': '暗号化課題の解答欄に暗号文を入れて『解答をチェック』',
                'mission.E2.title': '暗号化チャレンジ（中級）',
                'mission.E2.learn': '鍵語の表で、同じ行・同じ列・長方形の3つを手で使う',
                'mission.E2.step.1': '『挑戦する』で暗号化課題を読み込む',
                'mission.E2.step.2': '『🔑 鍵生成』タブで鍵語CIPHERを保存し、表を見ながら手で求める',
                'mission.E2.step.3': '暗号化課題の解答欄に暗号文を入れて『解答をチェック』',
                'mission.E3.title': '暗号化チャレンジ（上級）',
                'mission.E3.learn': '組の境目の同じ文字と、末尾の埋め文字に気をつけて暗号化する',
                'mission.E3.step.1': '『挑戦する』で暗号化課題を読み込む',
                'mission.E3.step.2': '『🔑 鍵生成』タブで鍵語SECRETを保存し、表を見ながら手で求める',
                'mission.E3.step.3': '暗号化課題の解答欄に暗号文を入れて『解答をチェック』',
                'mission.H1.title': '史料: PT-109の電文',
                'mission.H1.learn': '実際の電文が教科書の規則から外れていたことを、復号して確かめる',
                'mission.H1.step.1': '『🔑 鍵生成』タブで鍵語ROYAL NEW ZEALAND NAVYを保存する',
                'mission.H1.step.2': '『挑戦する』で史料PT-109を読み込む',
                'mission.H1.step.3': '復号タブの同一ペア処理ルールを『変種: 変化なし』にして『復号』',
                'mission.H1.step.4': '失われた艇の番号を解答欄に入れて『解答をチェック』',
                'example.history-01': '史料PT-109',
                'exercise.history-01.description': '鍵語が分かっている史料の電文を復号し、問いに答えてください。',
                'history.question': '電文が伝えた、失われた艇の番号は？',
                'challenge.history-01.hint.0': '標準の規則で復号すると、『同じ文字の組』のエラーになります',
                'challenge.history-01.hint.1': '復号タブの同一ペア処理ルールで『変種: 変化なし』を選んでください',
                'challenge.history-01.hint.2': '数字は英語の綴りで書かれています',
                'challenge.history-01.hint.3': 'ONE OWE NINEは数字3つです',
                'history.explanation': 'この電文は1943年8月2日、沿岸監視員Arthur Reginald Evansが受け取ったものです。'
                    + '鍵語はROYAL NEW ZEALAND NAVYでした。実際の電文は教科書の規則どおりではありません。'
                    + 'BLACKETTのTTを分けずに送っているので、標準の規則では『同じ文字の組』のエラーになり、変種『変化なし』で読めます。'
                    + '暗号文にはJも入っていて、表ではIとして扱います。数字はONE OWE NINE（109）のように綴っています。'
                    + '伝わっている平文はMERESU COVEですが、この暗号文を復号するとCOCEになり、流布している暗号文のどこかに1文字の誤りがあるとみられます。',
                'history.source': '出典: 暗号文は二次資料（Programming Praxisほか）によります。'
                    + '原典はDavid Kahn『The Codebreakers』（1996年版、p.592）とされますが、このツールの作成では原典を確認していません。'
                    + '平文と日時はWikipedia『Arthur Reginald Evans』によります。',
                'mission.group.recovery': '復元',
                'mission.R1.title': '鍵表の復元（入門）',
                'mission.R1.learn': '16文字が置かれた表に、既知の組11個から残り9文字を推理して置く',
                'mission.R1.step.1': '『🔍 解析』タブを開く',
                'mission.R1.step.2': '『既知平文から鍵表を復元』でR1入門を選ぶ',
                'mission.R1.step.3': '空いたマスに文字を置く（組ごとの✓と✗で確かめながら）',
                'mission.R1.step.4': 'すべての組が成り立つように25マスを埋める',
                'mission.R2.title': '鍵表の復元（中級）',
                'mission.R2.learn': '8文字だけの表に、既知の組14個から残り17文字を推理して置く',
                'mission.R2.step.1': '『🔍 解析』タブを開く',
                'mission.R2.step.2': '『既知平文から鍵表を復元』でR2中級を選ぶ',
                'mission.R2.step.3': '空いたマスに文字を置く（組ごとの✓と✗で確かめながら）',
                'mission.R2.step.4': 'すべての組が成り立つように25マスを埋める',
                'mission.R3.title': '鍵表の復元（上級）',
                'mission.R3.learn': '3文字だけの表から、既知の組27個で鍵表全体を復元する',
                'mission.R3.step.1': '『🔍 解析』タブを開く',
                'mission.R3.step.2': '『既知平文から鍵表を復元』でR3上級を選ぶ',
                'mission.R3.step.3': '空いたマスに文字を置く（組ごとの✓と✗で確かめながら）',
                'mission.R3.step.4': 'すべての組が成り立つように25マスを埋める',
                'recovery.heading': '🧩 既知平文から鍵表を復元',
                'recovery.intro': '平文と暗号文の組が分かれば、鍵表を推理できます。空いたマスに文字を置き、'
                    + 'すべての組が成り立つように埋めてください。最初に置かれた文字（置き字）は動かせません。',
                'recovery.choose': '復元する問題',
                'recovery.problem.recover-01': 'R1入門（置き字16・組11）',
                'recovery.problem.recover-02': 'R2中級（置き字8・組14）',
                'recovery.problem.recover-03': 'R3上級（置き字3・組27）',
                'recovery.locked': '{previous}を解くと開きます',
                'recovery.crib-plain': '既知の平文',
                'recovery.crib-prepared': '前処理後の平文（挟んだXに印）',
                'recovery.crib-cipher': '既知の暗号文',
                'recovery.inserted': '前処理で挟んだ埋め文字',
                'recovery.controls': 'マスを選び、文字キーか下の文字ボタンで置きます。JはIとして扱います。'
                    + '矢印キーで移動し、BackspaceまたはDeleteで消します。置き済みの文字は元のマスから移ります。',
                'recovery.grid': '復元する5×5の鍵表',
                'recovery.palette': '置く文字を選択',
                'recovery.cell.given': '{row}行{col}列、置き字{letter}',
                'recovery.cell.letter': '{row}行{col}列、{letter}',
                'recovery.cell.empty': '{row}行{col}列、空き',
                'recovery.letter': '{letter}を置く',
                'recovery.letter.used': '{letter}、置き済み',
                'recovery.fixed': '置き字は動かせません',
                'recovery.moved': '{letter}を{row}行{col}列から移しました',
                'recovery.placed': '{row}行{col}列に{letter}を置きました',
                'recovery.reset': '最初からやり直す',
                'recovery.hint': '💡 ヒント{n}/3',
                'recovery.hints.one': 'ヒント使用{n}回（減点なし・★なし）',
                'recovery.hints.other': 'ヒント使用{n}回（ヒントなしで解くと★・減点なし）',
                'recovery.rules': '平文の組と暗号文の組の関係は3つです。同じ行なら右隣、同じ列なら下隣、'
                    + '長方形なら同じ行の相手の列の文字です。平文の1文字目と暗号文の1文字目は、必ず同じ行か同じ列にあります。2文字目どうしも同じです。',
                'recovery.wrong': 'このマスの文字が違います',
                'recovery.full-wrong': '答えと違うマスがあります',
                'recovery.pair.ok': '✓成り立つ',
                'recovery.pair.ng': '✗矛盾',
                'recovery.pair.open': '…まだ決まらない',
                'recovery.pairs': '既知の組',
                'recovery.caution': '✗が出なくても、組の残りの文字が決まるまでは間違いに気づけないことがあります',
                'recovery.status': '置いた文字{n}/25・成り立つ組{k}/{N}・矛盾{m}',
                'recovery.solved': '復元できました',
                'recovery.secret-cipher': '隠された暗号文',
                'recovery.secret-plain': '利用者の鍵表で復号した文',
                'recovery.secret-stripped': '埋め文字の候補を除いた文',
                'recovery.equivalent': '鍵表の行や列を丸ごと回した表（25通り）も同じ暗号になります。今回は置き字で位置が決まっています。',
                'analysis.open-frequency': 'Day009で頻度分析（新しいタブ）',
                'analysis.frequency-description': 'Day009（Frequency Analyzer）が開き、この暗号文が入力欄に入ります。'
                    + '『📊 頻度分析』を押すと、1文字ずつの頻度や二重字を調べられます。'
                    + 'Day009の二重字は1文字ずつずらして数えるので、ここでの組（2文字ずつ区切る）とは数え方が違います。暗号文はURLに含めて渡します。',
                'analysis.frequency-too-long': '5,000文字を超えるため、Day009へは渡せません',
                'tab.analysis': '🔍 解析',
                'analysis.heading': '暗号文を解析',
                'analysis.sample': '見本',
                'analysis.choose': '見本を選択…',
                'analysis.sample.reverse': '逆順の組を含む暗号文（鍵語SECRET）',
                'analysis.sample.wiki': 'Wikipediaの例の暗号文',
                'analysis.sample.caesar': 'シーザー暗号の文（Khoor, Zruog!）',
                'analysis.input': '暗号文',
                'analysis.run': '解析',
                'analysis.send': '解析へ送る',
                'analysis.empty': '暗号文を入力してください',
                'analysis.impossible': '標準のプレイフェアではあり得ません',
                'analysis.consistent': '標準のプレイフェアと矛盾しません',
                'analysis.caution': 'これらは必要条件です。満たしていてもプレイフェアとは限りません。変種のルールでは同じ文字の組が出ることがあります',
                'analysis.check.even.one': '文字数が偶数（{n}文字）',
                'analysis.check.even.other': '文字数が偶数（{n}文字）',
                'analysis.check.noJ': 'Jがない',
                'analysis.check.noDoublePair': '同じ文字の組がない',
                'analysis.double': '{n}組目{pair}',
                'analysis.ignored.one': '英字以外の文字は無視しました: {chars}',
                'analysis.ignored.other': '英字以外の文字は無視しました: {chars}',
                'analysis.pairs': '組の表示',
                'analysis.legend': '✗は同じ文字の組、①②などの同じ番号は逆順の組です。末尾の1文字は組に数えません。',
                'analysis.pair-number': '{n}組目',
                'analysis.position-separator': '・',
                'analysis.double-mark': '同じ文字の組',
                'analysis.reverse-mark': '逆順の組{n}',
                'analysis.reversed': '逆順の組',
                'analysis.positions.one': '{at}組目',
                'analysis.positions.other': '{at}組目',
                'analysis.reverse-entry': '{badge}{pair}（{at}）↔{reverse}（{reverseAt}）',
                'analysis.no-reversed': '逆順の組は見つかりませんでした',
                'analysis.decrypted': 'いまの鍵表で復号: {pair}→{plain}、{reverse}→{reversePlain}（逆順になります）',
                'analysis.no-j-decrypt': '標準の鍵表にJはないため、この組はそのまま復号できません。',
                'analysis.frequency': '組の回数（上位5つ）',
                'analysis.pair': '組',
                'analysis.count': '回数',
                'analysis.distinct.one': '使われている文字: {n}種類（プレイフェアの暗号文は多くても25種類）',
                'analysis.distinct.other': '使われている文字: {n}種類（プレイフェアの暗号文は多くても25種類）',
                "mission.label": "{id}{separator}{title}",
                "mission.group.key": "鍵表",
                "mission.group.encryption": "暗号化",
                "mission.group.decryption": "復号",
                "mission.group.analysis": "解析",
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
                "mission.M7.title": "プレイフェアではあり得ない暗号文を見分ける",
                "mission.M7.learn": "文字数が奇数、Jがある、同じ文字の組がある暗号文は、標準のプレイフェアでは作れない",
                "mission.M7.step.1": "『🔍 解析』タブを開く",
                "mission.M7.step.2": "見本『シーザー暗号の文（Khoor, Zruog!）』を選ぶ（ほかの文でもよい）",
                "mission.M7.step.3": "『解析』を押し、どの条件で『あり得ない』になったかを見る",
                "mission.M8.title": "逆順の組を見つける",
                "mission.M8.learn": "暗号文のABとBAは、平文でも逆順の組（REとER）になる",
                "mission.M8.step.1": "『🔍 解析』タブを開く",
                "mission.M8.step.2": "見本『逆順の組を含む暗号文（鍵語SECRET）』を選ぶ",
                "mission.M8.step.3": "『解析』を押す",
                "mission.M8.step.4": "逆順の組の一覧から1つ選び、いまの鍵表での復号が逆順になることを見る",
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
<section><h3>🔍 解析タブ</h3>
<p>文字数が偶数、Jがない、同じ文字の組がない、という3つの条件を確かめます。解析ではJをIに置き換えません。</p>
<p>1つでも満たさなければ「あり得ない」、すべて満たせば「矛盾しない」です。必要条件なので、プレイフェアであると断定はできません。変種では同じ文字の組が出ることがあります。</p>
<p>逆順の組には同じ番号を付けます。一覧のボタンを押すと、いまの鍵表での復号と鍵表の出どころを表示します。</p>
<p>Wikipediaの例のREとERのように、組の順序を逆にすると変換後の順序も逆になります。</p>
<p>見本は鍵語SECRETのTCITIGCTSMCTCBBCCT、Wikipediaの例の暗号文、シーザー暗号の文（Khoor, Zruog!）です。暗号化の出力と復号の入力からも「解析へ送る」で移せます。</p>
<p>「Day009で頻度分析（新しいタブ）」を押したときだけ暗号文をURLに含めてDay009の入力欄へ渡し、移動先の「📊 頻度分析」で分析します（5,000文字まで）。</p>
<p>Day009の二重字は語ごとに1文字ずつずらして数えるため、ここでの2文字ずつ区切った組とは数え方が違います。</p>
</section>
<section><h3>🧩 鍵表の復元</h3>
<p>解析タブで既知の平文と暗号文から5×5の鍵表を復元します。置き字は動かせません。R1は置き字16文字と組11個、R2は8文字と14個、R3は3文字と27個です。</p>
<p>同じ行なら右隣、同じ列なら下隣、長方形なら同じ行の相手の列へ変わります。平文と暗号文の1文字目どうし、2文字目どうしは、それぞれ同じ行か同じ列にあるので、位置を絞れます。</p>
<p>マスを選び、文字キーか文字の一覧で置きます。矢印で移動し、BackspaceかDeleteで消します。25マスが答えと一致すると、復元した表で隠された暗号文を復号します。埋め文字の候補は本物の文字かもしれないため、自動では消しません。</p>
<p>ヒントは①規則の説明、②組の種類、③間違ったマスの指摘、なければ1文字の配置です。3段目は何度でも使えます。減点はなく、ヒントなしの初回成功には★が付きます。</p>
<p>表全体の行と列を循環してずらした25通りは同じ暗号になります。この演習では置き字で向きを固定し、指定の表を復元します。</p>
<p>幅480px以下では組を2列に並べます。状態と規則の完全な名前は読み上げ用ラベルに残し、矛盾している組は表の直下にも表示します。</p>
<p>手作業による復元の出典：米陸軍FM 34-40-2第7章。</p>
</section>
<section><h3>暗号化チャレンジと史料</h3>
<p>E1〜E3では表示された平文と鍵語を使い、表を見ながら手で暗号文を求めます。読み込みでは平文欄や鍵表は変わりません。E1でE2、E2でE3が開きます。</p>
<p>ヒントは①前処理の組と埋め文字、②組ごとの規則、③最初の組の答えです。ヒントなしの初回正解に★が付きます。</p>
<p>暗号化ボタンで確かめると★は付きません。読み込み後に同じ平文を同じ鍵表で暗号化すると、その課題のヒント1回として数えます。繰り返しても1回です。</p>
<p>H1はC3のあとに開く史料チャレンジです。鍵語ROYAL NEW ZEALAND NAVYを自分で設定し、電文を読み込みます。標準では同じ文字の組TTがエラーになります。</p>
<p>復号の同一ペア処理ルールを「変種: 同じ文字のまま」（変化なし）にすると読めます。問いには失われた艇の番号を答えます。正解後の解説で、実際の運用が教科書の規則と違ったことを確かめられます。</p>
<p>暗号文は二次資料Programming Praxisほかによります。原典とされるDavid Kahn『The Codebreakers』（1996年版、p.592）は未確認です。日時と平文はWikipedia『Arthur Reginald Evans』によります。暗号文の食い違いは修正していません。</p>
</section>
<section><h3>学習進捗とナビ</h3>
<p>18個のミッションを画面の操作で達成します。「次はこれ」はおすすめ順で、M1〜M8は自由に進められます。</p>
<ul>
<li>M1：鍵語から鍵表を作る。鍵語の文字を重複なしで並べ、残りのアルファベットで埋める。IとJは同じマス</li>
<li>M2：埋め文字が入るところを見る。組の2文字が同じならXを挟む（HELLO → HE LX LO）</li>
<li>M3：3つの規則を再生で見る。同じ行は右へ、同じ列は下へ、長方形は相手の列の文字へ</li>
<li>M4：組の境目の同じ文字。境目にまたがるEEにはXを挟まない（ME ET ME …）</li>
<li>M5：埋め文字の候補を見分ける。復号結果のXは候補。本物のXと区別できないことがある</li>
<li>M6：鍵語を自分で設定して復号する。復号には、暗号化と同じ鍵表が要る</li>
<li>M7：プレイフェアではあり得ない暗号文を見分ける。奇数の文字数、J、同じ文字の組を確認する</li>
<li>M8：逆順の組を見つける。暗号文のABとBAは、平文でも逆順の組になる</li>
<li>C1：謎の単語。鍵語なしで解読する</li>
<li>C2：秘密のメッセージ。鍵語をヒントから推理して解読する</li>
<li>C3：軍事作戦。鍵語をヒントから推理して解読する</li>
<li>R1：鍵表の復元（入門）。置き字16文字と既知の組11個から推理する</li>
<li>R2：鍵表の復元（中級）。置き字8文字と既知の組14個から推理する</li>
<li>R3：鍵表の復元（上級）。置き字3文字と既知の組27個から推理する</li>
</ul>
<p>C1、C2、C3は順に10、20、30点で計60点です。C1を達成するとC2、C2を達成するとC3が開きます。得点は各課題の初回正解だけです。</p>
<p>E1：暗号化チャレンジ（入門）。E2：暗号化チャレンジ（中級）。E3：暗号化チャレンジ（上級）。順に10・20・30点です。</p>
<p>H1：史料: PT-109の電文（30点）。C3を解くと開きます。</p>
<p>R1、R2、R3も順に10、20、30点です。R1でR2、R2でR3が開きます。全18ミッションの合計は210点です。</p>
<p>帯や各行の「ナビ開始」で下のカードを開きます。手順は操作に合わせて自動で済みになります。あとの手順を済ませた場合、前の手順も済みになります。</p>
<p>「この場所へ移動」はタブを開いて対象を枠で示し、フォーカスを移します。答え、鍵語、平文は入力しません。ナビによる減点はありません。</p>
<p>「次」か「再生」で見た暗号化の規則だけをM3に数えます。「最後まで」や動きを減らす設定で飛ばした組は数えません。</p>
<p>解読ヒントも減点しません。ヒントを見ずに初回正解した課題には★が付きます。旧版から移した進捗には★を付けません。</p>
<p>復号練習は鍵語を表示しますが、鍵表は変更しません。自分で鍵生成タブへ移って設定します。C1〜C3の鍵語はヒントから推理します。</p>
<p>「挑戦する」で課題のタブへ移り、情報と解答欄を開きます。必要な鍵表と現在の鍵表の一致を確認してください。暗号化チャレンジの解答判定では鍵表の一致は問いません。</p>
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
                'recovery.conflicts': 'Conflicting pairs: {pairs}',
                'recovery.kind.row': 'row',
                'recovery.kind.column': 'col',
                'recovery.kind.rectangle': 'rect',
                'encipher.heading': 'Encryption challenges',
                'encipher.choose': 'Choose a challenge',
                'encipher.answer': 'Ciphertext calculated by hand:',
                'encipher.check': 'Check Answer',
                'encipher.hint': 'Hint',
                'encipher.plaintext': 'Plaintext: {text}',
                'encipher.keyword': 'Keyword: {keyword}',
                'encipher.keyword-none': 'none (default matrix)',
                'encipher.star-warning': 'Checking with the Encrypt button means you will not earn a star.',
                'encipher.hint.1': 'Prepared pairs (padding marked): ',
                'encipher.hint.2': 'Rules for each pair: {rules}',
                'encipher.hint.3': 'First pair: {pair}→{answer}',
                'mission.group.encipher': 'Encryption challenges',
                'mission.group.history': 'Historical record',
                'mission.E1.title': 'Encryption challenge (beginner)',
                'mission.E1.learn': 'Insert padding and encrypt by hand',
                'mission.E1.step.1': 'Load the encryption task with “Start challenge”.',
                'mission.E1.step.2': 'Open “🔑 Key Generation”, reset to the default matrix, and calculate by hand using the matrix.',
                'mission.E1.step.3': 'Enter the ciphertext in the challenge answer field and press “Check Answer”.',
                'mission.E2.title': 'Encryption challenge (intermediate)',
                'mission.E2.learn': 'Use the same-row, same-column and rectangle rules by hand with a keyword matrix',
                'mission.E2.step.1': 'Load the encryption task with “Start challenge”.',
                'mission.E2.step.2': 'Open “🔑 Key Generation”, save keyword CIPHER, and calculate by hand using the matrix.',
                'mission.E2.step.3': 'Enter the ciphertext in the challenge answer field and press “Check Answer”.',
                'mission.E3.title': 'Encryption challenge (advanced)',
                'mission.E3.learn': 'Encrypt carefully with identical letters across pair boundaries and final padding',
                'mission.E3.step.1': 'Load the encryption task with “Start challenge”.',
                'mission.E3.step.2': 'Open “🔑 Key Generation”, save keyword SECRET, and calculate by hand using the matrix.',
                'mission.E3.step.3': 'Enter the ciphertext in the challenge answer field and press “Check Answer”.',
                'mission.H1.title': 'Historical record: the PT-109 message',
                'mission.H1.learn': 'Decrypt a real message to see how its rules differed from textbook Playfair',
                'mission.H1.step.1': 'Open “🔑 Key Generation” and save keyword ROYAL NEW ZEALAND NAVY.',
                'mission.H1.step.2': 'Load the PT-109 historical challenge with “Start challenge”.',
                'mission.H1.step.3': 'On the Decryption tab choose “Variant: No Change” under same-pair rules, then press “Decrypt”.',
                'mission.H1.step.4': 'Enter the number of the lost boat and press “Check Answer”.',
                'example.history-01': 'Historical record: PT-109',
                'exercise.history-01.description': 'Decrypt this historical message using its known keyword, then answer the question.',
                'history.question': 'What was the number of the boat reported lost in the message?',
                'challenge.history-01.hint.0': 'Decrypting with the standard rules produces an identical-letter pair error.',
                'challenge.history-01.hint.1': 'Choose “Variant: No Change” in the same-pair rules on the Decryption tab.',
                'challenge.history-01.hint.2': 'Numbers are written as English words.',
                'challenge.history-01.hint.3': 'ONE OWE NINE represents three digits.',
                'history.explanation': 'Coastwatcher Arthur Reginald Evans received this message on 2 August 1943. '
                    + 'The keyword was ROYAL NEW ZEALAND NAVY. The actual message does not follow textbook rules: '
                    + 'the TT in BLACKETT was sent without splitting it. Standard decryption therefore reports an identical-letter pair error; '
                    + 'the No Change variant can read it. The ciphertext also contains J, treated as I in the matrix. '
                    + 'Numbers are spelled out, as in ONE OWE NINE (109). The reported plaintext says MERESU COVE, '
                    + 'but this ciphertext decrypts to COCE, suggesting a one-letter error somewhere in the circulated ciphertext.',
                'history.source': 'Sources: the ciphertext comes from secondary sources including Programming Praxis. '
                    + 'They cite David Kahn, The Codebreakers (1996 edition, p. 592), but the original source was not checked for this tool. '
                    + 'The plaintext and date are from Wikipedia, “Arthur Reginald Evans”.',
                'mission.group.recovery': 'Recovery',
                'mission.R1.title': 'Recover a key square (Beginner)',
                'mission.R1.learn': 'Deduce the remaining 9 letters from 16 givens and 11 known pairs',
                'mission.R1.step.1': 'Open the 🔍 Analysis tab',
                'mission.R1.step.2': 'Select R1 Beginner in Recover a key square from known plaintext',
                'mission.R1.step.3': 'Place letters in empty cells, checking ✓ and ✗ for each pair',
                'mission.R1.step.4': 'Fill all 25 cells so that every pair is consistent',
                'mission.R2.title': 'Recover a key square (Intermediate)',
                'mission.R2.learn': 'Deduce the remaining 17 letters from 8 givens and 14 known pairs',
                'mission.R2.step.1': 'Open the 🔍 Analysis tab',
                'mission.R2.step.2': 'Select R2 Intermediate in Recover a key square from known plaintext',
                'mission.R2.step.3': 'Place letters in empty cells, checking ✓ and ✗ for each pair',
                'mission.R2.step.4': 'Fill all 25 cells so that every pair is consistent',
                'mission.R3.title': 'Recover a key square (Advanced)',
                'mission.R3.learn': 'Recover the full key square from only 3 givens and 27 known pairs',
                'mission.R3.step.1': 'Open the 🔍 Analysis tab',
                'mission.R3.step.2': 'Select R3 Advanced in Recover a key square from known plaintext',
                'mission.R3.step.3': 'Place letters in empty cells, checking ✓ and ✗ for each pair',
                'mission.R3.step.4': 'Fill all 25 cells so that every pair is consistent',
                'recovery.heading': '🧩 Recover a key square from known plaintext',
                'recovery.intro': 'Use known plaintext and ciphertext pairs to deduce the key square. Fill the empty cells '
                    + 'so that every pair is consistent. The letters provided at the start (givens) cannot be moved.',
                'recovery.choose': 'Recovery puzzle',
                'recovery.problem.recover-01': 'R1 Beginner (16 givens, 11 pairs)',
                'recovery.problem.recover-02': 'R2 Intermediate (8 givens, 14 pairs)',
                'recovery.problem.recover-03': 'R3 Advanced (3 givens, 27 pairs)',
                'recovery.locked': 'Solve {previous} to unlock',
                'recovery.crib-plain': 'Known plaintext',
                'recovery.crib-prepared': 'Prepared plaintext (inserted X letters marked)',
                'recovery.crib-cipher': 'Known ciphertext',
                'recovery.inserted': 'Padding inserted during preparation',
                'recovery.controls': 'Select a cell, then type a letter or use a letter button below. J is treated as I. '
                    + 'Use arrow keys to move, and Backspace or Delete to clear. Placed letters move from their previous cells.',
                'recovery.grid': '5 by 5 key square to recover',
                'recovery.palette': 'Choose a letter to place',
                'recovery.cell.given': 'Row {row}, column {col}, given {letter}',
                'recovery.cell.letter': 'Row {row}, column {col}, {letter}',
                'recovery.cell.empty': 'Row {row}, column {col}, empty',
                'recovery.letter': 'Place {letter}',
                'recovery.letter.used': '{letter}, already placed',
                'recovery.fixed': 'Givens cannot be moved',
                'recovery.moved': 'Moved {letter} from row {row}, column {col}',
                'recovery.placed': 'Placed {letter} in row {row}, column {col}',
                'recovery.reset': 'Start over',
                'recovery.hint': '💡 Hint {n}/3',
                'recovery.hints.one': 'Hint used {n} time (no point penalty; no star)',
                'recovery.hints.other': 'Hints used {n} times (solve without hints for a star; no point penalty)',
                'recovery.rules': 'There are three relations: in the same row, use the letter to the right; in the same column, '
                    + 'use the letter below; for a rectangle, use the other column in the same row. The first plaintext '
                    + 'and ciphertext letters always share a row or column, as do the second letters.',
                'recovery.wrong': 'The letter in this cell is incorrect',
                'recovery.full-wrong': 'Some cells differ from the answer',
                'recovery.pair.ok': '✓Consistent',
                'recovery.pair.ng': '✗Contradiction',
                'recovery.pair.open': '…Undetermined',
                'recovery.pairs': 'Known pairs',
                'recovery.caution': 'Even without a ✗, a mistake may remain undetected until the other letters in the pair are placed.',
                'recovery.status': 'Placed: {n}/25 · Consistent pairs: {k}/{N} · Contradictions: {m}',
                'recovery.solved': 'Key square recovered',
                'recovery.secret-cipher': 'Hidden ciphertext',
                'recovery.secret-plain': 'Decrypted with your key square',
                'recovery.secret-stripped': 'Text with candidate padding removed',
                'recovery.equivalent': 'Cyclically shifting all rows or all columns gives 25 equivalent squares. '
                    + 'The givens fix the position in this puzzle.',
                'analysis.open-frequency': 'Open in Day009 Frequency Analyzer (new tab)',
                'analysis.frequency-description': 'Day009 (Frequency Analyzer) opens with this ciphertext in its input field. '
                    + 'Press its Frequency Analysis button to examine individual-letter and digram frequencies. '
                    + 'Day009 counts digrams with a one-letter sliding window, unlike the fixed two-letter pairs here. '
                    + 'The ciphertext is passed in the URL.',
                'analysis.frequency-too-long': 'Cannot send to Day009 because the text exceeds 5,000 characters',
                'tab.analysis': '🔍 Analysis',
                'analysis.heading': 'Analyze ciphertext',
                'analysis.sample': 'Sample',
                'analysis.choose': 'Select a sample…',
                'analysis.sample.reverse': 'Ciphertext with reversed pairs (keyword SECRET)',
                'analysis.sample.wiki': 'Ciphertext from the Wikipedia example',
                'analysis.sample.caesar': 'Caesar cipher text (Khoor, Zruog!)',
                'analysis.input': 'Ciphertext',
                'analysis.run': 'Analyze',
                'analysis.send': 'Send to analysis',
                'analysis.empty': 'Please enter ciphertext',
                'analysis.impossible': 'Impossible under standard Playfair',
                'analysis.consistent': 'Consistent with standard Playfair',
                'analysis.caution': 'These are necessary conditions, not proof of Playfair. Variant rules may produce identical-letter pairs.',
                'analysis.check.even.one': 'Even number of letters ({n} letter)',
                'analysis.check.even.other': 'Even number of letters ({n} letters)',
                'analysis.check.noJ': 'No J',
                'analysis.check.noDoublePair': 'No identical-letter pairs',
                'analysis.double': 'Pair {n}: {pair}',
                'analysis.ignored.one': 'A nonletter character was ignored: {chars}',
                'analysis.ignored.other': 'Nonletter characters were ignored: {chars}',
                'analysis.pairs': 'Ciphertext pairs',
                'analysis.legend': '✗ marks identical letters; matching badges such as ①② link reversed pairs. A final single letter is not a pair.',
                'analysis.pair-number': 'Pair {n}',
                'analysis.position-separator': ', ',
                'analysis.double-mark': 'Identical-letter pair',
                'analysis.reverse-mark': 'Reversed pair {n}',
                'analysis.reversed': 'Reversed pairs',
                'analysis.positions.one': 'pair {at}',
                'analysis.positions.other': 'pairs {at}',
                'analysis.reverse-entry': '{badge}{pair} ({at}) ↔ {reverse} ({reverseAt})',
                'analysis.no-reversed': 'No reversed pairs were found',
                'analysis.decrypted': 'Decrypted with the current matrix: {pair}→{plain}, {reverse}→{reversePlain} (in reverse order)',
                'analysis.no-j-decrypt': 'J is absent from a standard matrix, so this pair cannot be decrypted as written.',
                'analysis.frequency': 'Pair frequency (top five)',
                'analysis.pair': 'Pair',
                'analysis.count': 'Count',
                'analysis.distinct.one': 'Letters used: {n} distinct letter (Playfair ciphertext uses at most 25)',
                'analysis.distinct.other': 'Letters used: {n} distinct letters (Playfair ciphertext uses at most 25)',
                "mission.label": "{id} {title}",
                "mission.group.key": "Key matrix",
                "mission.group.encryption": "Encryption",
                "mission.group.decryption": "Decryption",
                "mission.group.analysis": "Analysis",
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
                "mission.M7.title": "Identify ciphertext impossible in Playfair",
                "mission.M7.learn": "Standard Playfair cannot produce ciphertext with an odd length, J, or an identical-letter pair.",
                "mission.M7.step.1": "Open the “🔍 Analysis” tab.",
                "mission.M7.step.2": "Choose “Caesar ciphertext (Khoor, Zruog!)” (another text is also fine).",
                "mission.M7.step.3": "Press “Analyze” and see which condition makes the ciphertext impossible.",
                "mission.M8.title": "Find reversed pairs",
                "mission.M8.learn": "Ciphertext AB and BA also become reversed pairs in plaintext (RE and ER).",
                "mission.M8.step.1": "Open the “🔍 Analysis” tab.",
                "mission.M8.step.2": "Choose “Ciphertext with reversed pairs (keyword SECRET)”.",
                "mission.M8.step.3": "Press “Analyze”.",
                "mission.M8.step.4": "Select an entry in the reversed-pair list and see that decryption with the current matrix produces reversed pairs.",
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
<section><h3>🔍 Analysis tab</h3>
<p>Check three conditions: an even number of letters, no J, and no identical-letter pairs. Analysis does not replace J with I.</p>
<p>Failing any condition means “impossible”; passing all means “consistent”. These are necessary conditions, not proof of Playfair.
Variant rules may produce identical-letter pairs.</p>
<p>Matching numbered badges link reversed pairs. Select one in the list to decrypt it with the current matrix and see where that matrix came from.</p>
<p>As with RE and ER in the Wikipedia example, reversing a pair also reverses its transformed result.</p>
<p>Samples include TCITIGCTSMCTCBBCCT with keyword SECRET, the Wikipedia example ciphertext, and Caesar cipher text (Khoor, Zruog!).
Use “Send to analysis” beside encryption output or below decryption input to analyze your own text.</p>
<p>Only clicking “Open in Day009 Frequency Analyzer (new tab)” sends up to 5,000 characters in the URL to its input field;
press its Frequency Analysis button to analyze them. Day009 counts overlapping digrams within words,
unlike the fixed two-letter pairs here.</p>
</section>
<section><h3>🧩 Key-square recovery</h3>
<p>Recover a 5×5 key square from known plaintext and ciphertext on the Analysis tab. Givens cannot move.
R1 has 16 givens and 11 pairs, R2 has 8 givens and 14 pairs, and R3 has 3 givens and 27 pairs.</p>
<p>A same-row pair moves right, a same-column pair moves down, and a rectangle uses the other letter’s column in the same row.
The first plaintext and ciphertext letters share a row or column, as do the second letters. Use these constraints to narrow positions.</p>
<p>Select a cell and type a letter or use the palette. Move with arrow keys and erase with Backspace or Delete.
Matching all 25 cells decrypts the hidden ciphertext with your recovered square. Possible padding is never removed automatically because it may be genuine.</p>
<p>Hints show (1) the rules, (2) pair types, then (3) a wrong cell, or place one letter if no cell is wrong.
Repeat the third hint as needed. Hints cost no points; a first success without hints earns a star (★).</p>
<p>Cyclically shifting all rows and columns gives 25 equivalent squares that produce the same cipher.
These puzzles fix the orientation with givens and require the specified square.</p>
<p>At widths of 480px or less, pairs use two columns. Accessible labels retain full status and rule names;
contradictory pairs also appear directly below the square.</p>
<p>Source for the manual recovery method: U.S. Army FM 34-40-2, Chapter 7.</p>
</section>
<section><h3>Encryption challenges and historical record</h3>
<p>In E1–E3, use the displayed plaintext and keyword to calculate ciphertext by hand.
Loading never fills the plaintext input or changes the matrix. E1 unlocks E2; E2 unlocks E3.</p>
<p>The three hints show prepared pairs with padding, each pair's rule, then the first pair's answer. A first correct answer without hints earns a star (★).</p>
<p>Checking with Encrypt prevents a star: encrypting the same plaintext with the matching matrix after loading
counts as one hint for that problem, even if repeated.</p>
<p>H1 unlocks after C3. Set ROYAL NEW ZEALAND NAVY yourself and load the historical message. Standard rules reject the identical-letter pair TT.</p>
<p>Choose “Variant: leave identical letters unchanged” (No Change) under Same Pair Processing Rule to decrypt it.
Answer with the lost boat's number. The explanation after a correct answer shows how actual operation differed from textbook rules.</p>
<p>The ciphertext comes from secondary sources including Programming Praxis.
The attributed original, David Kahn's The Codebreakers (1996, p. 592), was not consulted.
The date and plaintext come from Wikipedia, Arthur Reginald Evans. The ciphertext discrepancy is not corrected.</p>
</section>
<section><h3>Learning roadmap and guide</h3>
<p>Complete eighteen missions through screen actions. “Next” recommends an order; M1–M8 remain freely available.</p>
<ul>
<li>M1: Build a matrix from a keyword. Remove repeated keyword letters, then fill with the remaining alphabet. I and J share a cell.</li>
<li>M2: See where padding is inserted. Insert X between identical letters in a pair (HELLO → HE LX LO).</li>
<li>M3: Play all three rules. Same row: move right. Same column: move down. Rectangle: use the other letter’s column.</li>
<li>M4: Identical letters across pair boundaries. Do not insert X between EE across pair boundaries (ME ET ME …).</li>
<li>M5: Identify possible padding. An X in decrypted text is only a candidate. It may be a genuine X.</li>
<li>M6: Set the keyword yourself and decrypt. Decryption needs the same matrix as encryption.</li>
<li>M7: Identify ciphertext impossible in Playfair. Check odd length, J and identical-letter pairs.</li>
<li>M8: Find reversed pairs. Ciphertext AB and BA also become reversed pairs in plaintext.</li>
<li>C1: Mystery word. Decode without a keyword.</li>
<li>C2: Secret message. Infer the keyword from hints and decode.</li>
<li>C3: Military operation. Infer the keyword from hints and decode.</li>
<li>R1: Recover a key square (Beginner). Deduce positions from 16 givens and 11 known pairs.</li>
<li>R2: Recover a key square (Intermediate). Deduce positions from 8 givens and 14 known pairs.</li>
<li>R3: Recover a key square (Advanced). Deduce positions from 3 givens and 27 known pairs.</li>
</ul>
<p>C1, C2 and C3 award 10, 20 and 30 points, for 60 total. C1 unlocks C2; C2 unlocks C3. Only the first correct answer earns points.</p>
<p>E1: Encryption challenge (beginner). E2: Encryption challenge (intermediate). E3: Encryption challenge (advanced). Worth 10, 20 and 30 points.</p>
<p>H1: Historical record: the PT-109 message (30 points). Unlocks after C3.</p>
<p>R1, R2 and R3 also award 10, 20 and 30 points. R1 unlocks R2; R2 unlocks R3. All eighteen missions together award 210 points.</p>
<p>Open the bottom card with “Start guide” in the summary or a mission row. Steps are checked automatically from screen state.</p>
<p>Completing a later step also checks earlier steps. “Go to this step” switches tabs, outlines the control and moves focus.</p>
<p>The guide never enters an answer, keyword or plaintext. It costs no points. Use “Next mission” after completing a mission.</p>
<p>M3 counts only encryption rules displayed with “Next” or “Play”. Pairs skipped by “Go to end” or reduced motion do not count.</p>
<p>Decryption hints cost no points either. A first correct answer without hints earns a star (★). Migrated old progress has no stars.</p>
<p>Practice shows the keyword but does not change the matrix. Set it yourself on the Key Generation tab. Infer C1–C3 keywords from hints.</p>
<p>“Start challenge” opens the problem's tab, information and answer field. Check that the required and current matrices match.
Encryption challenge answer validation does not require a matching matrix.</p>
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
        this.updateElement('#finish-encryption', 'playback.finish');

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
        this.updateElement('#finish-decryption', 'playback.finish');
        
        // Update decryption result labels
        this.updateElement('label[for="challenge-answer"]', 'decrypt.answer-input');
        this.updateElement('#candidate-label', 'padding.stripped');

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
