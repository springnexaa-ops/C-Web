# SpringNexa Private Limited — Corporate Website

Investor-friendly static corporate website for SpringNexa Private Limited covering Healthcare, Information Technology and Social Welfare, plus dedicated Nexa AI and NEXA Neurology LMIS product pages.

## Public HTML structure

- `index.html` — cinematic corporate homepage
- `about.html` — company thesis, registrations and operating model
- `divisions.html` — portfolio/division overview
- `healthcare.html` — Healthcare operating division
- `it.html` — Information Technology operating division
- `social-welfare.html` — Social Welfare operating division
- `team.html` — leadership and governance
- `contact.html` — corporate, partnership and investor enquiries
- `nexa-ai.html` — Nexa AI product page
- `nexa-lmis.html` — NEXA Neurology LMIS product page

## Structure principles

- One canonical navigation system across corporate HTML pages
- One canonical footer across internal HTML pages
- Duplicate division links are removed at runtime
- Investor/partner/customer perspective is surfaced without changing the underlying business claims
- Core proof points are presented consistently: 1,900+ patients, 12+ healthcare procedures, 3 divisions and 2026 platform stage
- Mobile navigation is normalized to one Division menu and one Admin Portal link
- NEXA AI and NEXA LMIS remain dedicated product pages and are not merged with corporate content

## Front-end

- `styles.css` — shared base/site styles
- `reference-home.css` — homepage reference styling
- `home-slider.css` — seasonal 3D slider styling
- `home-slider-real.css` — photographic seasonal layer
- `cinematic-home.css` — cinematic Kashmir homepage treatment
- `division-pages.css` — shared internal-page shell
- `investor-structure.css` — investor-friendly internal page system
- `nexa-products.css` — Nexa AI / NEXA LMIS product design system
- `site-content.js` — canonical navigation, duplicate cleanup, internal-page structure and live content
- `home-slider.js` — homepage seasonal slider

## D1 Admin Console

The `/admin/` console is backed by Cloudflare D1 with server-side sessions, PBKDF2-SHA-256 password hashing, HttpOnly/Secure/SameSite=Strict cookies and server-side authorization. Admin pages are `noindex,nofollow`.

Do not put passwords, bootstrap keys, API keys or other secrets in Git.

## Deployment

Cloudflare Pages should redeploy automatically from `main`. Allow the deployment/CDN cache to propagate before evaluating production rendering.
