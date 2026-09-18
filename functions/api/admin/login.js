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

function redirect(request, error) {
  const url = new URL('/admin/login.html', request.url);
  if (error) url.searchParams.set('error', error);
  return new Response(null, { status: 303, headers: {
    Location: url.toString(), 'Cache-Control': 'no-store, private', 'CDN-Cache-Control': 'no-store'
  }});
}

export async function onRequestPost({ request, env }) {
  const ajax = request.headers.get('X-Admin-Login') === '1';
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);

  const configured = typeof env.ADMIN_TOKEN === 'string' ? env.ADMIN_TOKEN : '';
  if (!configured) return ajax ? json({ ok: false, error: 'ADMIN_TOKEN is not configured in this Cloudflare deployment.' }, 503) : redirect(request, 'config');

  const contentType = request.headers.get('Content-Type') || '';
  let token = '';
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null);
    token = typeof body?.token === 'string' ? body.token : '';
  } else {
    const form = await request.formData().catch(() => null);
    token = typeof form?.get('token') === 'string' ? form.get('token') : '';
  }

  if (!token || token.length > 500) return ajax ? json({ ok: false, error: 'Admin token is required.' }, 400) : redirect(request, 'invalid');

  const [present, expected] = await Promise.all([digest(token), digest(configured)]);
  if (!equal(present, expected)) return ajax ? json({ ok: false, error: 'Invalid admin token.' }, 401) : redirect(request, 'invalid');

  try {
    const session = await createSession(env, 'ADMIN_TOKEN');
    const headers = {
      'Set-Cookie': sessionCookie(session),
      'Cache-Control': 'no-store, private',
      'CDN-Cache-Control': 'no-store',
      'Vary': 'Cookie'
    };
    if (ajax) return json({ ok: true, message: 'Admin API valid. Session created successfully.' }, 200, headers);
    return new Response(null, { status: 303, headers: { ...headers, Location: '/admin/dashboard.html?v=20260918-admin-auth' }});
  } catch (error) {
    console.error('Admin session creation failed:', error);
    return ajax ? json({ ok: false, error: 'Admin authentication session could not be created.' }, 503) : redirect(request, 'session');
  }
}
