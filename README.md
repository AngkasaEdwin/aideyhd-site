# aideyhd.com

The marketing site for [AideyHD](https://aideyhd.com) — a calm, ADHD-friendly personal secretary for iPhone (and Mac).

Static HTML/CSS/JS, no build step, no dependencies. Deployed via GitHub Pages with the custom domain `aideyhd.com` (see `CNAME`).

- `index.html` — the single-page site
- `privacy/` — privacy policy
- `styles.css` — design tokens lifted from the app (navy `#2C2A4A`, the four brand tints, mood colors), light/dark via `prefers-color-scheme`
- `site.js` — the three small interactive pieces: the two-tap logging demo, the copy toggle, and the time-aware widget mock

The full plan this was built from lives in the app repo at `docs/WEBSITE_PLAN.md`.

## DNS (one-time, at the domain registrar)

Point `aideyhd.com` at GitHub Pages:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<github-username>.github.io` |

Then in the repo's **Settings ▸ Pages**, confirm the custom domain shows `aideyhd.com` and check **Enforce HTTPS** once the certificate is issued.
