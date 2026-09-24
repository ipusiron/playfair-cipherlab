English · [日本語](README.md)

# Playfair CipherLab - Learn the Playfair cipher visually

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/playfair-cipherlab?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/playfair-cipherlab?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/playfair-cipherlab)
![GitHub license](https://img.shields.io/github/license/ipusiron/playfair-cipherlab)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/playfair-cipherlab/)

**Day027 - 100 Security Tools with Generative AI**

Playfair CipherLab is a web tool for visually learning the Playfair cipher, a classical cipher.
Build a 5×5 key matrix and play through encryption and decryption one pair of letters at a time.
It offers a Japanese/English interface, ciphertext analysis, three key-square recovery puzzles, an eighteen-mission learning roadmap, an on-screen guide that points to controls, and encryption, decryption and historical challenges.

## 🌐 Demo

👉 [Open Playfair CipherLab in English](https://ipusiron.github.io/playfair-cipherlab/?lang=en)

Use it directly in your browser. You can also download the files and open index.html directly.

## 📸 Screenshots

![Learning roadmap and M3 guide](assets/en/screenshot.png)

> *M1 and M2 are complete. The M3 guide highlights the example category selector.*

1280×2600px, 174,499 bytes.

![Wikipedia example at pair 10 of 13](assets/en/screenshot2.png)

> *The PLAYFAIR EXAMPLE matrix encrypts the Wikipedia example. Pair 10/13 shows EX → XM.*

1280×1000px, 34,026 bytes.

![C2 matrix match and correct answer](assets/en/screenshot3.png)

> *mystery-02 was loaded with “Start challenge” and solved with the SECRET matrix. The required matrix, current matrix, match indicator and answer field are visible.*

1280×1000px, 33,762 bytes.

[Dark English keyword preview](assets/screenshot3.png)

> *PLAYFAIR EXAMPLE is entered in the dark English interface, with letters from the keyword highlighted in a different color.*

1280×1000px, 45,798 bytes.

![Ciphertext analysis and reversed pairs](assets/en/screenshot4.png)

> *TCITIGCTSMCTCBBCCT is analyzed with the SECRET matrix and entry ① selected. CT→ER and TC→RE show reversal after decryption.*

1280×1600px, 86,078 bytes.

![R1 solved with the recovered square and hidden plaintext](assets/en/screenshot5.png)

> *All 25 cells match. The recovered square decrypts the hidden ciphertext, with possible padding identified separately.*

1280×1800px, 94,590 bytes.

![PT-109 decrypted with the variant and the boat number answered correctly](assets/en/screenshot6.png)

> *The ROYAL NEW ZEALAND NAVY matrix and “leave identical letters unchanged” variant decrypt the message. Answer 109 reveals the explanation and the unverified-original-source notice.*

1280×3000px, 150,364 bytes.

## ✨ Features

### 📊 Learning progress

- Points for three encryption, three decryption and three recovery challenges (10, 20 and 30 points per set), plus one historical challenge (30 points): 210 in total, awarded only once per problem
- Complete, next, incomplete and locked states for eighteen missions (one key-matrix mission, three encryption missions, three encryption challenges, two decryption missions, two analysis missions, three decryption challenges, one historical challenge and three recovery puzzles), with a recommended next action
- A guide that checks steps automatically as you work, and a ★ for a first correct answer without hints
- Separate E1 → E2 → E3, C1 → C2 → C3 → H1 and R1 → R2 → R3 unlock chains, and a progress reset with a confirmation dialog
- Progress saved in the same browser, with strict validation of stored values and migration from the old format; the page remains usable without storage

### 🔑 Key generation

- Keyword-based generation and direct entry of a 25-letter matrix
- A live preview of the 5×5 matrix
- J → I merging, duplicate detection and letter-count validation

### 🔐 Encryption and decryption

- Standard Playfair with a choice of X, Q or Z as padding
- Three nonstandard variants (leave unchanged, shift right and move diagonally)
- Eight examples, three decryption practices, three encryption challenges, three decryption challenges and one historical challenge
- Decryption results that never automatically delete padding, with candidate marks and text with candidates removed

### 🔍 Analysis

- Checks of three necessary conditions: even length, no J, and no identical-letter pair
- “Impossible in standard Playfair” or “Consistent with standard Playfair”, with the reasons for the verdict
- Numbered pairs, linked reversal badges and a list showing reversed decryption with the current matrix
- The five most frequent pairs, distinct-letter count and ignored characters
- Send encryption output or decryption input to analysis; editing the input or sample hides stale results
- Send ciphertext to [Day009 (Frequency Analyzer)](https://ipusiron.github.io/frequency-analyzer/) to analyze letter and digram frequencies; its overlapping digrams differ from the fixed pairs counted here
- Three known-plaintext key-square recovery puzzles, with fixed givens, per-pair ✓/✗/… states, three hint levels and hidden ciphertext decrypted with the recovered square

### 🎬 Playback and display

- Previous, Play/Pause, Next, Restart Animation and Go to end controls
- Explanations of each pair's rule, underlined padding and highlights on up to four cells
- Independent encryption/decryption playback, with stale output hidden after key, input or setting changes
- Japanese/English, light/dark, keyboard operation and mobile layouts
- All pair results shown without automatic playback when reduced motion is enabled

## 🗺️ Learning roadmap

| id | Group | Mission | What you learn | How to complete | Points |
|---|---|---|---|---|---|
| M1 | Key matrix | Build a matrix from a keyword | Remove repeated keyword letters, then fill with the remaining alphabet. I and J share a cell. | Save the PLAYFAIR EXAMPLE matrix | 0 |
| M2 | Encryption | See where padding is inserted | Insert X between identical letters in a pair (HELLO → HE LX LO). | Encrypt HELLO with the default matrix and standard rules | 0 |
| M3 | Encryption | Play all three rules | Same row: move right. Same column: move down. Rectangle: use the other letter’s column. | Display row, column and rectangle rules during encryption playback | 0 |
| M4 | Encryption | Identical letters across pair boundaries | Do not insert X between EE across pair boundaries (ME ET ME …). | Encrypt MEET ME TONIGHT with the default matrix and standard rules | 0 |
| E1 | Encryption challenges | Encryption challenge (beginner) | Insert padding and encrypt by hand | Calculate encipher-01 by hand and answer correctly | 10 |
| E2 | Encryption challenges | Encryption challenge (intermediate) | Use the same-row, same-column and rectangle rules by hand with a keyword matrix | After E1, solve encipher-02 | 20 |
| E3 | Encryption challenges | Encryption challenge (advanced) | Encrypt carefully with identical letters across pair boundaries and final padding | After E2, solve encipher-03 | 30 |
| M5 | Decryption | Identify possible padding | An X in decrypted text is only a candidate. It may be a genuine X. | Decrypt KCNVMP with the default matrix and standard rules | 0 |
| M6 | Decryption | Set the keyword yourself and decrypt | Decryption needs the same matrix as encryption. | Decrypt BNSY with the ANIMAL matrix and standard rules | 0 |
| M7 | Analysis | Identify ciphertext impossible in Playfair | Odd length, J and identical-letter pairs are impossible under standard rules. | Analyze text classified as impossible | 0 |
| M8 | Analysis | Find reversed pairs | Ciphertext AB and BA also become reversed pairs in plaintext. | Select an entry in the reversed-pair list | 0 |
| C1 | Decryption challenges | Mystery word | Decode without a keyword. | Solve mystery-01 with the default matrix | 10 |
| C2 | Decryption challenges | Secret message | Infer the keyword from hints and decode. | After C1, solve mystery-02 with the SECRET matrix | 20 |
| C3 | Decryption challenges | Military operation | Infer the keyword from hints and decode. | After C2, solve mystery-03 with the MILITARY matrix | 30 |
| H1 | Historical record | Historical record: the PT-109 message | Decrypt a real message to see how its rules differed from textbook Playfair | After C3, solve history-01 with its required matrix | 30 |
| R1 | Recovery | Recover a key square (Beginner) | Deduce 9 letters from 16 givens and 11 known pairs | Fill all 25 cells of recover-01 | 10 |
| R2 | Recovery | Recover a key square (Intermediate) | Deduce 17 letters from 8 givens and 14 known pairs | After R1, fill all 25 cells of recover-02 | 20 |
| R3 | Recovery | Recover a key square (Advanced) | Deduce 22 letters from 3 givens and 27 known pairs | After R2, fill all 25 cells of recover-03 | 30 |

M1–M8 can be completed in any order. “Next” recommends the first incomplete unlocked mission.
Completing everything shows 18/18 and 210/210pt, followed by a suggestion to compare the same text under variant rules.

“Start guide” in the recommendation banner or a mission opens the steps in the card below.
“Go to this step” opens the appropriate tab, outlines the control and moves focus.
It never fills in an answer, keyword or plaintext.
Steps update automatically from the current screen; completing a later step also checks earlier steps.
Close the guide with “Close” or Escape to return focus to its opener. Use “Try again” to reopen a completed mission's guide.

M3 counts only rules actually displayed as the current encryption pair.
“Go to end” and reduced motion skip pairs, so those skipped pairs do not count.
Use “Restart Animation” and then “Next” or “Play” to view the rules.
The guide's live step state is separate from saved mission achievements.

Guides and hints for any challenge never subtract points.
A problem's first correct answer earns a star only if no hints were shown.
Encryption challenges also withhold the star if you encrypt the same plaintext with the matching matrix after loading the problem.
Later answers do not replace the first points or hint count.
Old progress is migrated without stars because it did not record hint use.

Practice shows its keyword but never changes your matrix. Set it yourself on the Key Generation tab.
“Start challenge” loads a challenge and exposes its answer field even before decryption.
The challenge information shows the required matrix, current matrix and whether they match.

## 📖 How to use

If you are unsure where to start, open the progress panel and press “Start guide” for the “Next” mission.

### 🔑 Key generation

1. Press “Edit”.
2. Enter a keyword, or choose direct matrix entry and enter 25 letters.
3. Check the preview and press “Save”.

“Restore default matrix” returns to the no-keyword matrix.
The Encryption and Decryption tabs describe the source of the current matrix.

### 🔐 Learn with encryption

1. Type plaintext or select and load an example from a category.
2. Leave Same Pair Processing Mode ON for standard preparation and choose X, Q or Z as padding.
3. Press “Encrypt” and inspect each pair's explanation and positions in the matrix.
4. Use Previous, Next, Restart Animation and Go to end to change the displayed pair, and Play/Pause to toggle automatic playback.

Turning padding mode OFF selects a nonstandard variant.
Loading the Wikipedia text from “Known Examples” also sets the matrix to PLAYFAIR EXAMPLE.

Load an encryption challenge below the examples, or use “Start challenge” in the roadmap.
Read the plaintext and keyword, set the matrix yourself, and enter the ciphertext calculated by hand in the separate answer field.
Loading a problem never fills the plaintext input or changes the matrix. The three hints show prepared pairs, each pair's rule, then the first pair's answer.
Checking the same plaintext with the matching matrix using Encrypt counts as one hint for that problem, even if repeated.

### 🔓 Take on decryption challenges

1. Press “Start challenge” in the roadmap, or load a challenge from the Decryption tab.
2. Read hints if needed and save the matching matrix on the Key Generation tab.
3. Press “Decrypt” and inspect the result and padding candidates.
4. Enter an answer and press “Check Answer”.

The actual matrix must match even when the answer text is correct.
Spaces and case are ignored. The original answer, prepared plaintext and candidate-stripped answer are accepted.
Appending an unrelated final letter is not accepted.

Historical challenge H1 unlocks after C3. Set the displayed keyword and choose “Variant: leave identical letters unchanged” (No Change) under Same Pair Processing Rule before decrypting.
Standard rules produce a TT error. Answer with the lost boat's number, not the whole message. A correct answer reveals the explanation and sources.

### 🔍 Analyze ciphertext

1. Enter ciphertext or choose a sample on the “🔍 Analysis” tab.
2. Press “Analyze” and inspect the verdict, three checks and marked pairs.
3. If reversed pairs occur, select an entry and compare the matching badges and decryption with the current matrix.

Samples include ciphertext with reversed pairs made using SECRET, the Wikipedia example ciphertext, and Caesar ciphertext (Khoor, Zruog!).
“Send to analysis” also copies encryption output or decryption input and analyzes it.
J is checked without merging it into I. Whitespace is removed; other nonletters are listed as ignored characters.
The matrix never changes automatically. Save the SECRET matrix on the Key Generation tab to reproduce the sample's decryption.

Click “Open in Day009 Frequency Analyzer (new tab)” below the results to fill the input field in [Day009](https://ipusiron.github.io/frequency-analyzer/).
Press its Frequency Analysis button to examine letter and digram frequencies.
Day009 counts digrams with a one-letter sliding window within words, unlike the fixed two-letter pairs here.
The original ciphertext, with only leading and trailing whitespace trimmed, is passed in the URL. The link is hidden above 5,000 characters.

**🧩 Recover a key square from known plaintext**

1. Select R1 in the recovery section of the Analysis tab. Solving R1 unlocks R2; solving R2 unlocks R3.
2. Select an empty cell and type A–Z or choose from the palette (J becomes I). Givens cannot move; a previously placed letter moves from its old cell.
3. Move with arrow keys and erase with Backspace or Delete. Check each pair’s ✓ (consistent), ✗ (contradiction) or … (undetermined) state.
4. Use hints if needed: level 1 explains the rules, level 2 shows pair types, and level 3 points to a wrong cell or places one letter. Level 3 can be repeated.
5. When all 25 cells match, your square decrypts the hidden ciphertext. Possible padding is never removed automatically because it may be genuine.

“Start over” restores only the givens without resetting the hint count.
The partial square and inputs are not saved; only first-success points and hint use are stored as progress.
At widths of 480px or less, the pair list uses two columns with ✓/✗/… and compact row/col/rect labels for hint 2.
Accessible labels retain the full status and rule, and contradictory pairs are also listed directly below the square.

## 🧠 About the Playfair cipher

The **Playfair cipher** is a classical cipher devised in the mid-19th century.

A cipher that divides plaintext into groups of several letters and substitutes each group is called a polygraphic substitution cipher.
Playfair belongs to this family and divides the text into two-letter pairs, or digraphs.

Its use of **digraph substitution** makes it more complex than simpler substitution ciphers.

---

### 🔎 Background and history

**Charles Wheatstone** invented the cipher in 1854. His friend **Lord Playfair** promoted it, raising its profile, and it became widely known as the Playfair cipher.

The British Army used Playfair for tactical communications in the Second Boer War and the First World War, and the British and Australian armies used it in the Second World War. It was considered insecure even before the First World War; in 1942, William Friedman described it as offering “very little security.” It remained in use because it was quick to operate with just paper and pencil, and was adequate for messages whose contents would no longer be useful by the time an enemy had spent hours deciphering them.

---

### ⚙ How it works

Playfair encrypts pairs of letters using a **5×5 matrix (the key matrix)**.
It combines `I` and `J` to reduce the alphabet to 25 letters, then applies these rules.

| Positions of the two letters | Operation |
|---|---|
| Same row | Move one letter to the right (wrap from the right edge to the left) |
| Same column | Move one letter down (wrap from the bottom edge to the top) |
| Rectangle (different rows and columns) | Exchange columns with the other letter at the opposite corner |

During encryption, padding letters such as `X` or `Z` are inserted to separate identical letters within a pair or to complete a single letter at the end.

---

### 🧭 Place among classical ciphers

Playfair is more advanced than simple substitution ciphers (Caesar and monoalphabetic substitution) in the following respects.

- **Pairwise substitution** makes frequency analysis harder
- Working with **two letters at a time**, rather than one, prevents direct single-letter frequency analysis
- The key matrix has a **visually apparent structure**, making it well suited to teaching

For these reasons, Playfair serves as an **intermediate-level teaching cipher** among classical ciphers.

---

### 🧩 Strengths and weaknesses

Playfair has the following **structural strengths and weaknesses**.

---

#### ✅ Strengths

- Difficult to decipher using simple frequency analysis
- Two-letter substitution makes single-letter guesses harder
- Flexible keyword-based key generation; a keyword is easier to remember than an entire key matrix

---

#### ⚠️ Weaknesses

- The encryption rules are simple, so **enough ciphertext allows guesses to be tested by brute force**
- **The same plaintext pair produces the same ciphertext pair**, making patterns likely to appear
- The **two-letter structure** is vulnerable to statistical information such as frequent ciphertext pairs

Today, computers can **readily break the cipher**. It has **little practical use**, but it frequently appears in education and CTF challenges.

---

## 🔬 Rules and known answers

Normalize to uppercase, merge J into I and discard nonletters.
Read left to right in pairs. Split identical letters only within the current pair and pad an odd final letter.
Do not split identical letters across pair boundaries.

Padding may be X, Q or Z. If the source letter equals the selected padding, use Q for X and X for other padding.
For the same row move right; for the same column move down; for a rectangle exchange columns.
Decryption moves left or up.

| Keyword | Plaintext | Prepared text | Ciphertext |
|---|---|---|---|
| Default | HELLO | HELXLO | KCNVMP |
| Default | SEEN | SEEN | UCCP |
| Default | BALLOON | BALXLOON | CBNVMPPO |
| Default | FOXX | FOXQXQ | ILVSVS |
| PLAYFAIR EXAMPLE | HIDE THE GOLD IN THE TREE STUMP | HIDETHEGOLDINTHETREXESTUMP | BMODZBXDNABEKUDMUIXMMOUVIF |

The default matrix is `ABCDEFGHIKLMNOPQRSTUVWXYZ`.
Leave-unchanged, right-shift and bottom-right handling are nonstandard variants that process identical-letter pairs without splitting them.

Decryption cannot uniquely distinguish padding from genuine letters, so only candidates are underlined.
An X at the end of THE QUICK BROWN FOX is genuine but still looks like a candidate.
The candidate-stripped result is not a guarantee of the original text.

Standard ciphertext has no identical-letter pair.
With the same matrix, reversing the order within a pair reverses its encrypted pair.
These properties concern two-letter pairs, not arbitrary adjacent letters or an entire message.

**Ciphertext properties**

Standard Playfair ciphertext has even length, no J, and no identical-letter pair when split into pairs from the start.
Failing any condition gives “Impossible”; meeting all three gives “Consistent”.
These are necessary conditions, not proof that text is Playfair. Variants can produce identical-letter pairs.

With the same matrix, reversed ciphertext pairs decrypt into reversed plaintext pairs ([Wikipedia's RE/ER explanation](https://en.wikipedia.org/wiki/Playfair_cipher#Cryptanalysis)).
Analyzing `TCITIGCTSMCTCBBCCT` with the SECRET matrix gives CT↔TC → ER/RE and BC↔CB → DE/ED.
This demonstrates the property with the current matrix; it does not recover a key or automatically break the cipher.

**Key-square recovery from known plaintext**

Use same-row, same-column and rectangle relationships to narrow letter positions.
The first plaintext and ciphertext letters share a row or column, as do the second letters.
Cyclically shifting all rows and columns produces 25 equivalent squares with the same cipher. Givens fix the orientation in these puzzles.
Source for the manual recovery method: U.S. Army FM 34-40-2, Chapter 7.

- R1 (recover-01): 16 givens, 11 known pairs, 10 points.
- R2 (recover-02): 8 givens, 14 known pairs, 20 points.
- R3 (recover-03): 3 givens, 27 known pairs, 30 points.

### Changes from the previous version

A bug that inserted padding between identical letters across pair boundaries has been fixed.
Exercise ciphertexts have been regenerated with the standard rules, and answer checks now verify the actual key matrix as well.
Known answers, exercise data and the README tables are checked using the same cipher implementation.

## 🏆 Challenges

C1 is initially available. C1 unlocks C2; C2 unlocks C3.
M1–M8 are not prerequisites for the challenges.

| Level | Title | Ciphertext | Keyword | Points |
|---|---|---|---|---|
| 1 | Mystery word | KCNVMP | Default | 10 |
| 2 | Secret message | ITCSITEUOHAMCZ | SECRET | 20 |
| 3 | Military operation | MAAMDHMAKDUP | MILITARY | 30 |

<details>
<summary>Level 1: Mystery word — answer and hints</summary>

Answer: `HELLO`.

- A word used as a greeting
- Do not set a keyword; use the default matrix
- A five-letter English word
- Decryption contains one padding X

</details>

<details>
<summary>Level 2: Secret message — answer and hints</summary>

Answer: `MEET ME TONIGHT`.

- Build the key matrix from the English word meaning secret
- A sentence about meeting someone
- It contains three words
- Spaces and letter case do not matter in your answer

</details>

<details>
<summary>Level 3: Military operation — answer and hints</summary>

Answer: `ATTACK AT DAWN`.

- Build the key matrix from an English word related to the military
- The keyword has eight letters
- A common example in cryptography textbooks
- It contains a word referring to a time of day

</details>

### ✍️ Encryption challenges

E1 is available immediately; E2 unlocks after E1 and E3 after E2. Use the displayed plaintext and keyword to calculate the ciphertext by hand.
Spaces, case and separators in the answer are ignored. Answer validation does not require the current matrix to match, because this is a manual exercise.

| id | Plaintext | Keyword | Points |
|---|---|---|---|
| encipher-01 | SHEEP | Default matrix | 10 |
| encipher-02 | HIDE THE MAP | CIPHER | 20 |
| encipher-03 | ATTACK THE HILL | SECRET | 30 |

<details>
<summary>Encryption challenge answers and rules</summary>

- E1: Prepared text `SHEXEP`. SH (column), EX (rectangle), EP (column). Answer: `XNCZKU`.
- E2: Prepared text `HIDETHEMAP`. HI (row), DE (rectangle), TH (column), EM (rectangle), AP (rectangle). Answer: `EPFHYDHNBI`.
- E3: Prepared text `ATTACKTHEHILLX`. AT (rectangle), TA (rectangle), CK (column), TH (rectangle), EH (rectangle), IL (row), LX (rectangle). Answer: `GSSGDPSMSIKMKY`.

</details>

### 📜 Historical PT-109 message

H1 unlocks after C3. The keyword is `ROYAL NEW ZEALAND NAVY`; the challenge is worth 30 points.
The question is: “What was the number of the boat reported lost in the message?”

```text
KXJEY UREBE ZWEHE WRYTU HEYFS KREHE GOYFI WTTTU OLKSY CAJPO BOTEI ZONTX BYBWT GONEY CUZWR GDSON SXBOU YWRHE BAAHY USEDQ
```

<details>
<summary>Historical answer, explanation and sources</summary>

With the required matrix, the accepted answer is `109` or `ONE OWE NINE`.
Standard rules reject the identical-letter pair TT; the No Change variant produces:

```text
PTBOATONEOWENINELOSTINACTIONINBLACKETTSTRAITTWOMILESSWMERESUCOCEXCREWOFTWELVEXREQUESTANYINFORMATIONX
```

Coastwatcher Arthur Reginald Evans received this message on 2 August 1943. The keyword was ROYAL NEW ZEALAND NAVY. Actual operation differed from textbook Playfair: TT in BLACKETT was sent without separation, so standard rules reject it and the No Change variant reads it. The ciphertext also contains J, treated as I in the matrix. Numbers are spelled out as ONE OWE NINE (109). The reported plaintext says MERESU COVE, but decrypting this ciphertext gives COCE, suggesting a one-letter error somewhere in the circulating ciphertext.

Sources: the ciphertext comes from secondary sources including [Programming Praxis](https://programmingpraxis.com/2009/07/03/the-playfair-cipher/). The original is attributed to David Kahn, The Codebreakers (1996 edition, p. 592), but the original source was not consulted when making this tool. The plaintext and date come from [Wikipedia, Arthur Reginald Evans](https://en.wikipedia.org/wiki/Arthur_Reginald_Evans). The ciphertext is retained without correcting the discrepancy.

</details>

## 🔒 Security

All cipher operations run in the browser with no runtime API, CDN, external font or dependency.
Only clicking the Day009 link opens Day009 with ciphertext in the URL. Ciphertext is not otherwise sent outside the tool.
Playfair is an educational classical cipher and must not be used to protect secrets.

The meta CSP allows scripts and styles only from self, without unsafe-inline.
The referrer policy is no-referrer. Dynamic content uses DOM APIs and textContent.
Only fixed dictionary help templates use HTML insertion.
There are no style attributes or inline handlers. Unsupported meta frame-ancestors is not added.

Only progress, language and theme are saved in localStorage, and they are retained only in the same browser.
Initial language follows a valid `?lang=ja|en`, then a saved choice, then the browser language (Japanese for ja, English otherwise).
A URL override is not automatically saved; only the language toggle saves a choice.
Keys, input text and decryption results are never saved. Storage failures do not prevent use, but reloading then resets settings and progress.
A failed clipboard write produces a failure notification.

## 📚 Educational use

### Target levels

- **Middle and high school students**: Learning about ciphers in computing classes
- **University students**: Introductory information security courses
- **General audiences**: Programming education and STEAM education

---

### Use cases

- 📖 **Classroom demonstrations**: Demonstrations using a projector
- 💻 **Self-study**: Understanding ciphers at your own pace
- 👥 **Group work**: Team-based codebreaking competitions
- 🏆 **Contests**: Practice problems for CTF beginners

---

## 🔗 References

- [Wikipedia: Playfair cipher](https://en.wikipedia.org/wiki/Playfair_cipher)
- [Programming Praxis: The Playfair Cipher](https://programmingpraxis.com/2009/07/03/the-playfair-cipher/)
- [Wikipedia: Arthur Reginald Evans](https://en.wikipedia.org/wiki/Arthur_Reginald_Evans)
- David Kahn, The Codebreakers (1996 edition, p. 592). The original source was not consulted
- 『暗号の秘密』 (Japanese-language book), pp. 70–72
- 『暗号解読事典』 (Japanese-language book), pp. 181–183
- 『暗号事典』 (Japanese-language book), pp. 556–559

## 🧪 Tests

Use Node.js 22 or newer. Do not install dependencies.

```bash
npm test
```

GitHub Actions also runs the tests on push and pull_request with Node 22.
Both READMEs are checked against ProgressCore, PlayfairCore, exercise data and dictionaries:
fourteen missions, five known answers, three challenges and their exact hints, the reversed-pair examples computed by PlayfairAnalysis,
and given and pair counts for all three puzzles from PlayfairRecovery.

| Test file | Coverage |
|---|---|
| test/cipher.test.js | Matrices, preparation, standard rules, variants, candidates and 200 seeded roundtrips |
| test/analysis.test.js | Necessary ciphertext conditions, reversed pairs, frequency and 200 seeded cases |
| test/recovery.test.js | Exact data for three recovery puzzles, deduction, hints and cyclic shifts |
| test/exercises.test.js | Ten datasets, encryption preparation and rules, PT-109 variants and answer validation |
| test/i18n.test.js | Matching keys, translations, initial language, Japanese literal policy and help |
| test/html.test.js | CSP, referrer, ARIA, labels, four tabs, defer order, guide structure and inline attribute restrictions |
| test/contrast.test.js | All 18 existing text pairs plus analysis and recovery text colors in light and dark modes meet 4.5:1 |
| test/format.test.js | Maximum line lengths, line counts and minification detection |
| test/readme.test.js | Bilingual tables, hints, YAML structure, complete trees and image references |
| test/progress.test.js | Mission completion rules, migration, locks, stars, guide steps and blocked storage |

## 📁 Directory structure

```text
playfair-cipherlab/                # Project root
├── .github/                       # GitHub configuration
│   └── workflows/                 # GitHub Actions workflows
│       └── test.yml               # Run npm test on push and pull_request with Node 22
├── .gitignore                     # Ignored local files
├── .nojekyll                      # Disable Jekyll processing
├── CLAUDE.md                      # Architecture, rules and development guidance
├── LICENSE                        # MIT license
├── README.md                      # Japanese usage, rules, known answers, tests and structure
├── README.en.md                   # English README
├── package.json                   # Dependency-free npm test command
├── index.html                     # Four tabs, playback, guide, help and meta CSP
├── assets/                        # README screenshots
│   ├── en/                        # English README screenshots
│   │   ├── screenshot.png         # English roadmap and M3 guide
│   │   ├── screenshot2.png        # English Wikipedia playback at pair 10
│   │   ├── screenshot3.png        # English C2 matrix match and correct answer
│   │   ├── screenshot4.png        # English analysis with SECRET and reversed entry one selected
│   │   ├── screenshot5.png        # English R1 success and hidden plaintext
│   │   └── screenshot6.png        # English PT-109 variant decryption, answer and explanation
│   ├── screenshot.png             # Japanese Wikipedia playback at pair 10
│   ├── screenshot2.png            # Japanese C2 matrix match and correct answer
│   ├── screenshot3.png            # Dark English keyword preview
│   ├── screenshot4.png            # Japanese roadmap and M3 guide
│   ├── screenshot5.png            # Japanese analysis with SECRET and reversed entry one selected
│   ├── screenshot6.png            # Japanese R1 in progress with hint-two pair types
│   └── screenshot7.png            # Japanese PT-109 variant decryption, answer and explanation
├── css/                           # Stylesheets
│   └── styles.css                 # Color variables, dark mode and responsive layout
├── js/                            # Classic scripts compatible with file URLs
│   ├── cipher.js                  # Pure standard cipher, variants and padding candidates
│   ├── analysis.js                # DOM-independent necessary-condition and reversed-pair analysis
│   ├── recovery.js                # DOM-independent key-square recovery core
│   ├── exercises.js               # Examples, exercises and pure answer validation
│   ├── progress.js                # Pure missions, completion rules and storage format
│   ├── guide.js                   # Guide card and Go to this step navigation
│   ├── ui.js                      # Tabs, matrix editing, playback, exercises and progress recording
│   ├── i18n.js                    # Japanese/English dictionaries, initial language and switching, including help
│   ├── theme-init.js              # Apply the theme before the first paint
│   ├── theme.js                   # Theme switching
│   ├── help.js                    # Help dialog
│   └── main.js                    # Startup
└── test/                          # Automated tests using node --test
    ├── cipher.test.js             # Matrices, preparation, variants, roundtrips and candidates
    ├── analysis.test.js           # Analysis examples, reversed pairs, frequency and 200 seeded cases
    ├── recovery.test.js           # Recovery data, deduction, hints and cyclic-shift checks
    ├── exercises.test.js          # Exercise data and answer validation
    ├── i18n.test.js               # Dictionary coverage, language choice, literal policy and help
    ├── html.test.js               # Static checks for CSP, referrer, ARIA and attributes
    ├── contrast.test.js           # All 18 existing pairs plus analysis and recovery contrast
    ├── format.test.js             # Minification detection through line lengths and line counts
    ├── progress.test.js           # Missions, migration, locks, guide steps and storage exceptions
    └── readme.test.js             # Bilingual tables, YAML, trees and images
```

## 💻 Requirements

A modern browser with HTML5, CSS3 and JavaScript.
No build step is needed. The tool works over HTTP and directly from file://.
Both access methods and both languages have been checked with the existing Chromium at 1280, 768, 390, 360 and 320px.

```bash
python -m http.server 8000
```

## 📄 License

MIT License. See [LICENSE](LICENSE).

## 🛠️ About this tool

This tool is part of the **100 Security Tools with Generative AI** project.
The project develops and publishes a variety of security-related tools with AI assistance over 100 days.
It covers fields ranging from classical and modern cryptography to network security and malware analysis.

🔗 [Project details and other tools](https://akademeia.info/?page_id=42163)
