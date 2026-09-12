// GET /api/content/public -> { key: value, ... }  (no auth — this feeds the live site pages)

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT key, value FROM site_content').all();
  const map = {};
  for (const row of results) map[row.key] = row.value;
  return new Response(JSON.stringify(map), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
  });
}
