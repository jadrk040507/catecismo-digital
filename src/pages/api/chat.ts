// AI Catechist Chatbot — API Endpoint
// POST /api/chat — accepts { message, language, history } and returns { response, citations }

import fs from 'fs';
import path from 'path';
import { loadChunks, search, formatContext } from '../../lib/rag-search';

const chunksPath = path.resolve('src/data/cic-chunks.json');

// Load chunks on cold start
let chunksLoaded = false;
function ensureChunks() {
  if (!chunksLoaded) {
    try {
      const data = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
      loadChunks(data);
      chunksLoaded = true;
    } catch (e) {
      console.error('Failed to load CIC chunks:', e.message);
    }
  }
}

// System prompts for the AI catechist
function getSystemPrompt(language) {
  if (language === 'en') {
    return `You are an AI Catholic catechist trained on the Catechism of the Catholic Church (CCC). Your role is to answer questions about the Catholic faith with doctrinal accuracy, clarity, and charity.

CORE RULES:
1. ALWAYS base your answers on the Catechism of the Catholic Church and Sacred Scripture
2. When providing teaching, cite the relevant CIC paragraph numbers
3. If you don't know something or it's not in the Catechism, say so honestly
4. Distinguish between defined doctrine, theological opinion, and pious devotion
5. Be warm and inviting — you're a catechist, not a textbook
6. Adjust depth based on the question's complexity
7. Never contradict defined Catholic doctrine
8. Use the provided context below for doctrinally accurate answers
9. If the question is outside Catholic teaching (science, politics, etc.), respond with what the Church teaches but acknowledge other views where appropriate

CONTEXT FROM THE CATECHISM:
{context}

Respond in English. Keep responses clear, theologically sound, and accessible.`;
  }

  return `Eres un catequista católico entrenado en el Catecismo de la Iglesia Católica (CIC). Tu función es responder preguntas sobre la fe católica con precisión doctrinal, claridad y caridad.

REGLAS FUNDAMENTALES:
1. Siempre basa tus respuestas en el Catecismo de la Iglesia Católica y la Sagrada Escritura
2. Al enseñar, cita los números del CIC relevantes
3. Si no sabes algo o no está en el Catecismo, dilo con honestidad
4. Distingue entre doctrina definida, opinión teológica y devoción piadosa
5. Sé cálido y accesible — eres un catequista, no un libro de texto
6. Ajusta la profundidad según la complejidad de la pregunta
7. Nunca contradigas la doctrina católica definida
8. Usa el contexto del Catecismo que se proporciona abajo para respuestas doctrinalmente precisas
9. Si la pregunta es sobre temas fuera de la enseñanza católica (ciencia, política, etc.), responde con lo que la Iglesia enseña pero reconoce otras perspectivas cuando sea apropiado

CONTEXTO DEL CATECISMO:
{context}

Responde en español. Mantén las respuestas claras, teológicamente sólidas y accesibles.`;
}

// Call Ollama (local or cloud) for the AI response
async function callOllama(model, messages, signal) {
  const baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: 0.3,
        top_p: 0.9,
        num_predict: 2048,
      },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || '';
}

// Fallback: call OpenAI-compatible API
async function callOpenAI(messages, signal) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.3,
      max_tokens: 2048,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export const prerender = false;

export async function POST({ request }) {
  ensureChunks();

  try {
    const body = await request.json();
    const { message, language = 'es', history = [] } = body;

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required', response: '' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Search CIC content for relevant context (RAG)
    const searchResults = search(message, 6);
    const context = formatContext(searchResults);

    // Build citations from search results
    const citations = searchResults
      .filter(r => r.cic || r.scripture)
      .slice(0, 4)
      .map(r => ({
        cic: r.cic || '',
        scripture: r.scripture || '',
        title: r.title || '',
        category: r.category || '',
      }));

    // 2. Build the conversation
    const systemPrompt = getSystemPrompt(language).replace('{context}', context || '(No specific CIC context found for this topic — respond from general catechism knowledge.)');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({
        role: h.role || 'user',
        content: h.content || h.message || '',
      })),
      { role: 'user', content: message },
    ];

    // 3. Try Ollama first, fall back to OpenAI
    let response = '';
    let providerUsed = '';

    try {
      // Try local Ollama
      response = await callOllama('qwen2.5:1.5b', messages, AbortSignal.timeout(30000));
      providerUsed = 'ollama-qwen2.5:1.5b';
    } catch (ollamaErr) {
      console.warn('Ollama fallback:', ollamaErr.message);
      try {
        // Fallback to cloud Ollama
        response = await callOllama('kimi-k2.5:cloud', messages, AbortSignal.timeout(45000));
        providerUsed = 'ollama-kimi-k2.5:cloud';
      } catch (kimiErr) {
        console.warn('Kimi fallback:', kimiErr.message);
        try {
          // Last resort: OpenAI
          response = await callOpenAI(messages, AbortSignal.timeout(30000));
          providerUsed = 'openai';
        } catch (openaiErr) {
          console.error('All providers failed:', openaiErr.message);
          return new Response(
            JSON.stringify({
              response: language === 'en'
                ? 'I apologize, but I\'m having trouble connecting to the AI service. Please try again in a moment.'
                : 'Lo siento, pero estoy teniendo problemas para conectar con el servicio de IA. Por favor intenta de nuevo en un momento.',
              citations: [],
              error: 'All AI providers unavailable',
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // 4. Return response
    return new Response(
      JSON.stringify({
        response,
        citations,
        provider: providerUsed,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        response: 'An unexpected error occurred. Please try again.',
        citations: [],
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
