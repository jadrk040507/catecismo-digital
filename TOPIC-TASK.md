# TOPIC-TASK.md — Instrucciones para crear temas del Catecismo

## OBJETIVO
Crear 6 archivos `.astro` para un tema del Catecismo, siguiendo EXACTAMENTE la estructura y estilo de los Temas 1-3 existentes.

## ARCHIVOS A CREAR (para cada tema)
1. `src/pages/es/credo/NN-slug.astro` — Lección en español
2. `src/pages/es/credo/NN-slug-workbook.astro` — Workbook en español
3. `src/pages/es/credo/NN-slug-guide.astro` — Guía del catequista en español
4. `src/pages/en/credo/NN-en-slug.astro` — Lesson in English
5. `src/pages/en/credo/NN-en-slug-workbook.astro` — Workbook in English
6. `src/pages/en/credo/NN-en-slug-guide.astro` — Catechist guide in English

## REGLAS DE ESTILO (OBLIGATORIAS)

### Layout imports
- TODOS los archivos importan `LessonLayout` from `../../../layouts/LessonLayout.astro`
- NUNCA usar `BaseLayout` para lecciones, workbooks o guías
- SIN bloques `<style>` inline en workbook o guide

### Estructura de secciones
- TODOS los `<section>` deben tener `class="content"` — incluso el primero
- Sección "Gran Pregunta": `<section class="content">` → `<h2>Gran Pregunta</h2>` → `<p class="big-question">...`
- NO usar clases especiales en section: sin `class="big-question"`, `class="reflection"`, `class="culture"` en `<section>`
- SIN comentarios HTML (`<!-- ... -->`) en los .astro

### Patrones de contenido
- Citas bíblicas: `<blockquote><p>... <cite>Referencia</cite></p></blockquote>`
- Preguntas de reflexión (workbook): `<div class="question-block"><p class="question-block__q">...</p><p class="question-block__p">...</p></div>`
- Versículo para memorizar (workbook): `<div class="bible-passage"><p>...</p><p class="bible-passage__ref">— Referencia</p></div>`
- Oraciones: `<blockquote><p>...<br />...</p></blockquote>`
- Botón imprimir: `<div class="downloads"><a href="javascript:window.print()" class="download-btn">Imprimir Workbook</a></div>`
- Depth-boxes: siempre incluir `<h4 class="depth-box__title">Título</h4>`
  - `depth-box--semilla` (green) → "Actividad" for children
  - `depth-box--brotes` (blue) → "Conexión" for youth
  - `depth-box--raiz` (orange) → "Contexto" for new adults
  - `depth-box--arbol` (purple) → "Ampliación" for formed adults

### Idioma
- ES: español mexicano latinoamericano (NO vosotros, NO vocabulario castellano)
- EN: same visual structure, English content, CCC instead of CIC, colon in refs (Ex 3:13-15 vs Ex 3,13-15)
- Los archivos EN llevan exactamente las mismas secciones, clases y estructura que los ES

### Frontmatter
- Lesson: `const lessonRef = "CIC XXX-YYY"; const lessonScripture = "...";`
- Guide: `<LessonLayout title="Guía del Catequista &mdash; Título" cic="CIC refs" scripture="">`
- Workbook: `<LessonLayout title="Workbook &mdash; Título" cic="CIC refs" scripture="">`

### Estructura pedagógica (6 secciones por lección)
1. **Gran Pregunta** — Pregunta abridora con historia/imagen, usando `<p class="big-question">`
2. **Contenido** — 3-5 subsecciones con CIC references y depth-boxes intercalados
3. **Conexión Bíblica** — Pasaje bíblico en `<blockquote>` integrado en el texto
4. **Para Reflexionar** — 5 preguntas en `<ol>`
5. **Idea Fuerza** — Una línea en `<div class="callout"><p><strong>Idea Fuerza:</strong> ...</p></div>`
6. **Riqueza Cultural** — Película, arte, música, literatura (2-3 recursos)

### Workbook (6 secciones)
1. Recordando lo esencial (5 preguntas de comprensión en `<ol>`)
2. Para reflexionar y escribir (5 preguntas personales con `.question-block`)
3. Actividades prácticas (2-3 actividades con líneas para escribir)
4. Versículo para memorizar (`.bible-passage`)
5. Oración para esta semana (`<blockquote>`)
6. Botón imprimir (`.download-btn`)

### Guía del catequista (7 secciones)
1. Resumen de la clase (duración, tema central, objetivos, versículo clave, refs CIC)
2. Estructura sugerida (tabla con secciones, duraciones, qué hace el catequista)
3. Notas para el catequista (4-5 notas con fondo)
4. Adaptación por edades (Semilla/Brotes/Raíz/Árbol con 🌱🌿🪴🌳)
5. Recursos complementarios (YouCat, Opus Dei, videos, libros)
6. Preguntas difíciles (3-4 FAQ con respuestas)
7. Oración del catequista (`<blockquote>`)
8. Botón imprimir (`.download-btn`)

### Contenido doctrinal
- Ortodoxo según el Catecismo de la Iglesia Católica
- Querigmático: conduce al encuentro con Cristo
- Lenguaje cálido, claro, invitador — NO académico
- Incluye historia/anécdota en la Gran Pregunta (Fulton Sheen u otro)
- Referencias CIC y bíblicas integradas en el texto
- Profundidad de ~1 hora por clase

### Print y TTS
- Print: A4 @page, botón `window.print()` con `class="download-btn"`
- TTS: proporcionado automáticamente por LessonLayout, NO agregar botones manuales

## ARCHIVOS DE REFERENCIA (leer antes de crear)
- Lección ES: `src/pages/es/credo/03-dios-es-padre.astro`
- Workbook ES: `src/pages/es/credo/03-dios-es-padre-workbook.astro`
- Guía ES: `src/pages/es/credo/03-dios-es-padre-guide.astro`
- Lección EN: `src/pages/en/credo/03-god-is-father.astro`
- Workbook EN: `src/pages/en/credo/03-god-is-father-workbook.astro`
- Guía EN: `src/pages/en/credo/03-god-is-father-guide.astro`

LEER estos archivos primero para entender la estructura exacta. Tus archivos deben seguir EXACTAMENTE el mismo patrón.

## DESPUÉS DE CREAR
1. Ejecutar `cd /home/family/.openclaw/workspace/catecismo-digital && npm run build` para verificar
2. Si hay errores, corregirlos
3. Reportar: archivos creados, build exitoso o errores

## MAPA DE TEMAS

| # | Slug ES | Slug EN | Título ES | Título EN | CIC |
|---|---------|---------|-----------|-----------|-----|
| 4 | 04-jesucristo-dios-y-hombre | 04-jesus-christ-god-and-man | Jesucristo, Dios y Hombre | Jesus Christ, God and Man | 422-483 |
| 5 | 05-la-encarnacion | 05-the-incarnation | La Encarnación | The Incarnation | 484-511 |
| 6 | 06-el-espiritu-santo | 06-the-holy-spirit | El Espíritu Santo | The Holy Spirit | 683-747 |
| 7 | 07-la-santisima-trinidad | 07-the-holy-trinity | La Santísima Trinidad | The Holy Trinity | 232-267 |
| 8 | 08-creacion-y-providencia | 08-creation-and-providence | Creación y Providencia | Creation and Providence | 279-324 |
| 9 | 09-el-hombre-y-el-pecado | 09-man-and-sin | El Hombre y el Pecado | Man and Sin | 355-421 |
| 10 | 10-la-iglesia-pueblo-de-dios | 10-the-church-people-of-god | La Iglesia, Pueblo de Dios | The Church, People of God | 751-870 |