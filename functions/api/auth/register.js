import { ensureSchema, normalizeEmail, normalizeMobile, validMobile, hashPassword, sessionCookie, createSession, json, sameOrigin } from '../../_lib/public-auth.js';
export async function onRequestPost({request,env}){
 if(!sameOrigin(request)) return json({ok:false,error:'Invalid origin.'},403);
 await ensureSchema(env);
 const body=await request.json().catch(()=>null);
 const fullName=String(body?.fullName||'').trim(), email=normalizeEmail(body?.email), mobile=normalizeMobile(body?.mobile), password=String(body?.password||'');
 if(fullName.length<2||fullName.length>120)return json({ok:false,error:'Enter a valid full name.'},400);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({ok:false,error:'Enter a valid email address.'},400);
 if(!validMobile(mobile))return json({ok:false,error:'Enter a valid mobile number.'},400);
 if(password.length<8||password.length>128)return json({ok:false,error:'Password must be 8–128 characters.'},400);
 const existing=await env.DB.prepare('SELECT email,mobile FROM public_users WHERE email=? OR mobile=? LIMIT 1').bind(email,mobile).first();
 if(existing)return json({ok:false,error:existing.email===email?'An account already exists with this email.':'An account already exists with this mobile number.'},409);
 const {salt,hash}=await hashPassword(password);
 const result=await env.DB.prepare('INSERT INTO public_users (full_name,email,mobile,password_hash,password_salt) VALUES (?,?,?,?,?)').bind(fullName,email,mobile,hash,salt).run();
 const user={id:result.meta.last_row_id,full_name:fullName,email,mobile};
 return json({ok:true,user},201,{'Set-Cookie':sessionCookie(await createSession(env,user))});
}