import { getAdmin, json } from '../../_lib/admin-auth.js';

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/svg+xml', 'svg']
]);

async function requireAdmin(request, env) {
  return getAdmin(request, env);
}

async function saveField(env, key, value) {
  await env.DB.prepare("INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(key, String(value || '').slice(0, 10000)).run();
}

async function github(env, path, init = {}) {
  const token = String(env.GITHUB_TOKEN || '');
  const owner = String(env.GITHUB_OWNER || 'springnexaa-ops');
  const repo = String(env.GITHUB_REPO || 'C-Web');
  if (!token) throw new Error('GITHUB_TOKEN is not configured in Cloudflare.');
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'SpringNexa-Admin-Console', ...(init.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `GitHub request failed (${response.status}).`);
  return data;
}

export async function onRequestGet({ request, env }) {
  if (!(await requireAdmin(request, env))) return json({ error: 'Not authenticated.' }, 401);
  const { results } = await env.DB.prepare("SELECT key, value, updated_at FROM site_content WHERE key IN ('company_name','company_tagline','company_phone','company_email','company_address','company_logo_url') ORDER BY key").all();
  const company = {};
  for (const row of results) company[row.key] = row.value;
  return json({ ok: true, company });
}

export async function onRequestPost({ request, env }) {
  if (!(await requireAdmin(request, env))) return json({ error: 'Not authenticated.' }, 401);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const body = await request.json().catch(() => ({}));
  const fields = {
    company_name: String(body.company_name || '').trim(),
    company_tagline: String(body.company_tagline || '').trim(),
    company_phone: String(body.company_phone || '').trim(),
    company_email: String(body.company_email || '').trim(),
    company_address: String(body.company_address || '').trim()
  };
  for (const [key, value] of Object.entries(fields)) await saveField(env, key, value);

  let logoUrl = String(body.company_logo_url || '').trim();
  const logo = body.logo;
  if (logo && typeof logo === 'object' && typeof logo.dataUrl === 'string') {
    const match = logo.dataUrl.match(/^data:(image\/(?:png|jpeg|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return json({ error: 'Logo must be PNG, JPEG, WebP or SVG data.' }, 400);
    const mime = match[1];
    const ext = ALLOWED_LOGO_TYPES.get(mime);
    const raw = match[2];
    const estimatedBytes = Math.floor(raw.length * 0.75);
    if (!ext || estimatedBytes > MAX_LOGO_BYTES) return json({ error: 'Logo is too large. Maximum size is 2 MB.' }, 400);
    const path = `assets/company-logo.${ext}`;
    let sha;
    try { sha = (await github(env, `/${path}`)).sha; } catch (error) { if (!String(error.message).includes('Not Found')) throw error; }
    const uploaded = await github(env, `/contents/${path}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'admin: update company logo', content: raw, ...(sha ? { sha } : {}), branch: 'main' })
    });
    logoUrl = `/${path}?v=${Date.now()}`;
  }
  if (logoUrl) await saveField(env, 'company_logo_url', logoUrl);
  return json({ ok: true, company: { ...fields, company_logo_url: logoUrl } });
}
