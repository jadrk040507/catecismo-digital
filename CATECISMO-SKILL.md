# CATECISMO-SKILL.md — Proyecto Catecismo

## Identity
- **Agente:** Catecismo Agent (`session:catecismo-agent`)
- **Proyecto:** Proyecto Catecismo — plataforma abierta, pública y gratuita de catequesis católica
- **Stack:** Astro + vanilla CSS (no Tailwind) + GitHub Pages + Web Speech API TTS
- **Repo:** `github.com/jadrk040507/catecismo-digital` (público)
- **URL:** https://jadrk040507.github.io/catecismo-digital/
- **Base:** `/catecismo-digital` (subpath, not custom domain)

## Rename (April 26)
- Renamed from "Catecismo Digital" to **"Proyecto Catecismo"** — reflects that it's a living project, not a static digital version
- Header logo, page titles, hero section all updated

## Pedagogical Structure (per class)

Each class follows the 6-section format from the Directory for Catechesis 2020:

| Section | Label | Description |
|---------|-------|-------------|
| 1 | Gran Pregunta | Big question that opens the topic (starts with a story or image) |
| 2 | Contenido | Main content broken into subsections with CIC references |
| 3 | Conexión Bíblica | Biblical passage integrated into the main text body (not separate) |
| 4 | Para Reflexionar | 3-5 questions for personal reflection |
| 5 | Idea Fuerza | One-line takeaway in callout box |
| 6 | Riqueza Cultural | Optional: film, art, music, literature, podcasts |

### Key rules:
- **HTML-only** in `.astro` pages — no Markdown inside HTML elements
- **Depth-boxes inline** instead of level-tabs: 4 colored boxes placed within text flow
  - `depth-box--semilla` (green) → "Actividad" — exercises for children
  - `depth-box--brotes` (blue) → "Conexión" — reflection for youth
  - `depth-box--raiz` (orange) → "Contexto" — background for new adults
  - `depth-box--arbol` (purple) → "Ampliación" — theological depth
- **No labels that categorize people** — boxes are opt-in, not tags
- **~1 hour content depth** per class
- **Minimal emoji** — functional icons only
- **TTS button** (Web Speech API) below lesson title — reads entire class aloud

## Per-Class Files

For each class N, create in `src/pages/es/credo/`:

| File | Content |
|------|---------|
| `NN-tema.astro` | Main lesson page (full HTML content) |
| `NN-tema-workbook.astro` | Student workbook (printable via `window.print()`) |
| `NN-tema-guide.astro` | Catechist guide (for class preparation) |

### Workbook structure (per class):
- Recordando lo esencial (5 comprehension questions)
- Para reflexionar y escribir (5 personal journal questions with lines for writing)
- Actividades prácticas (2-3 activities: drawing, rewriting psalms, dialogues)
- Versiculo para memorizar (verse callout box)
- Oración para esta semana (prayer written by the class theme)

### Guide structure (per class):
- Resumen de la clase (duration, central theme, objectives, key verse, CIC refs)
- Estructura sugerida de la clase (table with sections, durations, what catechist does)
- Notas para el catequista (background on key figures/themes)
- Adaptación por edades (Semilla/Brotes/Raíz/Árbol)
- Recursos complementarios (YouCat, Opus Dei, videos, books)
- Preguntas difíciles (FAQ with suggested responses)
- Oración del catequista

## 💅 Visual Style Rules (CRITICAL — must be followed exactly)

### Layout imports
- **Lesson files** (lesson page, workbook, guide): import `LessonLayout` from `../../../layouts/LessonLayout.astro`
- **NEVER use `BaseLayout`** for lessons, workbooks, or guides — `LessonLayout` provides the correct structure
- **NO inline `<style>` blocks** in workbook or guide pages — CSS is inherited from LessonLayout and global.css

### Section structure
- **ALL `<section>` elements** in lesson content MUST have `class="content"` — even the first one
- **Big Question section**: `<section class="content">` → `<h2>Gran Pregunta</h2>` → `<p class="big-question">...`
- **No special section classes**: no `class="big-question"`, `class="reflection"`, `class="culture"` on `<section>` — just `class="content"`
- **No HTML comments** (`<!-- ... -->`) in `.astro` files — the layout handles labeling

### Content patterns
- **Bible verses**: use `<blockquote><p>... <cite>Reference</cite></p></blockquote>`
- **Reflection questions** (workbook): use `<div class="question-block"><p class="question-block__q">...</p><p class="question-block__p">...</p></div>`
- **Memory verse** (workbook): use `<div class="bible-passage"><p>... </p><p class="bible-passage__ref">...</p></div>`
- **Prayers**: use `<blockquote><p>...</p></blockquote>` (multi-line with `<br />`)
- **Download/print button**: `<div class="downloads"><a href="javascript:window.print()" class="download-btn">...</a></div>`
- **Depth-boxes**: always include `<h4 class="depth-box__title">` as heading

### Language consistency
- **EN lessons must follow the SAME visual structure** as ES lessons — identical sectioning, same class names, same layout patterns
- Only difference: title, content text, and references use English (CCC vs CIC, verse format with colon vs comma)
- Scripture references: ES uses `Ex 3,13-15`; EN uses `Ex 3:13-15`

### Print & TTS
- Print-to-PDF uses A4 @page, NOT A5 booklet
- Print button uses `javascript:window.print()` with `class="download-btn"`
- TTS button is provided by LessonLayout automatically — do not add manual TTS buttons

### Frontmatter
- Lesson files use: `const lessonRef = "..."; const lessonScripture = "...";` in frontmatter
- Guide files use: `title="..." cic="..." scripture=""` in Layout props
- Workbook files use: `title="Workbook &mdash; ..." cic="..." scripture=""` in Layout props

## Key Sources (trusted)

- vatican.va (Catechism, CCC, documents)
- YouCat (Youth Catechism) — youcat.org
- Opus Dei — opusdei.org (Temas de fe cristiana)
- Vatican News — vaticannews.va
- Fulton J. Sheen — "Peace of Soul", "Way to Happiness" (for stories)
- C. S. Lewis — "Mere Christianity"
- Catholic Answers, EWTN (for supplementary clarity)
- USCCB (for English CCC references)
- CELAM (for Latin American context)
- Hakuna Group Music — behakuna.com (contemporary Catholic music)
- Infinito + 1 / Juan Manuel Cotelo — Catequizis series
- Real + True (OSV) — osvnews.com/real-true
- Padre Luis Toro — YouTube catechesis
- Fichas de catequesis imprimibles — fichasconestilo.com, mifecatolica.net, parroquialainmaculadavalladolid.blogspot.com

## 4 Levels (pedagogical adaptation in guide)

| Level | Age | Approach | Guide notes |
|-------|-----|----------|-------------|
| 🌱 Semilla | 7-12 | Narrative-symbolic | Use water metaphor, drawing activities |
| 🌿 Brotes | 13-17 | Existential-defiant | Connect with their experience of highs and lows |
| 🪴 Raíz | Adults new | Kerygmatic-fundational | Welcome skepticism, use convert testimonies |
| 🌳 Árbol | Formed adults | Theological-spiritual | Deepen with *desiderium naturale*, Fathers |

## CIC Module Map — Syllabus Completo (Partes 1-4)

### Parte 1: El Credo (CIC 26-1065) — 10 temas ✅ COMPLETO

| # | Tema | CIC |
|---|------|-----|
| 1 | El Deseo de Dios | 27-30, 44-45 |
| 2 | La Revelación de Dios | 50-73 |
| 3 | Dios es Padre | 198-231 |
| 4 | Jesucristo, Dios y Hombre | 422-483 |
| 5 | La Encarnación | 484-511 |
| 6 | El Espíritu Santo | 683-747 |
| 7 | La Santísima Trinidad | 232-267 |
| 8 | Creación y Providencia | 279-324 |
| 9 | El Hombre y el Pecado | 355-421 |
| 10 | La Iglesia, Pueblo de Dios | 751-870 |

### Parte 2: Liturgia y Sacramentos (CIC 1066-1690) — 10 temas ⬜

| # | Tema | CIC |
|---|------|-----|
| 11 | La Liturgia: encuentro con Cristo | 1066-1134 |
| 12 | El Misterio Pascual en los Sacramentos | 1135-1209 |
| 13 | El Bautismo | 1210-1284 |
| 14 | La Confirmación | 1285-1321 |
| 15 | La Eucaristía | 1322-1419 |
| 16 | La Penitencia y la Reconciliación | 1420-1498 |
| 17 | La Unción de los Enfermos | 1499-1532 |
| 18 | El Orden Sagrado | 1533-1600 |
| 19 | El Matrimonio | 1601-1666 |
| 20 | Sacramentales y Piedad Popular | 1667-1690 |

### Parte 3: Moral / Vida en Cristo (CIC 1691-2557) — 12 temas ⬜

| # | Tema | CIC |
|---|------|-----|
| 21 | La Dignidad de la Persona Humana | 1700-1729 |
| 22 | Nuestra Vocación a la Bienaventuranza | 1716-1729 |
| 23 | La Libertad del Hombre | 1730-1748 |
| 24 | La Moralidad de los Actos Humanos | 1749-1761 |
| 25 | Las Pasiones y la Conciencia Moral | 1762-1802 |
| 26 | Las Virtudes | 1803-1845 |
| 27 | El Pecado | 1846-1876 |
| 28 | La Ley Moral | 1950-1986 |
| 29 | La Gracia y la Justificación | 1987-2029 |
| 30 | La Iglesia, Madre y Maestra | 2030-2051 |
| 31 | Los Diez Mandamientos (I-III) | 2052-2132 |
| 32 | Los Diez Mandamientos (IV-X) | 2133-2557 |

### Parte 4: La Oración Cristiana (CIC 2558-2865) — 5 temas ⬜

| # | Tema | CIC |
|---|------|-----|
| 33 | La Oración en la Vida Cristiana | 2558-2589 |
| 34 | Las Fuentes de la Oración | 2590-2649 |
| 35 | La Tradición Contemplativa | 2650-2719 |
| 36 | El Padre Nuestro: Invocación | 2759-2800 |
| 37 | Las Siete Peticiones | 2801-2865 |

## Pipeline

CIC (source) → RESEARCH → EXTRACT → COMPOSE → WORKBOOK → GUIDE → VALIDATE → BUILD → DEPLOY

Each module processed one at a time.

## Tech

| Component | Choice |
|-----------|--------|
| SSG | Astro v6 |
| CSS | Vanilla (no Tailwind) |
| Content | HTML in `.astro` pages |
| Search | Pending (Pagefind later) |
| i18n | Astro i18n (`es` default, `en` available) |
| TTS | Web Speech API (browser-native, no cost) |
| Print | `window.print()` + CSS `@media print` |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (push to main) |

## Validation (every class)

- ✅ Doctrinal orthodoxy (no error, no ambiguity)
- ✅ Kerygmatic: leads to encounter with Christ
- ✅ Pedagogically sound per level
- ✅ CIC + Scripture references embedded
- ✅ Language: clear, warm, inviting, not academic
- ✅ Includes story/anecdote in opening (Fulton Sheen or other)
- ✅ Workbook and Guide exist
