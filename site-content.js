// Shared Springnexa public-site enhancements: branding, structured divisions navigation, recognition strip and live content.
(function enhanceSiteChrome(){
  function apply(){
    let favicon=document.querySelector('link[data-springnexa-favicon]');
    if(!favicon){favicon=document.createElement('link');favicon.rel='icon';favicon.type='image/svg+xml';favicon.setAttribute('data-springnexa-favicon','true');document.head.appendChild(favicon)}
    favicon.href='/favicon.svg?v=20260913';

    document.querySelectorAll('.brand').forEach(brand=>{
      const img=brand.querySelector('img'); if(!img)return;
      img.src='/assets/springnexa-logo.svg?v=20260913'; img.alt='Springnexa Private Limited logo';
      img.removeAttribute('width'); img.removeAttribute('height');
      brand.style.width='auto';brand.style.height='auto';brand.style.overflow='visible';brand.style.display='flex';brand.style.alignItems='center';brand.style.flex='0 0 auto';
      img.style.width='190px';img.style.height='58px';img.style.objectFit='contain';img.style.objectPosition='left center';img.style.display='block';
    });

    document.querySelectorAll('.nav-links').forEach(menu=>{
      if(menu.querySelector('.division-nav'))return;
      ['healthcare.html','it.html','social-welfare.html'].forEach(path=>menu.querySelector(`a[href="${path}"]`)?.closest('li')?.remove());
      const li=document.createElement('li');li.className='division-nav';
      li.innerHTML='<a href="#" class="division-toggle">Divisions <span>⌄</span></a><div class="division-dropdown"><a href="healthcare.html"><strong>Healthcare</strong><small>Neurophysiology &amp; Digital Health</small></a><a href="it.html"><strong>Information Technology</strong><small>Software, AI &amp; Digital Infrastructure</small></a><a href="social-welfare.html"><strong>Social Welfare</strong><small>Community &amp; Social Impact</small></a></div>';
      const about=menu.querySelector('a[href="about.html"]')?.closest('li');
      if(about)about.after(li);else menu.appendChild(li);
    });

    document.querySelectorAll('.mobile-menu').forEach(menu=>{
      if(menu.querySelector('details[data-divisions]'))return;
      ['healthcare.html','it.html','social-welfare.html'].forEach(path=>menu.querySelector(`a[href="${path}"]`)?.remove());
      const d=document.createElement('details');d.dataset.divisions='true';
      d.innerHTML='<summary>Divisions</summary><a href="healthcare.html">Healthcare</a><a href="it.html">Information Technology</a><a href="social-welfare.html">Social Welfare</a>';
      const about=menu.querySelector('a[href="about.html"]');
      if(about)about.after(d);else menu.appendChild(d);
    });

    document.querySelectorAll('.nav').forEach(nav=>{
      if(!nav.querySelector('.header-tagline')){
        const tagline=document.createElement('span');tagline.className='header-tagline';tagline.textContent='Technology for a Healthier, Stronger Tomorrow';
        const search=document.createElement('button');search.className='header-search';search.type='button';search.setAttribute('aria-label','Search');search.textContent='⌕';
        nav.insertBefore(tagline,nav.querySelector('.nav-cta'));nav.insertBefore(search,nav.querySelector('.nav-cta'));
      }
    });

    if(!document.getElementById('sn-recognition-strip')){
      const bar=document.createElement('div');bar.id='sn-recognition-strip';bar.innerHTML='<div class="recognition-inner"><span class="recognition-label">Recognitions &amp; Registrations</span><span class="recognition-badge"><b>DPIIT</b> Registered</span><span class="recognition-badge"><b>StartupJK · JKEDI</b> Recognised</span><span class="recognition-badge"><b>BIRAC</b> Registered</span></div>';
      const announcement=document.getElementById('sn-announcement');
      if(announcement&&announcement.parentNode)announcement.parentNode.insertBefore(bar,announcement.nextSibling);else document.body.insertBefore(bar,document.body.firstChild);
    }

    document.querySelectorAll('footer nav').forEach(nav=>{
      if(!nav.querySelector('a[href="team.html"]')){const a=document.createElement('a');a.href='team.html';a.textContent='Our Team';nav.appendChild(a)}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();

(async function loadLiveContent(){try{const res=await fetch('/api/content/public');if(!res.ok)return;const content=await res.json();document.querySelectorAll('[data-key]').forEach(el=>{const key=el.getAttribute('data-key');if(content[key]!==undefined)el.textContent=content[key]})}catch(e){}})();

(function mountChatWidget(){
  const style=document.createElement('style');style.textContent=`#sn-chat-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#0878c9,#35b9ec);color:#fff;border:0;cursor:pointer;z-index:1000;box-shadow:0 14px 38px rgba(7,89,133,.25);font-size:22px;display:flex;align-items:center;justify-content:center;transition:.25s}#sn-chat-btn:hover{transform:translateY(-4px) scale(1.04)}#sn-chat-panel{position:fixed;bottom:94px;right:24px;width:350px;max-height:500px;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);color:#17324d;border:1px solid #d7eaf5;border-radius:20px;box-shadow:0 28px 80px rgba(7,89,133,.22);display:none;flex-direction:column;z-index:1000;overflow:hidden}#sn-chat-panel.open{display:flex}#sn-chat-head{padding:16px 18px;border-bottom:1px solid #d7eaf5;font-weight:800;font-size:14px;background:#eef9ff}#sn-chat-log{flex:1;overflow-y:auto;padding:16px;font-size:13.5px;display:flex;flex-direction:column;gap:10px}.sn-msg{max-width:86%;padding:9px 12px;border-radius:14px;line-height:1.45}.sn-msg.user{align-self:flex-end;background:linear-gradient(135deg,#0878c9,#35b9ec);color:#fff}.sn-msg.bot{align-self:flex-start;background:#f2f9fd;color:#31566d;border:1px solid #dcecf5}#sn-chat-form{display:flex;border-top:1px solid #d7eaf5;padding:8px;background:#fff}#sn-chat-input{flex:1;border:0;background:transparent;color:#17324d;padding:10px 12px;font-size:13.5px;font-family:inherit;outline:none}#sn-chat-send{border:0;border-radius:12px;background:#0878c9;color:#fff;padding:0 16px;cursor:pointer;font-weight:700}@media(max-width:600px){#sn-chat-panel{right:12px;left:12px;width:auto;bottom:82px}#sn-chat-btn{right:16px;bottom:16px}}`;document.head.appendChild(style);
  const btn=document.createElement('button');btn.id='sn-chat-btn';btn.setAttribute('aria-label','Chat with Springnexa assistant');btn.textContent='💬';const panel=document.createElement('div');panel.id='sn-chat-panel';panel.innerHTML='<div id="sn-chat-head">✦ Ask Springnexa</div><div id="sn-chat-log"></div><form id="sn-chat-form"><input id="sn-chat-input" type="text" placeholder="Ask about our divisions…" autocomplete="off"><button id="sn-chat-send" type="submit">Send</button></form>';document.body.appendChild(btn);document.body.appendChild(panel);const log=panel.querySelector('#sn-chat-log');const history=[];function addMsg(role,text){const div=document.createElement('div');div.className=`sn-msg ${role==='user'?'user':'bot'}`;div.textContent=text;log.appendChild(div);log.scrollTop=log.scrollHeight}addMsg('bot',"Hi — I can answer questions about Springnexa's Healthcare, IT, and Social Welfare divisions. What would you like to know?");btn.addEventListener('click',()=>panel.classList.toggle('open'));panel.querySelector('#sn-chat-form').addEventListener('submit',async e=>{e.preventDefault();const input=panel.querySelector('#sn-chat-input');const text=input.value.trim();if(!text)return;input.value='';addMsg('user',text);history.push({role:'user',content:text});addMsg('bot','…');const thinking=log.lastChild;try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});const data=await res.json();thinking.remove();if(res.ok){addMsg('bot',data.reply||"Sorry, I didn't get a response.");history.push({role:'assistant',content:data.reply||''})}else addMsg('bot','Sorry, the assistant is temporarily unavailable.')}catch(err){thinking.remove();addMsg('bot','Sorry, something went wrong reaching the assistant.')}})} )();
