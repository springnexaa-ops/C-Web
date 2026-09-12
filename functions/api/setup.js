// POST /api/setup  { username, password }
// Creates the FIRST admin account — only works while the admins table is empty.
// IMPORTANT: disable or delete this file after you've created your one admin account.
// (See the "Security" section of the README.)

import { hashPassword } from '../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  const existing = await env.DB.prepare('SELECT COUNT(*) as n FROM admins').first();
  if (existing.n > 0) {
    return new Response(JSON.stringify({ error: 'Setup already completed. Delete functions/api/setup.js.' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { username, password } = await request.json();
  if (!username || !password || password.length < 10) {
    return new Response(JSON.stringify({ error: 'Username and a password of at least 10 characters are required.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { hash, salt } = await hashPassword(password);
  await env.DB.prepare('INSERT INTO admins (username, password_hash, salt) VALUES (?, ?, ?)')
    .bind(username, hash, salt).run();

  return new Response(JSON.stringify({ ok: true, message: 'Admin created. Now delete this file (functions/api/setup.js) and redeploy.' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
