# Darken Tattoo Studio — PRD

## Original problem statement
"Crie um site de portfólio para um tatuador, com galeria e formulário de solicitação de desenho."
User answers: Darken Tattoo Studio / Monte Carmelo MG; dark, editorial, artistic style.
**2026-10-12 (update):** usuário pediu que o site NÃO use banco de dados — apenas site estático.

## Architecture (static)
- React + Tailwind + framer-motion + lenis. Página única (`/`). Sem rotas, sem axios, sem backend.
- Formulário de solicitação monta o briefing e abre o WhatsApp do estúdio (`wa.me`) com a mensagem preenchida; fallback "enviar por e-mail" (`mailto:`). Referências (até 3 imagens) o cliente anexa na conversa.
- Dados do estúdio centralizados em `frontend/src/config.js` (`STUDIO.whatsapp`, `email`, `instagram`, `address`).
- `backend/server.py` é apenas um stub `/api/health` para o ambiente de preview — pode ser ignorado no deploy estático (`yarn build` → pasta `build/`).

## Core requirements
- Galeria com filtros por estilo + lightbox ("Quero algo nesse estilo" pré-seleciona o estilo no formulário)
- Formulário (nome, e-mail, WhatsApp, estilo, tamanho, local, orçamento, descrição) → WhatsApp / e-mail

## Implemented
- 2026-10-12: Hero cinético, marquee, About, galeria + lightbox, bento "O Ritual", formulário, footer, logo/favicon SVG.
- 2026-10-12: Conversão para site estático — removidos painel admin, JWT, MongoDB, upload de arquivos, axios e react-router. Verificado via Playwright: submit abre `api.whatsapp.com/send?phone=...&text=<briefing>`.

## Placeholders to replace
- `config.js`: `whatsapp` (5534999999999), `email`, `instagram`, `address`; About: [Nome do artista]; galeria usa fotos stock (Unsplash).

## Backlog
- P1: Substituir fotos stock da galeria por trabalhos reais (arquivos em `public/img`)
- P2: SEO/meta tags, depoimentos, FAQ/cuidados pós-tatuagem
