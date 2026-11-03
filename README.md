# WiredTiger Animation

Animação em 3 atos (React + Framer Motion) que explica, de forma didática e com valor
para o negócio, por que o **WiredTiger** era rápido mas acoplava compute e storage — e como
o **Log Service**, o **Page Service** e o **Page Materializer** destravam o desacoplamento no
MongoDB Atlas.

Baseada no artigo [*The ground beneath the database*](https://www.mongodb.com/company/blog/engineering/ground-beneath-database)
e no estilo de motion dos [dashboards da Claude](https://claude.com/resources/articles/dashboards-and-motion).

Trilíngue: **PT · EN · ES** (seletor no topo; também aceita `?lang=pt|en|es`).

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5190
```

## Build

```bash
npm run build    # gera dist/
```

## Deploy

Publicado via GitHub Pages pelo workflow em `.github/workflows/deploy.yml` a cada push na `main`.

## Estrutura

- `src/App.jsx` — navegação, autoplay, seletor de idioma
- `src/scenes.jsx` — os 10 visuais animados
- `src/i18n.jsx` — todo o texto (PT/EN/ES), incluindo rótulos das animações
- `src/styles.css` — design system
