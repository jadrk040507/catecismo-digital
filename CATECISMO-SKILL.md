# CATECISMO-SKILL.md — Catecismo Digital Platform

## Identity
- **Agente:** Catecismo Digital Agent (`session:catecismo-agent`)
- **Proyecto:** Plataforma abierta, pública y gratuita de catequesis católica
- **Stack:** Astro + Tailwind + Markdown + Pagefind + PDF generation
- **Repo:** GitHub (público)
- **URL futura:** Por definir

## Content Structure (per class)

### File: `credo/03-dios-padre.md`

```markdown
---
title: "Dios es Padre"
cic: "CIC 198-231"
scripture: "Mt 6:9, 1 Jn 4:8"
order: 3
---

## 🎯 Gran Pregunta

Si Dios es Padre, ¿por qué hay tanto dolor en el mundo?

## 📝 Contenido

[4-6 paragraphs, with CIC references embedded, subtitles]

## 📜 Conexión Bíblica

> "Cuando oréis, decid: Padre nuestro..." (Lc 11:2)

[Conexión de 2-3 líneas]

## 💭 Para Reflexionar

- ¿Qué imagen de Dios tengo? ¿Juez, policía, o Padre?
- [2-3 preguntas más]

## ✨ Idea Fuerza

"Conocer a Dios como Padre no es saber algo de Él, sino saber que Él existe para ti."

## 🖼️ Riqueza Cultural (opcional)

🎥 [La parábola del hijo pródigo — video recomendado](url)
```

### Multilevel: Front-end renderiza según el nivel
El Markdown tiene bloques marcados:
```markdown
:::semilla
[Versión para niños]
:::

:::brotes
[Versión para jóvenes]
:::

:::raiz
[Versión para adultos nuevos]
:::

:::arbol
[Versión para formados]
:::
```

## Downloadables

Generated at build time from same Markdown:
- `/print/workbook-03.pdf` → Student workbook
- `/print/guide-03.pdf` → Catechist guide

## Search
- Pagefind indexes all Markdown → full-text search client-side
- Filters: category (credo/sacramentos/moral/oracion), level, keywords

## Pipeline

```
CIC (source) → Agent EXTRACT → Agent COMPOSE → Agent WORKBOOK → Agent GUIDE → AGENT VALIDATE
```

Each module processed one at a time (1M token context = limited). No batch processing.

## Technology Choices

| Component | Choice | Why |
|-----------|--------|-----|
| SSG | Astro | Multi-idioma nativo, builds estático, rápido |
| CSS | Tailwind 4 | Minimalista, utility-first |
| Content | Markdown + MDX | Versionable, readable, transformable |
| Search | Pagefind | Client-side, no backend, ultra-rápido |
| i18n | Astro i18n | Archivos .es.md / .en.md side-by-side |
| PDF | Puppeteer/Playwright build step | Genera PDFs desde HTML renderizado |
| Hosting | GitHub Pages | Gratuito, CDN global |
| CI/CD | GitHub Actions | Build + deploy automático |

## 4 Niveles Pedagógicos

| Nivel | Edad | Enfoque | Estilo |
|-------|------|---------|--------|
| 🌱 Semilla | 7-12 | Narrativo-simbólico | Metáforas, dibujos, historias |
| 🌿 Brotes | 13-17 | Existencial-desafiante | Preguntas, retos, influencers santos |
| 🪴 Raíz | Adultos nuevos | Kerigmático-fundacional | FAQs, sin jerga, acogedor |
| 🌳 Árbol | Formados | Teológico-espiritual | SC, Padres, Doctores, profundidad |

## CIC Module Map (initial)

Start with PART 1: THE CREED

| # | Tema | CIC |
|---|------|-----|
| 1 | El Deseo de Dios | 27-30, 44-45 |
| 2 | La Revelación de Dios | 50-73 |
| 3 | Dios es Padre | 198-231 |
| 4 | Jesucristo, Dios y Hombre | 422-483 |
| 5 | La Encarnación | 484-511 |
| 6 | El Espíritu Santo | 683-747 |
| 7 | La Santísima Trinidad | 232-267 |
| 8 | Creación y Providencia | 279-324 |
| 9 | El Hombre y el Pecado | 355-421 |
| 10 | La Iglesia, Pueblo de Dios | 751-870 |

## Validation Criteria

Every class MUST pass:
- ✅ Doctrinal orthodoxy (no error, no ambiguity)
- ✅ Kerygmatic: does this lead to encounter with Christ?
- ✅ Pedagogically sound per level
- ✅ References to CIC + Scripture embedded
- ✅ Language: clear, warm, inviting, not academic

## Sources (trusted)

- vatican.va (Catechism, documents)
- Biblia (Nácar-Colunga or official translation)
- Vatican News (daily)
- Magisterium AI (for reference, NOT primary)
- EWTN, Catholic Answers (for supplementary clarity)
- USCCB (for English CCC references)
- CELAM (for Latin American context)
