/**
 * TinaCMS Content Extractor
 * 
 * Extracts content from existing .astro lesson files into Tina-managed markdown files.
 * Run this after setting up TinaCMS to migrate existing lessons to the new content structure.
 * 
 * Usage: node scripts/extract-tina-content.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { globSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SECTIONS = ['credo', 'sacramentos', 'moral', 'oracion'];
const LANGS = ['es', 'en'];
const SECTION_MAP = {
  'es': { credo: 'credo', sacramentos: 'sacramentos', moral: 'moral', oracion: 'oracion' },
  'en': { credo: 'credo', sacraments: 'sacramentos', moral: 'moral', prayer: 'oracion' },
};

function slugToTitle(slug) {
  return slug
    .replace(/^(\d+)-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { frontmatter: {}, rest: content };
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const kv = line.match(/^\s*(\w+)\s*=\s*"([^"]*)"\s*$/);
    if (kv) {
      frontmatter[kv[1]] = kv[2];
    }
    // Also try inline const pattern
    const cv = line.match(/^\s*const\s+(\w+)\s*=\s*"([^"]*)"\s*;/);
    if (cv) {
      frontmatter[cv[1]] = cv[2];
    }
  }
  return { frontmatter, rest: content.slice(match[0].length) };
}

function extractLessonContent(content) {
  // Extract text from between LessonLayout tags
  const bodyMatch = content.match(/<LessonLayout[\s\S]*?>([\s\S]*?)<\/LessonLayout>/);
  if (!bodyMatch) return '';
  
  let body = bodyMatch[1];
  
  // Remove script tags and style blocks
  body = body.replace(/<script[\s\S]*?<\/script>/g, '');
  body = body.replace(/<style[\s\S]*?<\/style>/g, '');
  
  // Extract HTML sections
  const sections = [];
  const sectionRegex = /<section\s+class="content">([\s\S]*?)<\/section>/g;
  let match;
  while ((match = sectionRegex.exec(body)) !== null) {
    sections.push(match[1].trim());
  }
  
  // Extract depth-boxes
  const depthBoxes = [];
  const depthRegex = /<div\s+class="depth-box\s+depth-box--(\w+)">([\s\S]*?)<\/div>/g;
  while ((match = depthRegex.exec(body)) !== null) {
    depthBoxes.push({ type: match[1], content: match[2].trim() });
  }
  
  return {
    fullBody: body,
    sections,
    depthBoxes,
  };
}

function extractCicRefs(content) {
  const matches = content.match(/CIC\s+[\d,\-\s]+/g);
  return matches || [];
}

function extractScripture(content) {
  const match = content.match(/\bcitation\b[^)]+/);
  return match ? match[0] : '';
}

function convertToMarkdown(frontmatter, sections, depthBoxes) {
  let md = '---\n';
  for (const [key, val] of Object.entries(frontmatter)) {
    if (val) md += `${key}: "${val.replace(/"/g, '\\"')}"\n`;
  }
  md += '---\n\n';
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    // Extract heading
    const headingMatch = section.match(/<h2>(.*?)<\/h2>/);
    const heading = headingMatch ? headingMatch[1] : `Section ${i + 1}`;
    
    md += `## ${heading}\n\n`;
    
    // Convert HTML to basic markdown
    let text = section
      .replace(/<h[23]>.*?<\/h[23]>/g, '') // Remove existing headings (already added)
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<blockquote>[\s\S]*?<p>(.*?)<cite>(.*?)<\/cite><\/p>[\s\S]*?<\/blockquote>/g, '> $1\n> -- $2\n')
      .replace(/<blockquote>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/blockquote>/g, '> $1\n')
      .replace(/<div[^>]*>[\s\S]*?<\/div>/g, '') // Remove divs (they'll be reconstructed)
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<ul>[\s\S]*?<\/ul>/g, '')
      .replace(/<ol>[\s\S]*?<\/ol>/g, '')
      .replace(/<li>(.*?)<\/li>/g, '- $1\n')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&iquest;/g, '¿')
      .replace(/&mdash;/g, '—')
      .replace(/&laquo;/g, '«')
      .replace(/&raquo;/g, '»')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ntilde;/g, 'ñ')
      .replace(/&Aacute;/g, 'Á')
      .replace(/&Eacute;/g, 'É')
      .replace(/&Iacute;/g, 'Í')
      .replace(/&Oacute;/g, 'Ó')
      .replace(/&Uacute;/g, 'Ú')
      .replace(/&Ntilde;/g, 'Ñ')
      .trim();
    
    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n');
    
    if (text) {
      md += text + '\n\n';
    }
    
    // Add depth boxes that belong to this section
    // (This is approximate - depth boxes don't have strong section markers)
    if (i === 0) {
      for (const db of depthBoxes) {
        md += `:::${db.type}\n${db.content.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim()}\n:::\n\n`;
      }
    }
  }
  
  return md.trim() + '\n';
}

export function extractAll() {
  console.log('🔍 Scanning for .astro files...');
  
  const files = {};
  let total = 0;
  
  for (const lang of LANGS) {
    files[lang] = {};
    for (const section of SECTIONS) {
      files[lang][section] = [];
    }
    
    const dir = path.join(ROOT, 'src', 'pages', lang);
    if (!existsSync(dir)) continue;
    
    const entries = existsSync(dir) ? require('fs').readdirSync(dir) : [];
    for (const section of entries) {
      const sectionDir = path.join(dir, section);
      if (!existsSync(sectionDir)) continue;
      const stat = existsSync(sectionDir) ? require('fs').statSync(sectionDir) : null;
      if (!stat || !stat.isDirectory()) continue;
      
      // Map section name (EN uses different names)
      let mappedSection = section;
      if (lang === 'en') {
        const sectionMap = {
          'credo': 'credo',
          'sacraments': 'sacramentos',
          'moral': 'moral',
          'prayer': 'oracion',
        };
        mappedSection = sectionMap[section] || section;
      }
      if (!files[lang][mappedSection]) files[lang][mappedSection] = [];
      
      const files2 = require('fs').readdirSync(sectionDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');
      
      for (const file of files2) {
        const filePath = path.join(sectionDir, file);
        const content = readFileSync(filePath, 'utf8');
        const { frontmatter } = extractFrontmatter(content);
        
        // Determine type
        const isWorkbook = file.includes('-workbook');
        const isGuide = file.includes('-guide');
        const type = isWorkbook ? 'workbook' : isGuide ? 'guide' : 'lesson';
        
        files[lang][mappedSection].push({
          file,
          path: filePath,
          type,
          title: frontmatter.title || slugToTitle(file.replace(/\.astro$/, '')),
          cic: frontmatter.lessonRef || frontmatter.cic || '',
          scripture: frontmatter.lessonScripture || frontmatter.scripture || '',
        });
        total++;
      }
    }
  }
  
  return { files, total };
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = extractAll();
  console.log(`\n📊 Found ${result.total} content files`);
  
  for (const lang of Object.keys(result.files)) {
    for (const section of Object.keys(result.files[lang])) {
      const items = result.files[lang][section];
      const lessons = items.filter(i => i.type === 'lesson').length;
      const workbooks = items.filter(i => i.type === 'workbook').length;
      const guides = items.filter(i => i.type === 'guide').length;
      console.log(`  ${lang}/${section}: ${lessons} lessons, ${workbooks} workbooks, ${guides} guides`);
    }
  }
}
