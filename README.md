# alexanderdietz.eu

A one-page landing site. Minimal editorial on the surface, with easter eggs layered underneath.

Built with [Astro](https://astro.build). Static output, no client framework — the only JavaScript
shipped is the easter-egg module (~8 kB, 3.4 kB gzipped).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build into dist/
npm run preview  # serve the built output
```

## Content

All copy and links live in `src/data/site.ts`. Edit that, not the markup.

## Structure

```
src/
├── pages/index.astro        the page
├── components/
│   ├── Footnote.astro       superscript marker + margin note
│   ├── LinkIndex.astro      the masthead-style link index
│   └── Rule.astro           the draggable rule under the name
├── data/site.ts             all content
├── scripts/eggs.ts          every interactive easter egg
└── styles/global.css        tokens, layout, egg styling
public/
├── CNAME                    alexanderdietz.eu
└── favicon.svg
```

## The easter eggs

Layered so the page stays calm for someone who just wants the links.

**Tier 1 — free**
- A message in the devtools console
- A note in the HTML source

**Tier 2 — mild curiosity**
- Superscript footnotes on the tagline and index entries, opening as margin notes
- The rule under the name is a slider. Drag it (or focus it and use arrow keys):
  left → letterpress, right → the web circa 1996. Springs back on release.

**Tier 3 — deliberate hunting**
- Konami code (`↑↑↓↓←→←→BA`) → **peer review mode**: the page annotates itself with red-pen
  margin comments and a MAJOR REVISIONS stamp. Press again to withdraw.
- Type anywhere: `mun` (gavel + "Motion carried"), `sudo`, `delft`

Every animation respects `prefers-reduced-motion`. Nothing is required to use the page.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages.

**One-time setup:**

1. **Repo → Settings → Pages → Source: GitHub Actions**
2. **Settings → Pages → Custom domain:** `alexanderdietz.eu`, then tick **Enforce HTTPS**
   (available once the certificate is issued, usually within an hour).
3. **DNS at your registrar** — apex `A` records:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   and `AAAA`:

   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

   plus a `CNAME` for `www` → `alex-dietz.github.io`.

   Confirm these against
   [GitHub's current documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
   before relying on them — GitHub has changed the IPs before.

`public/CNAME` is committed, so the custom domain survives each redeploy.
