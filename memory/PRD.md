# Darken Tattoo Studio — PRD

## Original problem statement
"Crie um site de portfólio para um tatuador, com galeria e formulário de solicitação de desenho."
User answers: Darken Tattoo Studio / Monte Carmelo MG; requests saved in DB + simple password admin panel; up to 3 reference images upload; dark, editorial, artistic style.

## Architecture
- FastAPI + MongoDB (design_requests, users, login_attempts); Emergent Object Storage for reference images (served only via authed backend route).
- JWT (Bearer, 12h) single admin seeded from .env (ADMIN_EMAIL/ADMIN_PASSWORD), brute-force lockout.
- React + Tailwind + framer-motion + lenis. Routes: `/` (site), `/admin` (panel).

## User personas
- Client wanting a custom tattoo (browses gallery, sends briefing).
- Tattoo artist (reviews requests, updates status).

## Core requirements
- Portfolio gallery with style filters + lightbox ("Quero algo nesse estilo" prefills form)
- Design request form (name, email, WhatsApp, style, size, placement, budget, description, ≤3 images ≤8MB)
- Admin panel: login, list/filter requests, view reference images, change status

## Implemented (2026-10-12)
- Kinetic hero (masked line reveal, ash particle canvas, 3D tilt spotlight frame, scroll parallax), slow marquee, About, filterable gallery + lightbox, 4-step bento "O Ritual", request form, footer, SVG logo/favicon
- Backend endpoints all verified via curl + UI (desktop 1440 & mobile 390)

## Placeholders to replace
- [Nome do artista], [Endereço do estúdio], [@instagram], [WhatsApp]; gallery uses stock photos (Unsplash) as placeholders for real work

## Backlog
- P1: Replace stock gallery with real works (admin-managed gallery upload)
- P1: Email/WhatsApp notification on new request
- P2: Testimonials, FAQ/aftercare page, booking calendar
