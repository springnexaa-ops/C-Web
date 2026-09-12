// POST /api/login  { username, password } -> sets an HttpOnly session cookie

import { verifyPassword, createSession } from '../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Missing username or password.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const row = await env.DB.prepare('SELECT password_hash, salt FROM admins WHERE username = ?').bind(username).first();
  if (!row) {
    return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const ok = await verifyPassword(password, row.password_hash, row.salt);
  if (!ok) {
    return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const token = await createSession(env.SESSION_SECRET, username, 12);
  const cookie = `sn_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${12 * 3600}`;

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie }
  });
}
