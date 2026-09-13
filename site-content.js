// Loaded on every public page. Live content + premium announcement + AI chat.

(async function loadLiveContent() {
  try {
    const res = await fetch('/api/content/public');
    if (!res.ok) return;
    const content = await res.json();
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (content[key] !== undefined) el.textContent = content[key];
    });
  } catch (e) { /* static defaults remain available */ }
})();

(function mountAnnouncement() {
  if (!document.body || document.getElementById('sn-announcement')) return;
  const bar = document.createElement('div');
  bar.id = 'sn-announcement';
  bar.setAttribute('role', 'status');
  bar.innerHTML = 'Springnexa Innovation Update <span class="sn-pill">LMIS COMING SOON</span> <span class="sn-pill">AI COMING SOON</span>';
  document.body.insertBefore(bar, document.body.firstChild);
})();

(function useLogoOnly() {
  function apply() {
    document.querySelectorAll('.brand').forEach(brand => {
      const img = brand.querySelector('img');
      if (!img) return;
      img.src = '/assets/springnexa-icon.svg?v=20260913';
      img.alt = 'Springnexa logo';
      brand.style.width = '64px';
      brand.style.height = '56px';
      brand.style.overflow = 'hidden';
      brand.style.display = 'flex';
      brand.style.alignItems = 'center';
      brand.style.flex = '0 0 64px';
      img.style.width = '56px';
      img.style.height = '56px';
      img.style.objectFit = 'contain';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();

(function mountChatWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #sn-chat-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--primary,#63a9ff),var(--primary2,#8c6cff));color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;z-index:1000;box-shadow:0 14px 38px rgba(0,0,0,.35);font-size:22px;display:flex;align-items:center;justify-content:center;transition:.25s}
    #sn-chat-btn:hover{transform:translateY(-4px) scale(1.04)}
    #sn-chat-panel{position:fixed;bottom:94px;right:24px;width:350px;max-height:500px;background:rgba(10,24,42,.94);backdrop-filter:blur(20px);color:var(--text,#f7fbff);border:1px solid var(--line,rgba(255,255,255,.11));border-radius:20px;box-shadow:0 28px 80px rgba(0,0,0,.42);display:none;flex-direction:column;z-index:1000;overflow:hidden}
    #sn-chat-panel.open{display:flex}
    #sn-chat-head{padding:16px 18px;border-bottom:1px solid var(--line,rgba(255,255,255,.11));font-weight:700;font-size:14px;background:linear-gradient(90deg,rgba(99,169,255,.1),rgba(140,108,255,.1))}
    #sn-chat-log{flex:1;overflow-y:auto;padding:16px;font-size:13.5px;display:flex;flex-direction:column;gap:10px}
    .sn-msg{max-width:86%;padding:9px 12px;border-radius:14px;line-height:1.45}
    .sn-msg.user{align-self:flex-end;background:linear-gradient(135deg,#4d91ed,#785be0);color:#fff}
    .sn-msg.bot{align-self:flex-start;background:rgba(255,255,255,.07);color:#dce7f4;border:1px solid rgba(255,255,255,.08)}
    #sn-chat-form{display:flex;border-top:1px solid var(--line,rgba(255,255,255,.11));padding:8px;background:rgba(255,255,255,.025)}
    #sn-chat-input{flex:1;border:0;background:transparent;color:#fff;padding:10px 12px;font-size:13.5px;font-family:inherit;outline:none}
    #sn-chat-input::placeholder{color:#8397af}
    #sn-chat-send{border:0;border-radius:12px;background:linear-gradient(135deg,#63a9ff,#8c6cff);color:#fff;padding:0 16px;cursor:pointer;font-weight:700}
    @media(max-width:600px){#sn-chat-panel{right:12px;left:12px;width:auto;bottom:82px}#sn-chat-btn{right:16px;bottom:16px}}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'sn-chat-btn';
  btn.setAttribute('aria-label', 'Chat with Springnexa assistant');
  btn.textContent = '💬';

  const panel = document.createElement('div');
  panel.id = 'sn-chat-panel';
  panel.innerHTML = `
    <div id="sn-chat-head">✦ Ask Springnexa</div>
    <div id="sn-chat-log"></div>
    <form id="sn-chat-form"><input id="sn-chat-input" type="text" placeholder="Ask about our divisions…" autocomplete="off"><button id="sn-chat-send" type="submit">Send</button></form>
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
    history.push({role:'user',content:text});
    addMsg('bot','…');
    const thinking = log.lastChild;
    try {
      const res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
      const data = await res.json();
      thinking.remove();
      if(res.ok){addMsg('bot',data.reply||"Sorry, I didn't get a response.");history.push({role:'assistant',content:data.reply||''});}
      else addMsg('bot','Sorry, the assistant is temporarily unavailable.');
    } catch(err){thinking.remove();addMsg('bot','Sorry, something went wrong reaching the assistant.');}
  });
})();
