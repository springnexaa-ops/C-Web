import { clearSession } from '../../_lib/admin-auth.js';

export async function onRequestPost({ request, env }) {
  return clearSession(request, env);
}
