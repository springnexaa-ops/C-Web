import { createSession, sessionCookie, json } from '../../_lib/admin-auth.js';

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function equal(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const configured = String(env.ADMIN_TOKEN || '');
  if (!configured) return json({ error: 'Admin authentication is not configured.' }, 503);
  const body = await request.json().catch(() => ({}));
  const token = String(body.token || '').trim();
  if (!token || token.length > 500) return json({ error: 'Admin token is required.' }, 400);
  const [present, expected] = await Promise.all([digest(token), digest(configured)]);
  if (!equal(present, expected)) return json({ error: 'Invalid admin token.' }, 401);
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= datetime('now')").run();
  const session = await createSession(env, 'ADMIN_TOKEN');
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(session) });
}
