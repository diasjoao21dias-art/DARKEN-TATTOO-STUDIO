# Deploy no Render — Site Estático (Darken Tattoo Studio)

Este projeto é 100% estático (React/CRA). Não há banco de dados nem backend.
O formulário de solicitação de desenho redireciona o cliente direto para o WhatsApp.

## Opção A — Deploy manual pelo painel do Render (mais simples)

1. Faça o push do projeto para um repositório no GitHub (use o botão **Save to Github** aqui no Emergent).
2. No Render, clique em **New +** → **Static Site** e conecte o repositório.
3. Preencha as configurações:
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn install && CI=false yarn build`
   - **Publish Directory:** `build`
4. Em **Advanced → Environment Variables**, adicione (opcional, recomendado):
   - `NODE_VERSION` = `20.18.0`
   - `CI` = `false`
5. Em **Redirects/Rewrites**, adicione uma regra (para o SPA funcionar em qualquer rota):
   - Source: `/*`  → Destination: `/index.html`  → Action: `Rewrite`
   (Já existe um arquivo `frontend/public/_redirects` com essa regra, então o Render aplica automaticamente.)
6. Clique em **Create Static Site**. Pronto.

## Opção B — Deploy automático via Blueprint (render.yaml)

Já existe o arquivo `render.yaml` na raiz do projeto com tudo configurado.

1. Faça o push do projeto para o GitHub.
2. No Render, clique em **New +** → **Blueprint** e selecione o repositório.
3. O Render lê o `render.yaml` e cria o Static Site automaticamente.

## Domínio personalizado
Depois do deploy, vá em **Settings → Custom Domains** no Render e aponte o domínio
do estúdio (ex.: darkentattoo.com) conforme as instruções de DNS do Render.

## Editar número do WhatsApp / contatos
Edite `frontend/src/config.js` (campo `whatsapp`, `email`, `instagram`) e faça novo deploy.
