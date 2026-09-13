# SpringNexa Private Limited — Corporate Website

Public corporate website for SpringNexa Private Limited, covering Healthcare, Information Technology and Social Welfare, plus the Nexa AI and NEXA Neurology LMIS product landing pages.

## Stack

- Static HTML/CSS/JavaScript
- Cloudflare Pages
- Pages Functions for the public AI chat endpoint
- No legacy corporate admin console or browser-based content dashboard

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

## Server-side AI chat

`functions/api/chat.js` provides the public `/api/chat` endpoint. The provider API key remains server-side in Cloudflare environment variables.

Recommended variables:

- `AI_API_KEY`
- `AI_PROVIDER` (`openai` or `anthropic`)
- `AI_MODEL` (optional)

Apply rate limiting/WAF controls to `/api/chat` in Cloudflare before public high-volume use.

## Legacy admin removal

The old `/admin` login/dashboard and its authentication/content-management implementation have been removed from the website project. Nexa AI administration should remain in the dedicated Nexa AI application rather than being duplicated inside the corporate website repository.

## Deployment

Cloudflare Pages should redeploy automatically from the `main` branch. Allow the deployment and CDN cache to propagate before evaluating production rendering.