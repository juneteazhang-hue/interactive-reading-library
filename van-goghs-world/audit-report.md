# Van Gogh's World · Teaching Content and Browser Audit

Audit date: 2026-08-08

| Scene | Source & translation | Vocabulary | Grammar & exercises | 2 Bloom questions | Main image & bubbles | Audio | Retelling |
|---|---|---|---|---|---|---|---|
| 1 · Van Gogh's World | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 2 · An Artist Is Born | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 3 · Discovering Color | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 4 · A Difficult Time | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 5 · Illness and Creativity | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 6 · Seventy Productive Days | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 7 · His Final Period | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 8 · A Lasting Legacy | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

## Content review

- Eight source-backed reading scenes appear in chronological order, each with a complete Chinese translation.
- Every vocabulary item includes IPA, part of speech, Chinese meaning, and a concise English definition.
- Every highlighted core sentence opens a glass-panel lesson with sentence structure, grammar explanation, key expressions, an example, and exactly two imitation exercises with reference answers.
- Each scene has two four-choice questions. The first targets understanding/key evidence and the second targets analysis or inference. Each question has one valid answer and a text-based rationale.
- Sensitive parts of Van Gogh's health and final period use respectful, age-appropriate, non-procedural wording.

## Visual and interaction review

- All eight 1440×960 scene images and the 960×1440 cover load successfully.
- Each scene contains exactly two visible question bubbles, both bounded inside the scene region and placed away from the title-safe area.
- Translation toggle, correct-answer feedback, sentence-analysis dialog, imitation-answer reveal, free page navigation, and progress persistence are present.
- The retelling page contains eight matching image cards in story order. Cards flip to RE3-level English prompts plus Chinese support and flip back on a second click.
- Responsive browser checks passed at 1024×768, 768×1024, and 390×844 with no horizontal overflow. The retelling grid resolves to 4, 2, and 1 columns respectively.

## Audio review

- All eight MP3 scene clips exist and pass the structural MP3 tests, including the approved ≤0.08-second frame-reservoir preroll.
- Browser media state reached `HAVE_ENOUGH_DATA` (`readyState = 4`) without a media error, and an actual keyboard play action advanced the current time.
- Final teacher listening is still recommended before classroom publication to judge pronunciation, sentence-boundary naturalness, and preferred volume on the classroom device.

## Verification evidence

- Automated suite: `node --test tests/*.test.mjs` — 38/38 passed, including eight Van Gogh-specific regression checks.
- Browser console: no errors or warnings during the tested reading, quiz, sentence-lab, retelling, and responsive flows.
- Catalog: the library shows four stories and routes `reader.html?book=van-goghs-world` correctly.
