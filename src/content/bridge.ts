/**
 * Content Bridge — Reads TinaCMS-managed markdown content
 * and returns parsed frontmatter + body.
 * 
 * This is the bridge between TinaCMS's content/ directory
 * and Astro's page rendering. Content authors edit via TinaCMS,
 * and the data flows through here to the existing .astro pages.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, parse } from 'path';

const CONTENT_DIR = new URL('../content', import.meta.url).pathname;

export interface TinaLesson {
  title: string;
  order?: number;
  cic?: string;
  scripture?: string;
  pedagogical?: {
    bigQuestion?: string;
    content?: string;
    biblicalConnection?: string;
    reflection?: string;
    keyIdea?: string;
    culturalWealth?: string;
  };
  body?: string;
}

export interface TinaWorkbook {
  title: string;
  cic?: string;
  scripture?: string;
  essentialRecall?: string;
  reflectionAndWriting?: string;
  practicalActivities?: string;
  memoryVerse?: string;
  memoryVerseRef?: string;
  prayerForWeek?: string;
}

export interface TinaGuide {
  title: string;
  cic?: string;
  scripture?: string;
  classSummary?: string;
  suggestedStructure?: string;
  catechistNotes?: string;
  ageAdaptation?: string;
  supplementaryResources?: string;
  difficultQuestions?: string;
  catechistPrayer?: string;
}

interface ParsedDoc {
  frontmatter: Record<string, any>;
  body: string;
}

const SECTIONS = {
  es: ['credo', 'sacramentos', 'moral', 'oracion'],
  en: ['credo', 'sacraments', 'moral', 'prayer'],
} as const;

/**
 * Parse frontmatter from a markdown string
 */
function parseFrontmatter(content: string): ParsedDoc {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter: Record<string, any> = {};
  const fmLines = match[1].split('\n');

  for (const line of fmLines) {
    const colonMatch = line.match(/^(\w+):\s*(.+)$/);
    if (colonMatch) {
      let value: any = colonMatch[2].trim();
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Try number conversion
      const num = Number(value);
      if (!isNaN(num) && value !== '') {
        value = num;
      }
      frontmatter[colonMatch[1]] = value;
    }
  }

  return {
    frontmatter,
    body: match[2].trim(),
  };
}

/**
 * Determine content type from filename
 */
function contentType(filename: string): 'lesson' | 'workbook' | 'guide' {
  if (filename.includes('-workbook')) return 'workbook';
  if (filename.includes('-guide')) return 'guide';
  return 'lesson';
}

/**
 * Get the file name without extension
 */
function slug(filename: string): string {
  return parse(filename).name;
}

/**
 * Read a single content file
 */
function readContent(lang: string, section: string, filename: string): { slug: string; type: string } | null {
  const contentPath = join(CONTENT_DIR, lang, section, filename);
  if (!existsSync(contentPath)) return null;
  return {
    slug: slug(filename),
    type: contentType(filename),
  };
}

/**
 * List all content files for a given langue and section
 */
export function listContent(lang: 'es' | 'en', section: string): Array<{ slug: string; type: string; title: string; order: number }> {
  const items: Array<{ slug: string; type: string; title: string; order: number }> = [];
  const sectionDir = join(CONTENT_DIR, lang, section.toLowerCase());

  if (!existsSync(sectionDir)) return items;

  const files = readdirSync(sectionDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = readFileSync(join(sectionDir, file), 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    items.push({
      slug: slug(file),
      type: contentType(file),
      title: frontmatter.title || slug(file),
      order: frontmatter.order || 999,
    });
  }

  // Sort by order field
  items.sort((a, b) => a.order - b.order);
  return items;
}

/**
 * Read a specific lesson
 */
export function readLesson(lang: 'es' | 'en', section: string, lessonSlug: string): TinaLesson | null {
  const dir = join(CONTENT_DIR, lang, section);
  // Try exact match
  const exactPath = join(dir, `${lessonSlug}.md`);
  if (existsSync(exactPath)) {
    const content = readFileSync(exactPath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    return {
      title: frontmatter.title || lessonSlug,
      order: frontmatter.order,
      cic: frontmatter.cic,
      scripture: frontmatter.scripture,
      pedagogical: frontmatter.pedagogical,
      body,
    };
  }

  // Try numbered prefix: "01-deseo-de-dios" → match file "01-deseo-de-dios.md"
  if (existsSync(dir)) {
    const files = readdirSync(dir);
    const match = files.find(f => parse(f).name === lessonSlug && f.endsWith('.md'));
    if (match) {
      const content = readFileSync(join(dir, match), 'utf8');
      const { frontmatter, body } = parseFrontmatter(content);
      return {
        title: frontmatter.title || lessonSlug,
        order: frontmatter.order,
        cic: frontmatter.cic,
        scripture: frontmatter.scripture,
        pedagogical: frontmatter.pedagogical,
        body,
      };
    }
  }

  return null;
}

/**
 * Read a workbook
 */
export function readWorkbook(lang: 'es' | 'en', section: string, lessonSlug: string): TinaWorkbook | null {
  const dir = join(CONTENT_DIR, lang, section);
  const suffix = lang === 'es' ? '-workbook' : '-workbook';
  const fileName = `${lessonSlug}${suffix}.md`;

  const filePath = join(dir, fileName);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    return frontmatter as TinaWorkbook;
  }

  // Try matching any file with "-workbook" containing the slug
  if (existsSync(dir)) {
    const files = readdirSync(dir);
    const match = files.find(f => f.includes(lessonSlug) && f.includes('workbook'));
    if (match) {
      const c = readFileSync(join(dir, match), 'utf8');
      const { frontmatter } = parseFrontmatter(c);
      return frontmatter as TinaWorkbook;
    }
  }

  return null;
}

/**
 * Read a catechist guide
 */
export function readGuide(lang: 'es' | 'en', section: string, lessonSlug: string): TinaGuide | null {
  const dir = join(CONTENT_DIR, lang, section);
  const suffix = lang === 'es' ? '-guide' : '-guide';
  const fileName = `${lessonSlug}${suffix}.md`;

  const filePath = join(dir, fileName);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    return frontmatter as TinaGuide;
  }

  if (existsSync(dir)) {
    const files = readdirSync(dir);
    const match = files.find(f => f.includes(lessonSlug) && f.includes('guide'));
    if (match) {
      const c = readFileSync(join(dir, match), 'utf8');
      const { frontmatter } = parseFrontmatter(c);
      return frontmatter as TinaGuide;
    }
  }

  return null;
}

/**
 * Read raw markdown body for a lesson
 */
export function readLessonBody(lang: 'es' | 'en', section: string, lessonSlug: string): string | null {
  const lesson = readLesson(lang, section, lessonSlug);
  return lesson?.body || null;
}

/**
 * Map section name from URL to filesystem
 */
export function sectionToFs(section: string, lang: 'es' | 'en'): string {
  if (lang === 'en') {
    const map: Record<string, string> = {
      credo: 'credo',
      sacraments: 'sacramentos',
      moral: 'moral',
      prayer: 'oracion',
    };
    return map[section] || section;
  }
  return section;
}

/**
 * Check if TinaCMS content exists for a given path
 */
export function hasTinaContent(lang: string, section: string): boolean {
  const dir = join(CONTENT_DIR, lang, sectionToFs(section, lang as 'es' | 'en'));
  if (!existsSync(dir)) return false;
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.length > 0;
}

/**
 * Settings
 */
export function readSettings(): Record<string, string> | null {
  const settingsPath = join(CONTENT_DIR, 'settings', 'site.json');
  if (!existsSync(settingsPath)) return null;
  const content = readFileSync(settingsPath, 'utf8');
  const { frontmatter } = parseFrontmatter(content);
  return frontmatter as Record<string, string>;
}
