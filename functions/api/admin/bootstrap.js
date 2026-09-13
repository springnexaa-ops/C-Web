import { hashPassword, json } from '../../_lib/admin-auth.js';

export async function onRequestPost({ request, env }) {
  const provided = request.headers.get('X-Admin-Bootstrap-Key') || '';
  if (!env.ADMIN_BOOTSTRAP_KEY || provided !== env.ADMIN_BOOTSTRAP_KEY) return json({ error: 'Forbidden.' }, 403);

  await env.DB.prepare('CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT (datetime(\'now\')))').run();
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS admin_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, token_hash TEXT UNIQUE NOT NULL, username TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime(\'now\')))').run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions (expires_at)').run();

  const existing = await env.DB.prepare('SELECT id FROM admin_users LIMIT 1').first();
  if (existing) return json({ error: 'Admin already initialized.' }, 409);

  const body = await request.json().catch(() => ({}));
  const username = String(body.username || '').trim().slice(0, 80);
  const password = String(body.password || '');
  if (!/^[A-Za-z0-9._-]{3,80}$/.test(username)) return json({ error: 'Invalid username.' }, 400);
  if (password.length < 12 || password.length > 200) return json({ error: 'Password must be 12–200 characters.' }, 400);
  const { hash, salt } = await hashPassword(password);
  await env.DB.prepare('INSERT INTO admin_users (username, password_hash, salt, active) VALUES (?, ?, ?, 1)').bind(username, hash, salt).run();
  return json({ ok: true, message: 'Admin initialized. Rotate ADMIN_BOOTSTRAP_KEY after use.' });
}
