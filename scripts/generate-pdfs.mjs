import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const PAGES = [
  { url: '/es/credo/01-deseo-de-dios-workbook/', pdf: 'workbook-01-deseo-de-dios.pdf' },
  { url: '/es/credo/01-deseo-de-dios-guide/', pdf: 'guide-01-deseo-de-dios.pdf' },
];

async function generatePDFs() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const outDir = path.join(distDir, 'pdf');
  fs.mkdirSync(outDir, { recursive: true });

  for (const page of PAGES) {
    const filePath = path.join(distDir, page.url.replace(/\/$/, ''), 'index.html');
    if (!fs.existsSync(filePath)) {
      console.log(`[PDF] SKIP — ${filePath} not found`);
      continue;
    }
    const htmlPage = await browser.newPage();
    await htmlPage.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    const pdfPath = path.join(outDir, page.pdf);
    await htmlPage.pdf({
      path: pdfPath,
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });
    console.log(`[PDF] ✓ ${page.pdf} (${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB)`);
    await htmlPage.close();
  }
  await browser.close();
}

generatePDFs().catch((err) => {
  console.error('[PDF] Error:', err);
  process.exit(1);
});
