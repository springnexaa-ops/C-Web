(function(){
  function productTabs(){
    document.querySelectorAll('body.home-page .nav-links').forEach(menu=>{if(menu.querySelector('.product-nav-ai'))return;const a=document.createElement('li');a.innerHTML='<a class="product-nav-ai" href="nexa-ai.html">NEXA AI <span>NEW</span></a>';const b=document.createElement('li');b.innerHTML='<a class="product-nav-lmis" href="nexa-lmis.html">NEXA LMIS <span>NEW</span></a>';const about=menu.querySelector('a[href="about.html"]')?.closest('li');if(about)about.after(a,b);else menu.append(a,b)});
    document.querySelectorAll('body.home-page .mobile-menu').forEach(menu=>{if(menu.querySelector('a[href="nexa-ai.html"]'))return;const a=document.createElement('a');a.href='nexa-ai.html';a.textContent='NEXA AI';const b=document.createElement('a');b.href='nexa-lmis.html';b.textContent='NEXA LMIS';const about=menu.querySelector('a[href="about.html"]');if(about)about.after(a,b);else menu.append(a,b)});
  }
  function mount(){
    if(!document.body.classList.contains('home-page'))return;
    productTabs();
    if(document.getElementById('sn-vision'))return;
    const section=document.createElement('section');section.id='sn-vision';section.className='sn-vision';
    section.innerHTML='<div class="wrap"><div class="sn-vision-head"><div><div class="eyebrow">A living Himalayan landscape</div><h2>Kashmir · Jammu · Ladakh — Through Every Season</h2></div><p>People · Innovation · Impact</p></div><div class="sn-season-intro">From Kashmir valleys to Jammu foothills and the high Himalayas of Ladakh, every season tells a different story.</div><div class="sn-vision-stage"><div class="sn-vision-track">'+[
      ['spring','Kashmir','Spring','Tulip gardens, apple blossoms and snow-fed valleys awaken.','KASHMIR · SPRING'],
      ['summer','Kashmir','Summer','Green meadows, clear lakes and long mountain days across the valley.','KASHMIR · SUMMER'],
      ['autumn','Kashmir','Autumn','Chinar leaves turn amber as orchards and mountain landscapes glow.','KASHMIR · AUTUMN'],
      ['winter','Kashmir','Winter','Snow-covered valleys, frozen landscapes and a quiet Himalayan winter.','KASHMIR · WINTER'],
      ['spring','Jammu','Spring','Fresh greenery and warm foothills welcome a new season in Jammu.','JAMMU · SPRING'],
      ['summer','Jammu','Summer','River plains, forested hills and vibrant city life under the summer sun.','JAMMU · SUMMER'],
      ['autumn','Jammu','Autumn','Golden foothills and clear skies frame the changing season.','JAMMU · AUTUMN'],
      ['winter','Jammu','Winter','Crisp mountain air and cool winter landscapes across the Jammu region.','JAMMU · WINTER'],
      ['spring','Ladakh','Spring','The high desert begins to emerge beneath the Himalayan sky.','LADAKH · SPRING'],
      ['summer','Ladakh','Summer','Blue skies, dramatic passes and high-altitude landscapes come alive.','LADAKH · SUMMER'],
      ['autumn','Ladakh','Autumn','Copper mountains, golden light and crystal-clear Himalayan horizons.','LADAKH · AUTUMN'],
      ['winter','Ladakh','Winter','Snow, ice and extraordinary silence across the high-altitude desert.','LADAKH · WINTER']
    ].map((x,i)=>'<article class="sn-slide season-'+x[0]+' region-'+x[1].toLowerCase()+'" data-index="'+i+'"><div class="sn-slide-glow"></div><div class="sn-slide-copy"><span class="sn-slide-kicker">'+x[1]+' · '+x[0]+'</span><h3>'+x[2]+'</h3><p>'+x[3]+'</p></div><span class="sn-slide-mark">'+x[4]+'</span><span class="sn-slide-number">'+String(i+1).padStart(2,'0')+' / 12</span></article>').join('')+'</div></div><div class="sn-season-labels"><span>❄ Winter</span><span>✦ Spring</span><span>☀ Summer</span><span>◌ Autumn</span></div><div class="sn-vision-controls" aria-label="Kashmir Jammu Ladakh seasons">'+Array.from({length:12},(_,i)=>'<button class="sn-dot" type="button" aria-label="Show season '+(i+1)+'"></button>').join('')+'</div></div>';
    const hero=document.querySelector('.reference-hero');if(hero&&hero.parentNode)hero.parentNode.insertBefore(section,hero.nextSibling);else document.body.prepend(section);
    const slides=[...section.querySelectorAll('.sn-slide')],dots=[...section.querySelectorAll('.sn-dot')];let current=0,timer;
    function render(){slides.forEach((s,i)=>{s.classList.remove('is-center','is-left','is-right','is-hidden');const d=(i-current+slides.length)%slides.length;if(d===0)s.classList.add('is-center');else if(d===1)s.classList.add('is-right');else if(d===slides.length-1)s.classList.add('is-left');else s.classList.add('is-hidden')});dots.forEach((d,i)=>{d.classList.toggle('active',i===current);d.setAttribute('aria-current',i===current?'true':'false')})}
    function reset(){clearInterval(timer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{current=(current+1)%slides.length;render()},3600)}
    dots.forEach((d,i)=>d.addEventListener('click',()=>{current=i;render();reset()}));section.addEventListener('mouseenter',()=>clearInterval(timer));section.addEventListener('mouseleave',reset);render();reset();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
