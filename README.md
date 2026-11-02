# alexanderdietz.eu

A one-page personal site.

Built with [Astro](https://astro.build). Static output, no client-side JavaScript.

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
├── data/site.ts             all content
└── styles/global.css        all styling (Inter, white background)
public/
├── CNAME                    alexanderdietz.eu
└── favicon.svg
```

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
