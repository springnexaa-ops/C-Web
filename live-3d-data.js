(function(){
  function mount(){
    if(!document.body.classList.contains('home-page')||document.querySelector('.sn-live-data'))return;
    const anchor=document.querySelector('.recognition-section');
    if(!anchor)return;
    const section=document.createElement('section');
    section.className='sn-live-data';
    section.setAttribute('aria-labelledby','sn-live-title');
    section.innerHTML='<div class="wrap"><div class="sn-live-head"><div><div class="eyebrow">LIVE PLATFORM DATA</div><h2 id="sn-live-title">SpringNexa in 3D</h2><p>A live visual layer for public platform signals, operating footprint and published service metrics.</p></div><div class="sn-live-status"><i aria-hidden="true"></i><span>LIVE · <b id="sn-live-clock">--:--:--</b></span></div></div><div class="sn-live-grid"><div class="sn-globe"><div class="sn-globe-core" aria-label="Animated 3D network visualization"><span class="sn-orbit"></span><span class="sn-node"></span><span class="sn-node"></span><span class="sn-node"></span><span class="sn-node"></span><span class="sn-node"></span></div><div class="sn-globe-label"><b>Connected SpringNexa</b>Healthcare · IT · Social Welfare</div></div><div class="sn-live-cards"><article class="sn-live-card"><small>Patients served</small><strong>1,900+</strong><span>Published operating metric</span><div class="bar"><i style="--w:86%"></i></div></article><article class="sn-live-card"><small>Healthcare procedures</small><strong>12+</strong><span>Published service count</span><div class="bar"><i style="--w:68%"></i></div></article><article class="sn-live-card"><small>Core divisions</small><strong>3</strong><span>Healthcare · IT · Social Welfare</span><div class="bar"><i style="--w:54%"></i></div></article><article class="sn-live-card"><small>District showcase</small><strong>22</strong><span>J&amp;K + Ladakh locations</span><div class="bar"><i style="--w:92%"></i></div></article></div></div><div class="sn-live-footer"><span>Data refresh: <b id="sn-live-refresh">live browser clock</b></span><span>3D layer is interactive and respects reduced-motion settings.</span></div></div>';
    anchor.after(section);
    const clock=section.querySelector('#sn-live-clock');
    const refresh=section.querySelector('#sn-live-refresh');
    function tick(){const now=new Date();clock.textContent=now.toLocaleTimeString([], {hour12:false});refresh.textContent='updated '+now.toLocaleTimeString([], {hour12:false})}
    tick();setInterval(tick,1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
