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

## Admin Control Center

`/admin/login.html` is a private Cloudflare-backed maintenance console. Authentication is token-only: the browser submits the administrator token to `/api/admin/login`, which validates it against the Cloudflare Worker/Pages secret `ADMIN_TOKEN` and then issues the existing HttpOnly server session. No admin password or token is stored in Git.

The console provides:

- GitHub branch listing and branch creation from an existing branch
- Open pull-request listing and explicit approval actions
- Company name, tagline, phone, email and address editing through D1
- Company logo URL management and authenticated logo upload to the repository
- Existing D1 website-content editing
- Live-site access and secure session logout

### Required Cloudflare secrets

Configure these as **Secrets** in the Cloudflare Pages/Workers project, not as plaintext Git variables:

```text
ADMIN_TOKEN=<long-random-admin-token>
GITHUB_TOKEN=<GitHub-token-with-required-repository-permissions>
```

Optional non-secret bindings can select another repository:

```text
GITHUB_OWNER=springnexaa-ops
GITHUB_REPO=C-Web
```

For local development, use `.env` or `.dev.vars` and never commit it. Cloudflare recommends secrets for sensitive values such as API tokens and passwords. citeturn0search0turn0search4

The GitHub maintenance token should be limited to the repository permissions required for branch and pull-request operations. GitHub's Contents write permission is required for repository file mutations; branch/ref operations also require suitable repository write permissions. citeturn0search6turn0search9

## Structure principles

- One canonical premium navigation system across corporate HTML pages
- Healthcare, Information Technology and Social Welfare are grouped under the Divisions mega-menu
- Nexa AI and NEXA Neurology LMIS have dedicated product destinations
- Duplicate legacy division links are removed at runtime
- One canonical footer is generated across internal corporate pages
- Core proof points are presented consistently: 1,900+ patients, 12+ healthcare procedures, 3 divisions and 2026 platform stage
- Mobile navigation is normalized into accessible expandable sections and a secure Admin Portal link
- Company identity and logo can be updated through the authenticated Admin Control Center

## Front-end

- `styles.css` — shared base/site styles
- `reference-home.css` — homepage reference styling
- `home-slider.css` — seasonal 3D slider styling
- `home-slider-real.css` — photographic seasonal layer
- `cinematic-home.css` — cinematic Kashmir homepage treatment
- `division-pages.css` — shared internal-page shell
- `nexa-products.css` — Nexa AI / NEXA LMIS product design system
- `nav-structure.css` — premium mega-navigation system
- `site-content.js` — canonical navigation, live company identity and public content
- `home-slider.js` — homepage seasonal slider
- `_headers` — production HTML/admin cache and indexing policy

## Nexa AI Agent

The public website includes a live Nexa AI agent UI backed by `/api/nexa-ai/chat`. The upstream Nexa AI API URL, model and API key are server-side bindings and are never exposed to the browser.

## Deployment

Cloudflare Pages should redeploy automatically from `main`. Verify that the production project is connected to `springnexaa-ops/C-Web` and that the production branch is `main`. Cloudflare secrets are configured separately from Git and should be deployed through the Cloudflare dashboard or Wrangler. citeturn0search4turn0search5
