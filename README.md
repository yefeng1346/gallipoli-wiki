# Gallipoli Wiki

A player-first field manual for Gallipoli, the Ottoman Fronts and the WW1 Game Series.

Built with Next.js App Router, React and CSS.

## Run locally

```bash
npm install
npm run dev
```

The production build is generated with:

```bash
npm run build
```

This is an independent fan-made project and is not affiliated with BlackMill Games.

## Locales

English is served at `/`. Turkish, German and French are available at `/tr/`, `/de/` and `/fr/`.

## Official update watch

The scheduled watcher checks public Steam and official game-page data and writes a review candidate when release status, price or official news changes:

```bash
npm run watch:official
```

The GitHub Actions workflow runs this check daily. It creates a review issue instead of publishing editorial changes automatically.
