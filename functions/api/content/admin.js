// GET  /api/content/admin -> full list, requires session cookie
// POST /api/content/admin { key, value } -> updates one row, requires session cookie

import { verifySession, readCookie } from '../../_lib/auth.js';

async function requireAuth(request, env) {
  const token = readCookie(request, 'sn_session');
  const payload = await verifySession(env.SESSION_SECRET, token);
  return payload; // null if not authed
}

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const { results } = await env.DB.prepare('SELECT key, value, updated_at FROM site_content ORDER BY key').all();
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const { key, value } = await request.json().catch(() => ({}));
  if (!key) return new Response(JSON.stringify({ error: 'Missing key.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  await env.DB.prepare(
    `INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).bind(key, value ?? '').run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
