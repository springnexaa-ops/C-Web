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

- One canonical premium navigation system across corporate HTML pages
- Healthcare, Information Technology and Social Welfare are grouped under the Divisions mega-menu
- Nexa AI and NEXA Neurology LMIS have dedicated product destinations
- Duplicate legacy division links are removed at runtime
- One canonical footer is generated across internal corporate pages
- Investor/partner/customer perspective is surfaced without changing the underlying business claims
- Core proof points are presented consistently: 1,900+ patients, 12+ healthcare procedures, 3 divisions and 2026 platform stage
- Mobile navigation is normalized into accessible expandable sections and a secure Admin Portal link

## Front-end

- `styles.css` — shared base/site styles
- `reference-home.css` — homepage reference styling
- `home-slider.css` — seasonal 3D slider styling
- `home-slider-real.css` — photographic seasonal layer
- `cinematic-home.css` — cinematic Kashmir homepage treatment
- `division-pages.css` — shared internal-page shell
- `investor-structure.css` — investor-friendly internal page system
- `nexa-products.css` — Nexa AI / NEXA LMIS product design system
- `nav-structure.css` — premium mega-navigation system
- `site-content.js` — canonical navigation, duplicate cleanup, internal-page structure and live content
- `home-slider.js` — homepage seasonal slider
- `_headers` — production HTML/admin cache and indexing policy

## D1 Admin Console

The `/admin/` console is backed by Cloudflare D1 with server-side sessions, PBKDF2-SHA-256 password hashing, HttpOnly/Secure/SameSite=Strict cookies and server-side authorization. Admin pages are `noindex,nofollow`.

Do not put passwords, bootstrap keys, API keys or other secrets in Git.

## Deployment

Cloudflare Pages should redeploy automatically from `main`. The production `_headers` policy now forces HTML/admin revalidation so an older HTML response should not remain cached after deployment. Verify the Cloudflare Pages project connected to `springnexaa-ops/C-Web` uses `main` as its production branch.
