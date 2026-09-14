(function(){
  function productTabs(){
    document.querySelectorAll('body.home-page .nav-links').forEach(menu=>{if(menu.querySelector('.product-nav-ai'))return;const a=document.createElement('li');a.innerHTML='<a class="product-nav-ai" href="nexa-ai.html">NEXA AI <span>NEW</span></a>';const b=document.createElement('li');b.innerHTML='<a class="product-nav-lmis" href="nexa-lmis.html">NEXA LMIS <span>NEW</span></a>';const about=menu.querySelector('a[href="about.html"]')?.closest('li');if(about)about.after(a,b);else menu.append(a,b)});
    document.querySelectorAll('body.home-page .mobile-menu').forEach(menu=>{if(menu.querySelector('a[href="nexa-ai.html"]'))return;const a=document.createElement('a');a.href='nexa-ai.html';a.textContent='NEXA AI';const b=document.createElement('a');b.href='nexa-lmis.html';b.textContent='NEXA LMIS';const about=menu.querySelector('a[href="about.html"]');if(about)about.after(a,b);else menu.append(a,b)});
  }
  const seasons=[
    ['Kashmir','Spring','Dal Lake, Srinagar','Paradise on Earth','https://images.unsplash.com/photo-1715933787517-6082995e0d07?auto=format&fit=crop&w=2200&q=90'],
    ['Kashmir','Summer','Kashmir Valley','Green valleys, clear lakes and mountain days','https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=2200&q=90'],
    ['Kashmir','Autumn','Srinagar & Kashmir','Chinar gold across the valley','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Kashmir','Winter','Kashmir Valley','A quiet Himalayan winter','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Jammu','Spring','Jammu Region','Fresh foothills and heritage landscapes','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Jammu','Summer','Jammu Region','Rivers, forests and warm foothills','https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=2200&q=90'],
    ['Jammu','Autumn','Jammu Region','Golden hills beneath clear skies','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Jammu','Winter','Jammu Region','Crisp air across the foothills','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Ladakh','Spring','Ladakh','The high desert awakens','https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=2200&q=90'],
    ['Ladakh','Summer','Ladakh','Blue skies and high Himalayan passes','https://images.unsplash.com/photo-1659245123387-0ef44b7d55b6?auto=format&fit=crop&w=2200&q=90'],
    ['Ladakh','Autumn','Ladakh','Copper mountains and golden light','https://images.unsplash.com/photo-1542003488933-7cfa7453807a?auto=format&fit=crop&w=2200&q=90'],
    ['Ladakh','Winter','Ladakh','Snow, ice and Himalayan silence','https://images.unsplash.com/photo-1673947692587-d39df79fa52c?auto=format&fit=crop&w=2200&q=90']
  ];
  function mount(){
    if(!document.body.classList.contains('home-page'))return;
    productTabs();
    const hero=document.querySelector('.reference-hero');
    if(!hero||hero.dataset.cinematic==='1')return;
    hero.dataset.cinematic='1';
    hero.classList.add('cinematic-hero');
    const stage=document.createElement('div');stage.className='cinematic-stage';
    stage.innerHTML='<div class="cinematic-main"><div class="cinematic-main-copy"><span class="cinematic-kicker">KASHMIR · SPRING</span><h2>Paradise on Earth</h2><p>Dal Lake, Srinagar</p></div><div class="cinematic-location">01 / 12<br><small>Dal Lake, Srinagar</small></div><button class="cinematic-arrow cinematic-prev" type="button" aria-label="Previous season">‹</button><button class="cinematic-arrow cinematic-next" type="button" aria-label="Next season">›</button></div><div class="cinematic-thumbs" role="tablist" aria-label="Kashmir Jammu Ladakh seasons">'+seasons.map((s,i)=>'<button class="cinematic-thumb" type="button" role="tab" data-index="'+i+'" aria-label="'+s[0]+' '+s[1]+'"><img src="'+s[4]+'" alt="'+s[0]+' '+s[1]+' landscape" loading="lazy"><span><b>'+s[0].toUpperCase()+'</b><strong>'+s[1]+'</strong></span></button>').join('')+'</div><div class="cinematic-dots">'+seasons.map((_,i)=>'<i data-index="'+i+'"></i>').join('')+'</div>';
    hero.appendChild(stage);
    const main=stage.querySelector('.cinematic-main'),copy=stage.querySelector('.cinematic-main-copy'),kicker=stage.querySelector('.cinematic-kicker'),loc=stage.querySelector('.cinematic-location'),thumbs=[...stage.querySelectorAll('.cinematic-thumb')],dots=[...stage.querySelectorAll('.cinematic-dots i')];
    let current=0,timer;
    function render(){const s=seasons[current];main.style.backgroundImage='url("'+s[4]+'")';kicker.textContent=s[0].toUpperCase()+' · '+s[1].toUpperCase();copy.querySelector('h2').textContent=s[1];copy.querySelector('p').textContent=s[2];loc.innerHTML=String(current+1).padStart(2,'0')+' / 12<br><small>'+s[3]+'</small>';thumbs.forEach((t,i)=>{t.classList.toggle('active',i===current);t.setAttribute('aria-selected',i===current?'true':'false')});dots.forEach((d,i)=>d.classList.toggle('active',i===current))}
    function reset(){clearInterval(timer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{current=(current+1)%seasons.length;render()},5000)}
    function go(i){current=(i+seasons.length)%seasons.length;render();reset()}
    thumbs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));stage.querySelector('.cinematic-prev').addEventListener('click',()=>go(current-1));stage.querySelector('.cinematic-next').addEventListener('click',()=>go(current+1));
    stage.addEventListener('mouseenter',()=>clearInterval(timer));stage.addEventListener('mouseleave',reset);render();reset();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
