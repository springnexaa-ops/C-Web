import { getAdmin, json } from '../../_lib/admin-auth.js';

async function requireAdmin(request, env) {
  const admin = await getAdmin(request, env);
  return admin;
}

export async function onRequestGet({ request, env }) {
  if (!(await requireAdmin(request, env))) return json({ error: 'Not authenticated.' }, 401);
  const { results } = await env.DB.prepare('SELECT key, value, updated_at FROM site_content ORDER BY key').all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Not authenticated.' }, 401);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const body = await request.json().catch(() => ({}));
  const key = String(body.key || '').trim();
  const value = String(body.value ?? '').slice(0, 10000);
  if (!/^[a-z0-9_]{1,100}$/.test(key)) return json({ error: 'Invalid content key.' }, 400);
  await env.DB.prepare("INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(key, value).run();
  return json({ ok: true });
}
