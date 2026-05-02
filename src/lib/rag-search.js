// RAG Search Engine for CIC Content
// Simple keyword-based semantic search over CIC content chunks

const cicChunks = [];

// Simple TF-IDF-like scoring for keyword matching
function scoreChunk(chunk, query) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  const contentLower = chunk.content.toLowerCase();
  const titleLower = (chunk.title || '').toLowerCase();

  let score = 0;

  // Exact phrase match (highest)
  if (contentLower.includes(queryLower)) {
    score += 10;
  }
  if (titleLower.includes(queryLower)) {
    score += 8;
  }

  // Individual word matching
  for (const word of queryWords) {
    // In content
    const contentCount = (contentLower.match(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    score += contentCount * 2;

    // In title (higher weight)
    if (titleLower.includes(word)) {
      score += 5;
    }

    // In keywords
    if (chunk.keywords) {
      for (const kw of chunk.keywords) {
        if (kw.includes(word) || word.includes(kw)) {
          score += 3;
        }
      }
    }
  }

  // Boost for CIC references present
  if (queryLower.includes('cic') && chunk.cic) {
    const cicMatch = queryLower.match(/cic\s+(\d+)/);
    if (cicMatch && chunk.cic.includes(cicMatch[1])) {
      score += 15;
    }
  }

  // Boost for category match
  if (chunk.category) {
    const catWords = chunk.category.toLowerCase().split(/[\s-]+/);
    for (const cw of catWords) {
      if (queryWords.includes(cw)) {
        score += 4;
      }
    }
  }

  // Boost for type: topic_overview (more general/useful)
  if (chunk.type === 'topic_overview') {
    score += 2;
  }

  return score;
}

export function loadChunks(chunksData) {
  cicChunks.length = 0;
  cicChunks.push(...chunksData);
}

export function search(query, limit = 8) {
  if (!query || query.trim().length === 0) return [];
  if (cicChunks.length === 0) return [];

  const scored = cicChunks
    .map(chunk => ({
      ...chunk,
      score: scoreChunk(chunk, query),
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

// Format search results for LLM context
export function formatContext(results) {
  if (results.length === 0) return '';

  const uniqueSources = new Set();
  const contexts = results
    .filter(r => {
      const key = r.title || r.id;
      if (uniqueSources.has(key)) return false;
      uniqueSources.add(key);
      return true;
    })
    .map(r => {
      let ctx = '';
      if (r.cic) ctx += `[${r.cic}] `;
      if (r.type === 'quote') ctx += 'Cita: ';
      ctx += r.content;
      if (r.scripture) ctx += ` (${r.scripture})`;
      return ctx;
    });

  return contexts.join('\n\n---\n\n');
}
