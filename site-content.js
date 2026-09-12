// Loaded on every public page. Two jobs:
// 1) Fetch live content from /api/content/public and drop it into any element
//    with a matching data-key attribute (progressive enhancement — the static
//    HTML already has sensible defaults, this just overrides them when live
//    content differs).
// 2) Mount the AI chat widget.

(async function loadLiveContent() {
  try {
    const res = await fetch('/api/content/public');
    if (!res.ok) return;
    const content = await res.json();
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (content[key] !== undefined) el.textContent = content[key];
    });
  } catch (e) { /* fall back to static defaults silently */ }
})();

(function mountChatWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #sn-chat-btn{ position:fixed; bottom:22px; right:22px; width:52px; height:52px; border-radius:50%;
      background:var(--blue); color:#fff; border:none; cursor:pointer; z-index:1000;
      box-shadow:0 4px 14px rgba(20,30,40,.25); font-size:22px; display:flex; align-items:center; justify-content:center; }
    #sn-chat-panel{ position:fixed; bottom:86px; right:22px; width:320px; max-height:440px; background:var(--panel,#fff);
      border:1px solid var(--line,#DAD6CC); border-radius:8px; box-shadow:0 10px 30px rgba(20,30,40,.18);
      display:none; flex-direction:column; z-index:1000; overflow:hidden; }
    #sn-chat-panel.open{ display:flex; }
    #sn-chat-head{ padding:12px 14px; border-bottom:1px solid var(--line,#DAD6CC); font-weight:600; font-size:14px; }
    #sn-chat-log{ flex:1; overflow-y:auto; padding:12px 14px; font-size:13.5px; display:flex; flex-direction:column; gap:10px; }
    .sn-msg{ max-width:85%; padding:8px 11px; border-radius:6px; line-height:1.4; }
    .sn-msg.user{ align-self:flex-end; background:var(--blue,#21456F); color:#fff; }
    .sn-msg.bot{ align-self:flex-start; background:#EFEEE9; color:#14171C; }
    #sn-chat-form{ display:flex; border-top:1px solid var(--line,#DAD6CC); }
    #sn-chat-input{ flex:1; border:none; padding:10px 12px; font-size:13.5px; font-family:inherit; }
    #sn-chat-input:focus{ outline:none; }
    #sn-chat-send{ border:none; background:var(--blue,#21456F); color:#fff; padding:0 16px; cursor:pointer; font-weight:600; }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'sn-chat-btn';
  btn.setAttribute('aria-label', 'Chat with Springnexa assistant');
  btn.textContent = '💬';

  const panel = document.createElement('div');
  panel.id = 'sn-chat-panel';
  panel.innerHTML = `
    <div id="sn-chat-head">Ask Springnexa</div>
    <div id="sn-chat-log"></div>
    <form id="sn-chat-form">
      <input id="sn-chat-input" type="text" placeholder="Ask about our divisions…" autocomplete="off">
      <button id="sn-chat-send" type="submit">Send</button>
    </form>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const log = panel.querySelector('#sn-chat-log');
  const history = [];

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = `sn-msg ${role === 'user' ? 'user' : 'bot'}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  addMsg('bot', "Hi — I can answer questions about Springnexa's Healthcare, IT, and Social Welfare divisions. What would you like to know?");

  btn.addEventListener('click', () => panel.classList.toggle('open'));

  panel.querySelector('#sn-chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = panel.querySelector('#sn-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });

    addMsg('bot', '…');
    const thinking = log.lastChild;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      thinking.remove();
      if (res.ok) {
        addMsg('bot', data.reply || "Sorry, I didn't get a response.");
        history.push({ role: 'assistant', content: data.reply || '' });
      } else {
        addMsg('bot', 'Sorry, the assistant is temporarily unavailable.');
      }
    } catch (err) {
      thinking.remove();
      addMsg('bot', 'Sorry, something went wrong reaching the assistant.');
    }
  });
})();
