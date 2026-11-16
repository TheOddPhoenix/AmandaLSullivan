# Amanda Sullivan portfolio

Static GitHub Pages portfolio. Existing photo originals and full-size links are retained; responsive WebP display variants live in `assets/images/responsive/`.

## Build and verify

Use Node.js and npm:

```
npm ci
npm run build
npm run check
```

Commit the compiled `assets/css/site.css` with changes. GitHub Pages serves the static files directly; no runtime CSS compiler is required.

Preview from the repository root using a static HTTP server. Check mobile navigation, photo dialogs, article links, PDF download, video fallback links, and page layouts before publishing. After pushing, confirm that GitHub Pages deployment succeeds and inspect the actual public URL.

The downloadable résumé is the supplied `Amanda_Sullivan_Universal_Resume_2026.pdf`. Update both that file and online professional facts together. Preserve the distinction between combined social-channel followers and cumulative blog readers.
