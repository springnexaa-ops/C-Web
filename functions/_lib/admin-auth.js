const COOKIE = 'sn_admin';
const encoder = new TextEncoder();
const SESSION_TTL = 12 * 60 * 60;

function base64url(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

async function verifySignature(value, signature, secret) {
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('HMAC', key, fromBase64url(signature), encoder.encode(value));
  } catch {
    return false;
  }
}

export function readCookie(request) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export async function createSession(env, username) {
  if (typeof env.ADMIN_TOKEN !== 'string' || !env.ADMIN_TOKEN) throw new Error('ADMIN_TOKEN is not configured');
  const payload = base64url(JSON.stringify({
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL,
    nonce: base64url(crypto.getRandomValues(new Uint8Array(18)))
  }));
  return `${payload}.${await sign(payload, env.ADMIN_TOKEN)}`;
}

export async function getAdmin(request, env) {
  if (typeof env.ADMIN_TOKEN !== 'string' || !env.ADMIN_TOKEN) return null;
  const token = readCookie(request);
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  if (!(await verifySignature(parts[0], parts[1], env.ADMIN_TOKEN))) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(parts[0])));
    if (!payload || payload.username !== 'ADMIN_TOKEN' || !Number.isFinite(Number(payload.exp))) return null;
    if (Number(payload.exp) <= Math.floor(Date.now() / 1000)) return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function clearSession() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, private',
      'CDN-Cache-Control': 'no-store',
      'Vary': 'Cookie',
      'Set-Cookie': `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
    }
  });
}

export function sessionCookie(token) {
  return `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, private',
      'CDN-Cache-Control': 'no-store',
      'Vary': 'Cookie',
      ...headers
    }
  });
}
