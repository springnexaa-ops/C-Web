const MAX_DOC_BYTES=10*1024*1024;
const ALLOWED=new Set(['application/pdf','image/jpeg','image/png']);
const STAGES=new Set(['APPLIED','DOCUMENT_VERIFICATION','VERIFIED','ADMIT_CARD_ISSUED','INTERVIEW_SCHEDULED','INTERVIEW_COMPLETED','SELECTED','OFFER_ISSUED','APPOINTMENT_ISSUED','REJECTED','WITHDRAWN']);
const enc=new TextEncoder();
const token=()=>crypto.randomUUID();
export async function ensureCareerSchema(env){
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS career_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,department TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'OPEN',created_at TEXT NOT NULL DEFAULT (datetime('now')),closing_at TEXT)`).run();
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS career_applications (id INTEGER PRIMARY KEY AUTOINCREMENT,application_no TEXT NOT NULL UNIQUE,candidate_id INTEGER NOT NULL,job_id INTEGER,full_name TEXT NOT NULL,email TEXT NOT NULL,mobile TEXT NOT NULL,cover_note TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'APPLIED',interview_at TEXT,interview_mode TEXT,interview_location TEXT,interview_notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`).run();
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS career_documents (id INTEGER PRIMARY KEY AUTOINCREMENT,application_id INTEGER NOT NULL,document_type TEXT NOT NULL,object_key TEXT NOT NULL,original_name TEXT NOT NULL,mime_type TEXT NOT NULL,size_bytes INTEGER NOT NULL,sha256 TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'PENDING',verification_note TEXT NOT NULL DEFAULT '',uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),verified_at TEXT)`).run();
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS career_issued_documents (id INTEGER PRIMARY KEY AUTOINCREMENT,application_id INTEGER NOT NULL,document_type TEXT NOT NULL,reference_no TEXT NOT NULL UNIQUE,issued_at TEXT NOT NULL DEFAULT (datetime('now')),issued_by TEXT NOT NULL,metadata_json TEXT NOT NULL DEFAULT '{}')`).run();
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS career_events (id INTEGER PRIMARY KEY AUTOINCREMENT,application_id INTEGER NOT NULL,event_type TEXT NOT NULL,actor TEXT NOT NULL,details TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')))`).run();
}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store, private','CDN-Cache-Control':'no-store','Vary':'Cookie',...headers}})}
export function validStage(s){return STAGES.has(String(s||''))}
export function safeType(v){return String(v||'').trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,60)}
export function applicationNo(){return 'SNX-'+new Date().getUTCFullYear()+'-'+token().replaceAll('-','').slice(0,10).toUpperCase()}
export async function sha256(file){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function getApplication(env,id,candidateId=null){let q='SELECT * FROM career_applications WHERE id=?';const binds=[Number(id)];if(candidateId!==null){q+=' AND candidate_id=?';binds.push(Number(candidateId))}return env.DB.prepare(q).bind(...binds).first()}
export async function logEvent(env,id,type,actor,details=''){await env.DB.prepare('INSERT INTO career_events (application_id,event_type,actor,details) VALUES (?,?,?,?)').bind(id,type,String(actor||'system').slice(0,120),String(details||'').slice(0,1000)).run()}
