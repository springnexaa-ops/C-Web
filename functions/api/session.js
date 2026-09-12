// GET /api/session -> { loggedIn: bool, username? }

import { verifySession, readCookie } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const token = readCookie(request, 'sn_session');
  const payload = await verifySession(env.SESSION_SECRET, token);
  if (!payload) {
    return new Response(JSON.stringify({ loggedIn: false }), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ loggedIn: true, username: payload.u }), { headers: { 'Content-Type': 'application/json' } });
}
