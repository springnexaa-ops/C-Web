import { verifySession, readCookie } from '../_lib/auth.js';

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  // Cloudflare Pages redirects /admin/login.html -> /admin/login (clean URLs).
  // Normalize both forms so we recognize the login page either way and never
  // redirect into that Pages-level redirect ourselves.
  const path = url.pathname.replace(/\.html$/, '');

  if (path === '/admin/login' || path === '/admin') {
    return next();
  }

  const token = readCookie(request, 'sn_session');
  const payload = await verifySession(env.SESSION_SECRET, token);

  if (!payload) {
    return Response.redirect(new URL('/admin/login', request.url), 302);
  }

  return next();
}
