import { verifySession, readCookie } from '../_lib/auth.js';

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  // The login page itself must stay reachable
  if (url.pathname === '/admin/login.html' || url.pathname === '/admin/') {
    return next();
  }

  const token = readCookie(request, 'sn_session');
  const payload = await verifySession(env.SESSION_SECRET, token);

  if (!payload) {
    return Response.redirect(new URL('/admin/login.html', request.url), 302);
  }

  return next();
}
