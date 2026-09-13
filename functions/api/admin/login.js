import { verifyPassword, createSession, sessionCookie, json } from '../../_lib/admin-auth.js';

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || '').trim().slice(0, 80);
  const password = String(body.password || '');
  if (!username || !password) return json({ error: 'Username and password are required.' }, 400);
  const row = await env.DB.prepare('SELECT username, password_hash, salt FROM admin_users WHERE username = ? AND active = 1').bind(username).first();
  if (!row || !(await verifyPassword(password, row.password_hash, row.salt))) return json({ error: 'Invalid credentials.' }, 401);
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= datetime('now')").run();
  const token = await createSession(env, username);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
}
