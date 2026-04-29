# AI Catechist Chatbot — Implementation Notes

## Overview
An AI-powered catechism Q&A chatbot integrated into the Catecismo Digital Astro project. Uses RAG (Retrieval-Augmented Generation) with CIC (Catechism of the Catholic Church) content for doctrinally accurate responses.

## Architecture

### Components
1. **API Endpoint** (`src/pages/api/chat.ts`)
   - Astro server endpoint handling POST requests
   - Implements RAG search over CIC content
   - Calls Ollama (local or cloud) or OpenAI for responses
   - Falls back between providers for reliability

2. **Svelte Chat Component** (`src/components/Chat.svelte`)
   - Island component loaded client-side
   - Bilingual (ES/EN) with locale detection
   - Message history, citations display, suggested questions
   - Styled with project CSS variables (vanilla CSS, no Tailwind)

3. **RAG Engine** (`src/lib/rag-search.js`)
   - Keyword-based semantic search
   - TF-IDF-like scoring with multi-field matching
   - Formats context for LLM consumption

4. **Data Files**
   - `src/data/cic-chunks.json` — RAG content chunks (535 chunks extracted)
   - `src/data/cic-embeddings.json` — Placeholder for future vector embeddings

5. **Demo Pages**
   - `src/pages/chat-demo.astro` — Spanish demo
   - `src/pages/en/chat-demo.astro` — English demo

## Configuration

### Astro Config Changes
- Added `@astrojs/svelte` integration
- Changed `output: 'server'` to enable API routes
- Added `svelte.config.js` for Svelte preprocessing

### Package Dependencies
```json
{
  "@astrojs/svelte": "^8.1.0",
  "astro": "^6.1.9",
  "svelte": "^5.55.5"
}
```

## Environment Variables
Create `.env` file for deployment:

```env
# Ollama (local or cloud)
OLLAMA_URL=http://localhost:11434
# or for cloud: OLLAMA_URL=https://your-ollama-instance

# OpenAI fallback (optional)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

## RAG Data Extraction
Content extracted from:
- `src/pages/es/credo/` (10 lessons)
- `src/pages/es/sacramentos/` (10 lessons)
- `src/pages/es/moral/` (12 lessons)
- `src/pages/es/oracion/` (5 lessons)

Each lesson parsed for:
- CIC references
- Scripture citations
- Section headings
- Paragraph content
- Blockquotes (teachings)
- Depth boxes (semilla, brotes, raiz, arbol)

Total: 535 searchable chunks

## AI System Prompt
The AI acts as a Catholic catechist with these constraints:
1. Always base answers on CIC
2. Cite paragraph numbers when teaching
3. Distinguish doctrine vs. opinion
4. Be warm and accessible
5. Never contradict defined Catholic doctrine

## Usage

### Development
```bash
npm run dev
# Visit: http://localhost:4321/catecismo-digital/chat-demo/
```

### Build
```bash
npm run build
# Deploy dist/ folder
```

## Deployment Notes

### Server-Side Requirements
- For `output: 'server'`, you need a hosting platform that supports SSR:
  - Vercel
  - Netlify (Edge Functions)
  - Node.js server
  - Deno Deploy
  - Cloudflare Workers (requires adapter)

### For Static Site (Current Setup)
If deploying to GitHub Pages (static only):
1. The `/api/chat` endpoint won't work
2. Options:
   - Move chat to a separate serverless function (Vercel/Netlify)
   - Use a client-side only implementation calling an external API
   - Switch to Astro hybrid mode with adapter

### Suggested Hybrid Setup for GitHub Pages
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  // ...existing config
  output: 'hybrid',  // Some pages static, some server
  integrations: [svelte()],
});
```

Then mark chat-demo.astro as server-rendered:
```astro
---
export const prerender = false;
---
```

## Localization
- Auto-detects locale from URL path (`/es/` vs `/en/`)
- All UI strings bilingual
- API accepts `language` parameter for system prompt

## Future Enhancements
1. Add actual vector embeddings (using transformers.js or API)
2. Persist chat history (localStorage)
3. Add voice input/output (Web Speech API)
4. Export conversations as PDF study guides
5. Integration with specific lesson pages (context-aware)

## Credits
- Catecismo Digital project by @jadrk040507
- AI Catechist powered by Ollama/OpenAI with CIC sources
- RAG search implementation using lesson content from the project
