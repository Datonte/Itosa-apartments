# Contributing to ITOSA Apartment

## Editing the header or footer

The canonical sources are:

- [`partials/header.html`](partials/header.html)
- [`partials/footer.html`](partials/footer.html)

These are **copy-pasted into every public HTML page**. They are NOT loaded at runtime (we deliberately avoid client-side partial fetching to keep SEO and Core Web Vitals clean).

If you edit `partials/header.html` or `partials/footer.html`, you **must** copy the new contents into all of:

- `index.html`
- `browse.html`
- `details.html`
- `booking.html`
- `confirmation.html`
- `contact.html`
- `faq.html`
- `terms.html`
- `refund.html`
- `404.html`

Admin pages (`admin-*.html`) have their own simpler header — they do not use these partials.

## Editing apartments / availability / brand info

Read the **"Editing content after launch"** section of the approved plan in `.claude/plans/you-are-a-senior-gentle-tide.md`. Short version:

| What | Where | Persistence |
|---|---|---|
| Phone, email, WhatsApp, social, fees, Paystack key | `assets/js/data/config.js` | Permanent (commit + deploy) |
| Apartments | `/admin-apartments` UI **or** `assets/js/data/apartments.js` | Admin = browser-local; file edit = permanent |
| Blocked dates | `/admin-availability` UI **or** `assets/js/data/availability.js` | Admin = browser-local; file edit = permanent |
| Apartment photos | drop into `assets/images/placeholders/<slug>-1.jpg` … `<slug>-5.jpg` | Permanent |

## URL hygiene

**No `<a href>` may contain `.html`.** Every link uses the clean URL: `/`, `/browse`, `/apartments/<slug>`, `/booking`, `/confirmation`, `/contact`, `/faq`, `/terms`, `/refund`, `/admin-dashboard`, etc.

Vercel's `cleanUrls: true` handles routing on disk → URL. A 301 redirect in `vercel.json` catches stale `*.html` URLs and forwards them to the clean equivalent.

To check before committing: `grep -rn '\.html"' *.html | grep -i 'href='` should return nothing.

## Local dev

ES modules require an HTTP server. From the repo root:

```bash
npx serve . -p 3000
```

`file://` will not work — modules will fail to load.
