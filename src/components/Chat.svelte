<script lang="ts">
  export let locale = 'es';
  export let basePath = '/catecismo-digital';

  interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    timestamp: Date;
  }

  interface Citation {
    cic?: string;
    scripture?: string;
    title?: string;
    category?: string;
  }

  let messages: Message[] = [];
  let inputValue = '';
  let isLoading = false;
  let error = '';
  let chatContainer: HTMLDivElement;

  const suggestions = locale === 'es' ? [
    '¿Por qué el deseo de Dios está inscrito en el corazón humano?',
    '¿Qué es la revelación divina?',
    '¿Cómo se manifiesta la Santísima Trinidad?',
    '¿Qué nos dice el CIC sobre los sacramentos?',
    '¿Cuál es el sentido de la vida humana?',
  ] : [
    'Why is the desire for God written on the human heart?',
    'What is divine revelation?',
    'How is the Holy Trinity manifested?',
    'What does the CCC teach about the sacraments?',
    'What is the meaning of human life?',
  ];

  const translations = {
    es: {
      placeholder: 'Haz una pregunta sobre la fe...',
      send: 'Enviar',
      loading: 'El catequista está pensando...',
      welcome: '¡Bienvenido! Soy tu catequista digital. Pregúntame lo que quieras sobre la fe católica.',
      welcomeSub: 'Basado en el Catecismo de la Iglesia Católica.',
      error: 'Lo siento, hubo un error. Intenta de nuevo.',
      tryAgain: 'Reintentar',
      clear: 'Nueva conversación',
      poweredBy: 'Impulsado por IA con fuentes del CIC',
    },
    en: {
      placeholder: 'Ask a question about the faith...',
      send: 'Send',
      loading: 'The catechist is thinking...',
      welcome: 'Welcome! I am your digital catechist. Ask me anything about the Catholic faith.',
      welcomeSub: 'Based on the Catechism of the Catholic Church.',
      error: 'Sorry, there was an error. Please try again.',
      tryAgain: 'Try again',
      clear: 'New conversation',
      poweredBy: 'Powered by AI with CCC sources',
    },
  };

  $: t = translations[locale as keyof typeof translations] || translations.es;

  function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  async function sendMessage() {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    messages = [...messages, userMsg];
    inputValue = '';
    isLoading = true;
    error = '';

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 10);

    try {
      const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${basePath}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: locale,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response || t.error,
        citations: data.citations || [],
        timestamp: new Date(),
      };
      messages = [...messages, assistantMsg];
    } catch (err) {
      console.error('Chat error:', err);
      error = t.error;
    } finally {
      isLoading = false;
      // Scroll again after response
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 10);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function useSuggestion(text: string) {
    inputValue = text;
    sendMessage();
  }

  function clearChat() {
    messages = [];
    error = '';
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatCitations(citations: Citation[]): string {
    const refs: string[] = [];
    for (const c of citations) {
      if (c.cic) refs.push(c.cic);
      if (c.scripture) refs.push(c.scripture);
    }
    return [...new Set(refs)].slice(0, 3).join(' • ');
  }
</script>

<div class="chat-container">
  <!-- Header -->
  <div class="chat-header">
    <div class="chat-header__icon">💬</div>
    <div class="chat-header__info">
      <h3 class="chat-header__title">
        {#if locale === 'es'}
          Catequista Digital
        {:else}
          Digital Catechist
        {/if}
      </h3>
      <span class="chat-header__subtitle">{t.poweredBy}</span>
    </div>
    {#if messages.length > 0}
      <button class="chat-header__clear" on:click={clearChat} title={t.clear}>
        ✕
      </button>
    {/if}
  </div>

  <!-- Messages -->
  <div class="chat-messages" bind:this={chatContainer}>
    {#if messages.length === 0}
      <div class="chat-welcome">
        <div class="chat-welcome__icon">📖</div>
        <p class="chat-welcome__text">{t.welcome}</p>
        <p class="chat-welcome__sub">{t.welcomeSub}</p>

        <div class="chat-suggestions">
          {#each suggestions as suggestion}
            <button
              class="chat-suggestion"
              on:click={() => useSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      {#each messages as msg (msg.id)}
        <div class="chat-message chat-message--{msg.role}">
          <div class="chat-message__avatar">
            {msg.role === 'user' ? '👤' : '🤖'}
          </div>
          <div class="chat-message__content">
            <div class="chat-message__bubble">
              {#if msg.role === 'assistant'}
                {@html msg.content
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/<p><\/p>/g, '')
                  .replace(/CIC (\d+)/g, '<span class="cic-ref">CIC $1</span>')
                }
              {:else}
                {msg.content}
              {/if}
            </div>
            <{#if msg.citations && msg.citations.length > 0}
              <div class="chat-message__citations">
                📖 {formatCitations(msg.citations)}
              </div>
            {/if}
            <span class="chat-message__time">{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      {/each}

      {#if isLoading}
        <div class="chat-message chat-message--assistant">
          <div class="chat-message__avatar">🤖</div>
          <div class="chat-message__content">
            <div class="chat-message__bubble chat-message__bubble--loading">
              <span class="loading-dots">{t.loading}</span>
            </div>
          </div>
        </div>
      {/if}

      {#if error}
        <div class="chat-error">
          <span class="chat-error__icon">⚠️</span>
          <span class="chat-error__text">{error}</span>
          <button class="chat-error__retry" on:click={sendMessage}>
            {t.tryAgain}
          </button>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Input -->
  <div class="chat-input-container">
    <div class="chat-input">
      <textarea
        class="chat-input__field"
        bind:value={inputValue}
        on:keydown={handleKeydown}
        placeholder={t.placeholder}
        rows="1"
      ></textarea>
      <button
        class="chat-input__send"
        on:click={sendMessage}
        disabled={!inputValue.trim() || isLoading}
        aria-label={t.send}
      >
        ➤
      </button>
    </div>
    <div class="chat-input__disclaimer">
      {locale === 'es'
        ? 'Las respuestas son generadas por IA y pueden contener errores. Consulta el Catecismo oficial para verificación.'
        : 'Responses are AI-generated and may contain errors. Consult the official Catechism for verification.'}
    </div>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    max-width: 680px;
    margin: 0 auto;
    background: var(--bg-card, #ffffff);
    border: 1px solid var(--border, #e5e0d6);
    border-radius: var(--radius, 12px);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--gold-light, #f5edd6);
    border-bottom: 1px solid var(--border, #e5e0d6);
  }

  .chat-header__icon {
    font-size: 1.5rem;
  }

  .chat-header__info {
    flex: 1;
  }

  .chat-header__title {
    font-family: var(--serif, 'Source Serif 4', Georgia, serif);
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: var(--accent-dark, #8b6914);
  }

  .chat-header__subtitle {
    font-size: 0.72rem;
    color: var(--text-muted, #8a8a8a);
  }

  .chat-header__clear {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border, #e5e0d6);
    border-radius: 50%;
    background: var(--bg-card, #ffffff);
    color: var(--text-soft, #5a5a5a);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .chat-header__clear:hover {
    border-color: var(--accent, #b8860b);
    color: var(--accent, #b8860b);
  }

  .chat-messages {
    flex: 1;
    min-height: 320px;
    max-height: 520px;
    overflow-y: auto;
    padding: 16px;
    background: var(--bg, #faf9f6);
  }

  .chat-welcome {
    text-align: center;
    padding: 40px 20px;
  }

  .chat-welcome__icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .chat-welcome__text {
    font-family: var(--serif, 'Source Serif 4', Georgia, serif);
    font-size: 1.1rem;
    color: var(--text, #1a1a1a);
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .chat-welcome__sub {
    font-size: 0.85rem;
    color: var(--text-muted, #8a8a8a);
    margin-bottom: 24px;
  }

  .chat-suggestions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 420px;
    margin: 0 auto;
  }

  .chat-suggestion {
    text-align: left;
    padding: 10px 14px;
    background: var(--bg-card, #ffffff);
    border: 1px solid var(--border, #e5e0d6);
    border-radius: var(--radius-sm, 6px);
    font-size: 0.85rem;
    color: var(--text, #1a1a1a);
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1.4;
  }

  .chat-suggestion:hover {
    border-color: var(--accent, #b8860b);
    background: var(--gold-light, #f5edd6);
  }

  .chat-message {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .chat-message--user {
    flex-direction: row-reverse;
  }

  .chat-message__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gold-light, #f5edd6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .chat-message--user .chat-message__avatar {
    background: var(--accent, #b8860b);
  }

  .chat-message__content {
    max-width: calc(100% - 50px);
    display: flex;
    flex-direction: column;
  }

  .chat-message--user .chat-message__content {
    align-items: flex-end;
  }

  .chat-message__bubble {
    padding: 10px 14px;
    border-radius: var(--radius-sm, 6px);
    font-size: 0.92rem;
    line-height: 1.6;
    background: var(--bg-card, #ffffff);
    border: 1px solid var(--border, #e5e0d6);
  }

  .chat-message--user .chat-message__bubble {
    background: var(--gold-light, #f5edd6);
    border-color: var(--gold-light, #f5edd6);
  }

  .chat-message__bubble--loading {
    background: transparent;
    border: none;
  }

  .loading-dots {
    color: var(--text-muted, #8a8a8a);
    font-size: 0.85rem;
  }

  .chat-message__bubble :global(p) {
    margin: 0 0 10px 0;
  }

  .chat-message__bubble :global(p:last-child) {
    margin-bottom: 0;
  }

  .chat-message__bubble :global(.cic-ref) {
    background: var(--gold-light, #f5edd6);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--accent-dark, #8b6914);
  }

  .chat-message__citations {
    font-size: 0.7rem;
    color: var(--text-muted, #8a8a8a);
    margin-top: 4px;
  }

  .chat-message__time {
    font-size: 0.68rem;
    color: var(--text-muted, #8a8a8a);
    margin-top: 2px;
  }

  .chat-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    margin: 8px 16px;
    background: #fff3e0;
    border: 1px solid #ffcc80;
    border-radius: var(--radius-sm, 6px);
  }

  .chat-error__icon {
    font-size: 1rem;
  }

  .chat-error__text {
    flex: 1;
    font-size: 0.85rem;
    color: #e65100;
  }

  .chat-error__retry {
    padding: 6px 12px;
    background: var(--accent, #b8860b);
    color: white;
    border: none;
    border-radius: var(--radius-sm, 6px);
    font-size: 0.78rem;
    cursor: pointer;
  }

  .chat-error__retry:hover {
    background: var(--accent-dark, #8b6914);
  }

  .chat-input-container {
    padding: 14px 16px;
    background: var(--bg-card, #ffffff);
    border-top: 1px solid var(--border, #e5e0d6);
  }

  .chat-input {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .chat-input__field {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid var(--border, #e5e0d6);
    border-radius: var(--radius-sm, 6px);
    font-family: var(--sans, 'Inter', sans-serif);
    font-size: 0.9rem;
    line-height: 1.5;
    resize: none;
    background: var(--bg, #faf9f6);
    color: var(--text, #1a1a1a);
    min-height: 42px;
    max-height: 120px;
  }

  .chat-input__field:focus {
    outline: none;
    border-color: var(--accent, #b8860b);
  }

  .chat-input__send {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    background: var(--accent, #b8860b);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .chat-input__send:hover:not(:disabled) {
    background: var(--accent-dark, #8b6914);
  }

  .chat-input__send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chat-input__disclaimer {
    text-align: center;
    font-size: 0.68rem;
    color: var(--text-muted, #8a8a8a);
    margin-top: 8px;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    .chat-container {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    .chat-messages {
      min-height: 280px;
    }

    .chat-suggestion {
      font-size: 0.8rem;
      padding: 8px 12px;
    }
  }
</style>
