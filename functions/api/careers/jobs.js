import {ensureCareerSchema,json} from '../../_lib/career.js';
export async function onRequestGet({env}){await ensureCareerSchema(env);const r=await env.DB.prepare("SELECT id,title,department,description,closing_at,created_at FROM career_jobs WHERE status='OPEN' AND (closing_at IS NULL OR closing_at>datetime('now')) ORDER BY created_at DESC").all();return json({ok:true,jobs:r.results||[]})}
