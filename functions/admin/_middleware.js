import { getAdmin } from '../_lib/admin-auth.js';

export async function onRequest({ request, next, env }) {
  const path = new URL(request.url).pathname.replace(/\.html$/, '');
  if (path === '/admin/login' || path === '/admin') return next();
  if (!(await getAdmin(request, env))) return Response.redirect(new URL('/admin/login.html', request.url), 302);
  return next();
}
