import { json } from '../../_lib/admin-auth.js';

export async function onRequestPost({ request, env }) {
  const provided = request.headers.get('X-Admin-Bootstrap-Key') || '';
  if (!env.ADMIN_BOOTSTRAP_KEY || provided !== env.ADMIN_BOOTSTRAP_KEY) {
    return json({ error: 'Forbidden.' }, 403);
  }

  // Legacy DB bootstrap is intentionally disabled. C-Web now authenticates
  // administrators exclusively through the ADMIN_TOKEN + signed session flow.
  return json({
    ok: false,
    error: 'Admin bootstrap is disabled. Configure ADMIN_TOKEN and use /admin/login.html.'
  }, 410);
}
