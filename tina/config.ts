// TinaCMS Config — Catecismo Digital
// Modo local (gratis, sin Tina Cloud)
// 4 secciones × 3 tipos × 2 idiomas = 24 colecciones + 1 settings

import { defineConfig } from 'tinacms';

const SECTIONS = {
  credo:       { es: 'Credo',       en: 'Creed' },
  sacramentos: { es: 'Sacramentos', en: 'Sacraments' },
  moral:       { es: 'Moral',       en: 'Moral Life' },
  oracion:     { es: 'Oración',     en: 'Prayer' },
};

// EN uses different folder names
const SECTION_PATHS = {
  credo:       { es: 'credo',       en: 'credo' },
  sacramentos: { es: 'sacramentos',  en: 'sacraments' },
  moral:       { es: 'moral',       en: 'moral' },
  oracion:     { es: 'oracion',     en: 'prayer' },
};

const TYPES = {
  lesson:   { es: 'Lecciones',             en: 'Lessons' },
  workbook: { es: 'Cuadernos de Trabajo',   en: 'Workbooks' },
  guide:    { es: 'Guías del Catequista',   en: "Catechist's Guides" },
};

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
        { type: 'rich-text', name: 'bigQuestion', label: isES ? '🎯 Gran Pregunta' : '🎯 Big Question' },
        { type: 'rich-text', name: 'content', label: isES ? '📝 Contenido' : '📝 Content' },
        { type: 'rich-text', name: 'biblicalConnection', label: isES ? '📜 Conexión Bíblica' : '📜 Biblical Connection' },
        { type: 'rich-text', name: 'reflection', label: isES ? '💭 Reflexión' : '💭 Reflection' },
        { type: 'string', name: 'keyIdea', label: isES ? '✨ Idea Fuerza' : '✨ Key Idea', ui: { component: 'textarea' } },
        { type: 'rich-text', name: 'culturalWealth', label: isES ? '🖼️ Riqueza Cultural' : '🖼️ Cultural Wealth' },
      ],
    },
    { type: 'rich-text', name: 'body', label: isES ? 'Cuerpo completo' : 'Full body' },
  ];
}

function workbookFields(lang) {
  const isES = lang === 'es';
  return [
    { type: 'string', name: 'title', label: isES ? 'Título' : 'Title', isTitle: true, required: true },
    { type: 'string', name: 'cic', label: isES ? 'Referencia CIC' : 'CCC Reference' },
    { type: 'string', name: 'scripture', label: isES ? 'Lectura Bíblica' : 'Scripture Reading' },
    { type: 'rich-text', name: 'essentialRecall', label: isES ? '1. Recordando lo esencial' : '1. Essential Recall' },
    { type: 'rich-text', name: 'reflectionAndWriting', label: isES ? '2. Para reflexionar y escribir' : '2. Reflection & Writing' },
    { type: 'rich-text', name: 'practicalActivities', label: isES ? '3. Actividades prácticas' : '3. Practical Activities' },
    { type: 'string', name: 'memoryVerse', label: isES ? '4. Versículo para memorizar' : '4. Memory Verse', ui: { component: 'textarea' } },
    { type: 'string', name: 'memoryVerseRef', label: isES ? 'Referencia' : 'Verse Reference' },
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
    { type: 'rich-text', name: 'suggestedStructure', label: isES ? '2. Estructura sugerida' : '2. Suggested Structure' },
    { type: 'rich-text', name: 'catechistNotes', label: isES ? '3. Notas del catequista' : '3. Catechist Notes' },
    { type: 'rich-text', name: 'ageAdaptation', label: isES ? '4. Adaptación por edades' : '4. Age Adaptation' },
    { type: 'rich-text', name: 'supplementaryResources', label: isES ? '5. Recursos complementarios' : '5. Supplementary Resources' },
    { type: 'rich-text', name: 'difficultQuestions', label: isES ? '6. Preguntas difíciles' : '6. Difficult Questions' },
    { type: 'rich-text', name: 'catechistPrayer', label: isES ? '7. Oración del catequista' : '7. Catechist Prayer' },
  ];
}

// Generate 24 collections
const collections = [];

for (const [sectionKey, sectionLabels] of Object.entries(SECTIONS)) {
  for (const [typeKey, typeLabels] of Object.entries(TYPES)) {
    for (const lang of ['es', 'en']) {
      const sectionPath = SECTION_PATHS[sectionKey][lang];
      const name = `${sectionKey}_${typeKey}_${lang}`;
      const label = `${sectionLabels.en} — ${typeLabels.en} (${lang.toUpperCase()})`;

      collections.push({
        name,
        label,
        path: `content/${lang}/${sectionPath}`,
        format: 'md',
        match: typeKey === 'lesson'
          ? { exclude: ['*-workbook', '*-guide'] }
          : typeKey === 'workbook'
            ? { include: ['*-workbook'] }
            : { include: ['*-guide'] },
        ui: {
          allowedActions: { create: true, delete: true },
        },
        fields: typeKey === 'lesson'
          ? lessonFields(lang)
          : typeKey === 'workbook'
            ? workbookFields(lang)
            : guideFields(lang),
      });
    }
  }
}

// Site settings
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
    { type: 'string', name: 'siteTitle', label: 'Título del sitio (ES)' },
    { type: 'string', name: 'siteTitleEn', label: 'Site Title (EN)' },
    { type: 'string', name: 'footerText', label: 'Footer (ES)', ui: { component: 'textarea' } },
    { type: 'string', name: 'footerTextEn', label: 'Footer (EN)', ui: { component: 'textarea' } },
    { type: 'string', name: 'githubUrl', label: 'GitHub URL' },
  ],
});

export default defineConfig({
  clientId: process.env.TINA_CLIENT_ID || '',
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
});