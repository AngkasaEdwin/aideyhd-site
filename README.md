# aideyhd.com

The marketing site for [AideyHD](https://aideyhd.com) — a calm, ADHD-friendly personal secretary for iPhone.

Static HTML/CSS/JS, no build step, no dependencies. Deployed via GitHub Pages with the custom domain `aideyhd.com` (see `CNAME`).

- `index.html` — the single-page site
- `privacy/` — privacy policy
- `styles.css` — design tokens lifted from the app (navy `#2C2A4A`, the four brand tints, mood colors), light/dark via `prefers-color-scheme`
- `site.js` — the small interactive pieces: `#`-linked FAQ auto-open, the two-tap logging demo, the sticky mobile CTA, and the time-aware widget mock
- `robots.txt` / `sitemap.xml` — two URLs; bump `lastmod` when the copy changes materially

The full plan this was built from lives in the app repo at `docs/WEBSITE_PLAN.md`.

## Images

Screenshots ship as WebP with a PNG fallback via `<picture>`. After adding or replacing a PNG in `assets/`, regenerate its WebP:

```sh
cwebp -q 82 assets/your-shot.png -o assets/your-shot.webp
```

Keep `og-image.png` as PNG — social scrapers are unreliable with WebP. Hero screenshots must be **light mode**: the hero sits on the navy band, so a light screen pops and a dark one vanishes into it.

## The QR code

`assets/qr-testflight.svg` is the desktop path — without it, a desktop visitor who clicks the CTA lands on Apple's "open this on your iPhone" dead end. If the TestFlight join URL changes, regenerate and re-verify:

```sh
python3 -m pip install segno
python3 -c "import segno; segno.make('<NEW_URL>', error='m').save('assets/qr-testflight.svg', scale=1, border=3, dark='#2C2A4A', light='#FFFFFF')"
```

Decode it before shipping. A QR nobody checked is a silent dead end.

## Founder slots

`index.html`'s `#founder` section has two commented placeholders: the avatar (`assets/founder.png`) and the personal-site link. Both are one-line uncomments. Keep the avatar local — a third-party avatar host would leak visitor IPs on a page whose pitch is that nothing leaves your device.

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
