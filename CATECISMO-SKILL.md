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

## CIC Module Map (Part 1: The Creed)

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
