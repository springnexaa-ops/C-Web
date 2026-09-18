import { ensureSchema, normalizeEmail, normalizeMobile, verifyPassword, createSession, sessionCookie, json, sameOrigin } from '../../_lib/public-auth.js';
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return json({ok:false,error:'Invalid origin.'},403);
 await ensureSchema(env);
 const body=await request.json().catch(()=>null), identifier=String(body?.identifier||'').trim(), password=String(body?.password||'');
 const row=await env.DB.prepare('SELECT id,full_name,email,mobile,password_hash,password_salt,created_at FROM public_users WHERE email=? OR mobile=? LIMIT 1').bind(normalizeEmail(identifier),normalizeMobile(identifier)).first();
 if(!row||!(await verifyPassword(password,row.password_salt,row.password_hash)))return json({ok:false,error:'Invalid email/mobile number or password.'},401);
 await env.DB.prepare("UPDATE public_users SET last_login_at=datetime('now'),updated_at=datetime('now') WHERE id=?").bind(row.id).run();
 const user={id:row.id,full_name:row.full_name,email:row.email,mobile:row.mobile,created_at:row.created_at};
 return json({ok:true,user},200,{'Set-Cookie':sessionCookie(await createSession(env,user))});
}