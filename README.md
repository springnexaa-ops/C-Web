# Springnexa Private Limited — Website

Public site (Home, About, Divisions, Contact) + an admin login/content dashboard + an AI chat
assistant, all running on Cloudflare Pages + Pages Functions + D1.

## Push this update

```
git add .
git commit -m "Add admin login, content dashboard, and AI chat agent"
git push
```

Cloudflare Pages will auto-redeploy since it's connected to this repo — but the new backend
pieces below need one-time setup before they work.

## 1. Create the D1 database

- Cloudflare dashboard → **Workers & Pages** → **D1** → **Create database** → name it e.g. `springnexa-db`
- Open its **Console** tab and paste the contents of `schema.sql` from this repo, then run it
  (creates the `admins` and `site_content` tables and seeds default content)

## 2. Bind the database to your Pages project

- Your Pages project → **Settings** → **Functions** → **D1 database bindings** → **Add binding**
- Variable name: `DB` (must match exactly — the code refers to `env.DB`)
- D1 database: the one you just created
- Save, then **redeploy** the project (bindings only take effect on the next deploy)

## 3. Set your secrets

Same **Settings** page → **Environment variables** (add as **Secret**, not plain text):

| Name | Value |
|---|---|
| `SESSION_SECRET` | any long random string (e.g. generate one with `openssl rand -hex 32`) — signs admin login sessions |
| `AI_API_KEY` | your Anthropic (or OpenAI) API key |
| `AI_PROVIDER` | `anthropic` or `openai` (defaults to `anthropic` if omitted) |
| `AI_MODEL` | optional — defaults to `claude-sonnet-4-6` for Anthropic, `gpt-4o-mini` for OpenAI |

Redeploy after adding these too.

## 4. Create your admin account (one time only)

With everything above deployed, run this once from your own machine (replace the URL, username,
and password — use a real, strong password):

```
curl.exe -X POST https://c-web-dfw.pages.dev/api/setup -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"Anfa@1311\"}"
```

Then **delete `functions/api/setup.js` from the repo and push again** — this endpoint only
works once (it refuses if an admin already exists), but removing it entirely closes that door
for good.

## 5. Log in

Go to `https://<your-domain>/admin/login.html`, sign in, and you'll land on
`/admin/dashboard.html` — edit any field and hit Save. Public pages pick up the change within
about a minute (content is cached for 60 seconds).

## 6. The AI chat widget

Appears automatically (bottom-right bubble) on every public page once `AI_API_KEY` is set —
it answers visitor questions using only the Springnexa facts baked into its system prompt
(divisions, registration details). It won't invent pricing, staff names, or specifics you
haven't given it.

## Security notes

- Admin sessions are HttpOnly, Secure, SameSite=Strict cookies — not reachable by JavaScript,
  not sent cross-site.
- Passwords are hashed with PBKDF2-SHA256 (100,000 iterations) + a random salt per user; the
  plaintext password is never stored.
- `/admin/*` is gated by `functions/admin/_middleware.js` — you can't reach the dashboard
  without a valid session, even if you guess the URL.
- Delete `functions/api/setup.js` after creating your admin account (step 4). Leaving it in
  is harmless *after* an admin exists (it refuses to run again) but removing it is still better
  practice.
- Rotate `SESSION_SECRET` any time you want to invalidate all logged-in sessions at once.
- Consider adding a Cloudflare **Rate Limiting rule** on `/api/chat` and `/api/login` (Security →
  WAF → Rate limiting rules) to prevent abuse driving up your AI API bill or brute-forcing the
  login.

## Still placeholder / needs your real info

- `contact_email` / `contact_phone` in `site_content` — edit via the dashboard once logged in
- Healthcare and Social Welfare division descriptions — same, via the dashboard
- The AI assistant's knowledge is limited to what's in its system prompt
  (`functions/api/chat.js`) — expand that text with more real details as you have them
