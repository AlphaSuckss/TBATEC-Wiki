# TBATEC Wiki

The wiki for TBATEC, a NeoForge 1.21.1 mod of *The Beginning After the End*.

Read it at https://alphasuckss.github.io/TBATEC-Wiki/.

The site is a static [SvelteKit](https://svelte.dev/) app, built to plain HTML and published to GitHub Pages.

## Where the pages come from

- `src/content/index.md` and `src/content/guide/` are written by hand: edit them here.
- Every chapter folder (`src/content/first_steps/`, `heritage/`, `beasts/` and the rest), `src/lib/chapters.js`, the item
  icons in `static/img/item/` and the portraits in `static/img/entity/` are generated from the mod's in-game guidebook,
  The Mage's Codex, so the wiki and the game say the same thing. Change the Codex, then generate them again.

## Develop

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

`npm run build` indexes the pages (`scripts/build-index.js`) and writes the site to `build/`.

## Deploy

A push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
