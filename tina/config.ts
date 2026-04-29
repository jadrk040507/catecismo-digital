// TinaCMS Config — Catecismo Digital
// Schema: 4 sections × 3 content types (lesson, workbook, guide) × 2 languages = 24 collections

import { defineConfig } from 'tinacms';

const STRUCTURE = {
  credo:    { label_es: 'Credo',       label_en: 'Creed'      },
  sacramentos: { label_es: 'Sacramentos', label_en: 'Sacraments' },
  moral:    { label_es: 'Moral',       label_en: 'Moral Life'  },
  oracion:  { label_es: 'Oración',     label_en: 'Prayer'      },
};

function collectionFor(section, lang, type) {
  const LANG_KEYS = { es: 'es', en: 'en' };
  const lk = LANG_KEYS[lang];
  const s = STRUCTURE[section];
  const labels = {
    lesson:   { es: 'Lecciones',   en: 'Lessons'   },
    workbook: { es: 'Workbooks',   en: 'Workbooks'  },
    guide:    { es: 'Guías del Catequista', en: "Catechist's Guides" },
  };
  const tlabel = labels[type];

  const fileNamePatterns = {
    lesson:   '(?!.*-workbook|.*-guide)',
    workbook: '*-workbook',
    guide:    '*-guide',
  };

  return {
    name: `${section}_${type}_${lk}`,
    label: `${s.label_en} — ${tlabel.en} (${lk.toUpperCase()})`,
    path: `content/${lk}/${section}`,
    format: 'md',
    match: type === 'lesson'
      ? { include: undefined, exclude: ['*-workbook', '*-guide'] }
      : { include: fileNamePatterns[type] },
    ui: {
      allowedActions: { create: true, delete: true },
      router: ({ document }) => {
        const slug = document._sys.filename.replace(/\.md$/, '');
        // Tina serves under its own base path; we link back to the live lesson
        return `/catecismo-digital/${lk}/${section}/${slug}`;
      },
    },
    fields: type === 'lesson'
      ? lessonFields(lang)
      : type === 'workbook'
        ? workbookFields(lang)
        : guideFields(lang),
  };
}

function lessonFields(lang) {
  const isES = lang === 'es';
  return [
    { type: 'string', name: 'title', label: isES ? 'Título' : 'Title', isTitle: true, required: true },
    { type: 'number', name: 'order', label: isES ? 'Orden' : 'Order' },
    { type: 'string', name: 'cic', label: isES ? 'Referencia CIC' : 'CCC Reference' },
    { type: 'string', name: 'scripture', label: isES ? 'Lectura Bíblica' : 'Scripture Reading' },
    {
      type: 'object',
      name: 'pedagogical',
      label: isES ? 'Estructura Pedagógica' : 'Pedagogical Structure',
      fields: [
        {
          type: 'rich-text',
          name: 'bigQuestion',
          label: isES ? '🎯 Gran Pregunta — apertura con historia o imagen' : '🎯 Big Question',
        },
        {
          type: 'rich-text',
          name: 'content',
          label: isES ? '📝 Contenido — 3-5 subsecciones con CIC' : '📝 Content',
        },
        {
          type: 'rich-text',
          name: 'biblicalConnection',
          label: isES ? '📜 Conexión Bíblica' : '📜 Biblical Connection',
        },
        {
          type: 'rich-text',
          name: 'reflection',
          label: isES ? '💭 Reflexión — 3-5 preguntas' : '💭 Reflection Questions',
        },
        {
          type: 'string',
          name: 'keyIdea',
          label: isES ? '✨ Idea Fuerza' : '✨ Key Idea',
          ui: { component: 'textarea' },
        },
        {
          type: 'rich-text',
          name: 'culturalWealth',
          label: isES ? '🖼️ Riqueza Cultural — películas, arte, música' : '🖼️ Cultural Wealth',
        },
      ],
    },
    {
      type: 'rich-text',
      name: 'body',
      label: isES ? 'Cuerpo completo' : 'Full body',
    },
  ];
}

function workbookFields(lang) {
  const isES = lang === 'es';
  return [
    { type: 'string', name: 'title', label: isES ? 'Título' : 'Title', isTitle: true, required: true },
    { type: 'string', name: 'cic', label: isES ? 'Referencia CIC' : 'CCC Reference' },
    { type: 'string', name: 'scripture', label: isES ? 'Lectura Bíblica' : 'Scripture Reading' },
    {
      type: 'rich-text',
      name: 'essentialRecall',
      label: isES ? '1. Recordando lo esencial — 5 preguntas de comprensión' : '1. Essential Recall',
    },
    {
      type: 'rich-text',
      name: 'reflectionAndWriting',
      label: isES ? '2. Para reflexionar y escribir — 5 preguntas personales' : '2. Reflection & Writing',
    },
    {
      type: 'rich-text',
      name: 'practicalActivities',
      label: isES ? '3. Actividades prácticas — 2-3 actividades' : '3. Practical Activities',
    },
    { type: 'string', name: 'memoryVerse', label: isES ? '4. Versículo para memorizar' : '4. Memory Verse', ui: { component: 'textarea' } },
    { type: 'string', name: 'memoryVerseRef', label: isES ? 'Referencia del versículo' : 'Verse Reference' },
    { type: 'rich-text', name: 'prayerForWeek', label: isES ? '5. Oración para esta semana' : '5. Prayer for the Week' },
  ];
}

function guideFields(lang) {
  const isES = lang === 'es';
  return [
    { type: 'string', name: 'title', label: isES ? 'Título' : 'Title', isTitle: true, required: true },
    { type: 'string', name: 'cic', label: isES ? 'Referencia CIC' : 'CCC Reference' },
    { type: 'string', name: 'scripture', label: isES ? 'Lectura Bíblica' : 'Scripture Reading' },
    { type: 'rich-text', name: 'classSummary', label: isES ? '1. Resumen de la clase' : '1. Class Summary' },
    { type: 'rich-text', name: 'suggestedStructure', label: isES ? '2. Estructura sugerida (75-90 min)' : '2. Suggested Structure' },
    { type: 'rich-text', name: 'catechistNotes', label: isES ? '3. Notas del catequista' : '3. Catechist Notes' },
    { type: 'rich-text', name: 'ageAdaptation', label: isES ? '4. Adaptación por edades' : '4. Age Adaptation' },
    { type: 'rich-text', name: 'supplementaryResources', label: isES ? '5. Recursos complementarios' : '5. Supplementary Resources' },
    { type: 'rich-text', name: 'difficultQuestions', label: isES ? '6. Preguntas difíciles (FAQ)' : '6. Difficult Questions' },
    { type: 'rich-text', name: 'catechistPrayer', label: isES ? '7. Oración del catequista' : '7. Catechist Prayer' },
  ];
}

// Generate all 24 collections
const collections = [];
for (const [section, _] of Object.entries(STRUCTURE)) {
  ['lesson', 'workbook', 'guide'].forEach(type => {
    ['es', 'en'].forEach(lang => {
      collections.push(collectionFor(section, type, lang));
    });
  });
}

// Add site settings as global collection
collections.push({
  name: 'settings',
  label: '⚙️ Configuración del Sitio',
  path: 'content/settings',
  format: 'json',
  ui: {
    global: true,
    allowedActions: { create: false, delete: false },
  },
  fields: [
    { type: 'string', name: 'siteTitle', label: 'Título del sitio (ES)', ui: { component: 'text' } },
    { type: 'string', name: 'siteTitleEn', label: 'Site Title (EN)', ui: { component: 'text' } },
    { type: 'string', name: 'footerText', label: 'Footer Text (ES)', ui: { component: 'textarea' } },
    { type: 'string', name: 'footerTextEn', label: 'Footer Text (EN)', ui: { component: 'textarea' } },
    { type: 'string', name: 'githubUrl', label: 'GitHub URL', ui: { component: 'text' } },
  ],
});

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main',

  clientId: process.env.TINA_PUBLIC_IS_LOCAL === 'true' ? '' : (process.env.TINA_CLIENT_ID || ''),
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads',
    },
  },

  schema: { collections },

  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || '',
      stopwordLanguages: ['spa', 'eng'],
    },
  },
});
