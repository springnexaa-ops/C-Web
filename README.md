# SpringNexa Private Limited — Corporate Website

Public corporate website for SpringNexa Private Limited, covering Healthcare, Information Technology and Social Welfare, plus the Nexa AI and NEXA Neurology LMIS product landing pages.

## Stack

- Static HTML/CSS/JavaScript
- Cloudflare Pages
- Pages Functions
- Cloudflare D1 for editable public content and the admin console

## Public pages

- `index.html` — corporate homepage
- `about.html` — company overview
- `divisions.html` — division overview
- `healthcare.html` — Healthcare
- `it.html` — Information Technology
- `social-welfare.html` — Social Welfare
- `team.html` — Our Team
- `contact.html` — Contact
- `nexa-ai.html` — Nexa AI Coming Soon
- `nexa-lmis.html` — NEXA Neurology LMIS Coming Soon

## Front-end structure

- `styles.css` — shared base/site styles
- `reference-home.css` — homepage reference design
- `home-slider.css` — homepage 3D vision slider and product navigation styling
- `division-pages.css` — shared internal-page shell
- `nexa-products.css` — Nexa AI / NEXA LMIS product design system
- `homepage-live-fix.css` — homepage rendering override retained for the local mountain artwork
- `site-content.js` — shared navigation, branding and internal-page shell
- `home-slider.js` — homepage-only product tabs and 3D slider behavior

## D1 Admin Console

The corporate website now has a new `/admin/` console backed by Cloudflare D1. It is separate from the old console and uses:

- `admin_users` for administrator accounts
- `admin_sessions` for server-side sessions
- PBKDF2-SHA-256 password hashing with per-user salts
- HttpOnly, Secure, SameSite=Strict session cookies
- Server-side authorization for every content read/write
- `/api/admin/bootstrap` for one-time first-admin initialization, protected by the `ADMIN_BOOTSTRAP_KEY` Cloudflare secret and disabled after the first account exists

Admin pages are marked `noindex,nofollow`. Do not put passwords, bootstrap keys, API keys or other secrets in Git.

### First-time setup

1. Deploy the current `main` branch with a D1 binding named `DB`.
2. Add a strong Cloudflare environment/secret variable named `ADMIN_BOOTSTRAP_KEY`.
3. POST the first username/password to `/api/admin/bootstrap` with the `X-Admin-Bootstrap-Key` header.
4. Rotate the bootstrap key after initialization.
5. Open `/admin/login.html` and sign in.

The bootstrap endpoint will not create another administrator once an account exists.

## Server-side AI chat

`functions/api/chat.js` provides the public `/api/chat` endpoint. The provider API key remains server-side in Cloudflare environment variables.

Recommended variables:

- `AI_API_KEY`
- `AI_PROVIDER` (`openai` or `anthropic`)
- `AI_MODEL` (optional)

Apply rate limiting/WAF controls to `/api/chat` in Cloudflare before public high-volume use.

## Deployment

Cloudflare Pages should redeploy automatically from the `main` branch. Allow the deployment and CDN cache to propagate before evaluating production rendering.