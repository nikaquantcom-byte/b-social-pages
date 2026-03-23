# B-Social Pages

Cloudflare Pages deployment for [b-social.net](https://b-social.net)

## Projekt Struktur

```
b-social-pages/
|-- public/                  # Deploy directory (upload til Cloudflare Pages)
|   |-- css/                 # Stylesheets
|   |-- js/                  # JavaScript filer
|   |-- icons/               # PWA ikoner (alle stoerrelser)
|   |-- _headers             # Cloudflare Pages custom headers
|   |-- _redirects           # Cloudflare Pages redirects (SPA fallback)
|   |-- index.html           # Hoved HTML fil (SPA entry point)
|   |-- manifest.json        # PWA manifest
|   |-- sw.js                # Service Worker
|-- .gitignore
|-- README.md
```

## Deployment

Dette projekt deployes til Cloudflare Pages.

**Build output directory:** `public/`

**Domaener:**
- b-social.net
- www.b-social.net
- b-social.pages.dev

## Vigtige Cloudflare Pages Filer

- `_headers` - Custom HTTP headers (security, caching)
- `_redirects` - SPA fallback routing
- `manifest.json` - PWA konfiguration
- `sw.js` - Service Worker til offline support

## Naeste Skridt

- [ ] Kopier eksisterende index.html indhold fra live deployment
- [ ] Tilfoej ikonfiler til /icons/
- [ ] Tilfoej CSS filer til /css/
- [ ] Tilfoej JS filer til /js/
- [ ] Forbind repo til Cloudflare Pages via Git integration
