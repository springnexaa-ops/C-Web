// POST /api/chat  { messages: [{ role: 'user'|'assistant', content: string }, ...] }
// Public endpoint (site visitors use this via the chat widget). The API key never
// reaches the browser — it's read from a Cloudflare Pages environment variable
// and used only in this server-side function.

const SYSTEM_PROMPT = `You are the website assistant for Springnexa Private Limited, a company registered in India (CIN U86900JK2026PTC018519, incorporated 10 Jan 2026, registered office in Kulgam, Jammu & Kashmir). Springnexa operates three divisions:
- Healthcare: diagnostic services and healthcare training programs
- IT: website hosting, infrastructure, and technical operations
- Social Welfare: community programs and welfare initiatives in Kulgam and the surrounding area

Answer visitor questions about Springnexa using only this information. If asked something you don't have specific facts about (pricing, exact services, staff, appointment booking), say so plainly and direct them to the Contact page rather than guessing. Keep answers brief and to the point.`;

export async function onRequestPost({ request, env }) {
  const { messages } = await request.json().catch(() => ({ messages: [] }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages provided.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  // Keep the payload small and bounded
  const trimmed = messages.slice(-12).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000)
  }));

  const provider = (env.AI_PROVIDER || 'anthropic').toLowerCase();

  try {
    let reply;
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.AI_API_KEY}` },
        body: JSON.stringify({
          model: env.AI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
          max_tokens: 500
        })
      });
      if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      reply = data.choices?.[0]?.message?.content || '';
    } else {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.AI_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: env.AI_MODEL || 'claude-sonnet-4-6',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: trimmed
        })
      });
      if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      reply = (data.content || []).map(b => b.text || '').join('\n');
    }

    return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'The assistant is temporarily unavailable.' }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}
