# Tactile Object Generator

React app for generating OpenSCAD code for tactile cards and pocket-orbit objects.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

## GitHub Actions

- `.github/workflows/ci.yml`
  - Lint
  - Prettier format check
  - Production build
  - Playwright smoke test

- `.github/workflows/deploy-pages.yml`
  - Deploys to GitHub Pages on pushes to `main`

## GitHub Pages setup

1. Push to `main`.
2. In GitHub repo settings, set **Pages** source to **GitHub Actions**.
3. The deploy workflow will publish `dist/`.
