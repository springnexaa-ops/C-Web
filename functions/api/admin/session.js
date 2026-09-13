import { getAdmin, json } from '../../_lib/admin-auth.js';

export async function onRequestGet({ request, env }) {
  const admin = await getAdmin(request, env);
  if (!admin) return json({ loggedIn: false }, 401);
  return json({ loggedIn: true, username: admin.username });
}
