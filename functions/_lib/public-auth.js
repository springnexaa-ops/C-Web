const COOKIE='sn_user';
const SESSION_TTL=7*24*60*60;
const enc=new TextEncoder();

function b64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function bytesFromB64(v){const s=atob(v.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-v.length%4)%4));const a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a}
async function hmac(value,secret){const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(await crypto.subtle.sign('HMAC',k,enc.encode(value)))}
async function verify(value,sig,secret){try{const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);return crypto.subtle.verify('HMAC',k,bytesFromB64(sig),enc.encode(value))}catch{return false}}
function secret(env){return typeof env.AUTH_SECRET==='string'&&env.AUTH_SECRET.length>=32?env.AUTH_SECRET:(typeof env.ADMIN_TOKEN==='string'&&env.ADMIN_TOKEN.length>=32?env.ADMIN_TOKEN:'')}
function cookieValue(request){const h=request.headers.get('Cookie')||'';const m=h.match(/(?:^|;\\s*)sn_user=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function derive(password,salt){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);return new Uint8Array(bits)}
function timingEqual(a,b){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
export async function ensureSchema(env){await env.DB.prepare(`CREATE TABLE IF NOT EXISTS public_users (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, mobile TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), last_login_at TEXT)`).run()}
export function normalizeEmail(v){return String(v||'').trim().toLowerCase()}
export function normalizeMobile(v){return String(v||'').replace(/[^0-9+]/g,'').replace(/^00/,'+')}
export function validMobile(v){return /^\\+?[1-9]\\d{9,14}$/.test(v)}
export async function hashPassword(password){const salt=crypto.getRandomValues(new Uint8Array(16));const hash=await derive(password,salt);return {salt:b64(salt),hash:b64(hash)}}
export async function verifyPassword(password,saltText,hashText){try{return timingEqual(await derive(password,bytesFromB64(saltText)),bytesFromB64(hashText))}catch{return false}}
export async function createSession(env,user){const s=secret(env);if(!s)throw new Error('AUTH_SECRET is not configured');const payload=b64(enc.encode(JSON.stringify({sub:String(user.id),email:user.email,exp:Math.floor(Date.now()/1000)+SESSION_TTL,nonce:b64(crypto.getRandomValues(new Uint8Array(18)))})));return payload+'.'+await hmac(payload,s)}
export async function getUser(request,env){const s=secret(env);const token=cookieValue(request);if(!s||!token)return null;const p=token.split('.');if(p.length!==2||!(await verify(p[0],p[1],s)))return null;try{const raw=new TextDecoder().decode(bytesFromB64(p[0]));const data=JSON.parse(raw);if(!data?.sub||Number(data.exp)<=Math.floor(Date.now()/1000))return null;const row=await env.DB.prepare('SELECT id, full_name, email, mobile, created_at FROM public_users WHERE id=?').bind(Number(data.sub)).first();return row||null}catch{return null}}
export function sessionCookie(token){return `sn_user=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`}
export function clearSession(){return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store','Set-Cookie':'sn_user=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'}})}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','CDN-Cache-Control':'no-store',...headers}})}
export function sameOrigin(request){const origin=request.headers.get('Origin');return !origin||origin===new URL(request.url).origin}
