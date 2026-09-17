(function(){
  const districts=[
    ['Srinagar','Kashmir','Dal Lake, houseboats and Himalayan reflections','Paradise on Earth','https://images.unsplash.com/photo-1715933787517-6082995e0d07?auto=format&fit=crop&w=2200&q=90'],
    ['Anantnag','Kashmir','Lidder Valley, meadows and mountain gateways','South Kashmir landscape','https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=2200&q=90'],
    ['Bandipora','Kashmir','Wular Lake, alpine valleys and high mountains','Lake & mountain country','https://images.unsplash.com/photo-1715933787517-6082995e0d07?auto=format&fit=crop&w=2200&q=90'],
    ['Baramulla','Kashmir','Jhelum Valley, orchards and mountain foothills','Gateway to the valley','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Budgam','Kashmir','Green meadows, springs and Pir Panjal foothills','Meadows of central Kashmir','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Doda','Jammu','Chenab valleys, forests and high mountain terrain','Chenab Himalayan landscape','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Ganderbal','Kashmir','Sindh Valley, alpine routes and mountain lakes','Gateway to Sonamarg','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Jammu','Jammu','Heritage, temples, Tawi River and Shivalik foothills','City of temples','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Kathua','Jammu','Ravi basin, Shivalik hills and heritage country','Gateway of Jammu','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Kishtwar','Jammu','Chenab highlands, forests and dramatic mountain passes','Land of high mountains','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Kulgam','Kashmir','Apple orchards, Aharbal and Pir Panjal views','Heart of South Kashmir','https://images.unsplash.com/photo-1715933787517-6082995e0d07?auto=format&fit=crop&w=2200&q=90'],
    ['Kupwara','Kashmir','Lolab Valley, alpine forests and frontier mountains','Valleys of northern Kashmir','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Poonch','Jammu','Pir Panjal valleys, forts and mountain horizons','Pir Panjal heritage','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Pulwama','Kashmir','Saffron fields, streams and mountain foothills','Saffron country','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Rajouri','Jammu','Green valleys, forts and Pir Panjal landscapes','Mountain heritage of Jammu','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Ramban','Jammu','Chenab gorge, forests and Himalayan highways','Chenab gateway','https://images.unsplash.com/photo-1619882192505-0567dda66058?auto=format&fit=crop&w=2200&q=90'],
    ['Reasi','Jammu','Trikuta hills, Chenab landscapes and sacred routes','Hills, rivers and heritage','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Samba','Jammu','Shivalik foothills, temples and plains meeting mountains','Borderland heritage','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Shopian','Kashmir','Apple orchards, alpine meadows and mountain passes','Apple bowl of Kashmir','https://images.unsplash.com/photo-1731083704547-024b82e8bfef?auto=format&fit=crop&w=2200&q=90'],
    ['Udhampur','Jammu','Pine forests, hill towns and Chenani landscapes','Green hills of Jammu','https://images.unsplash.com/photo-1623612175509-30e97f5aa195?auto=format&fit=crop&w=2200&q=90'],
    ['Leh','Ladakh','High-altitude desert, monasteries and vast Himalayan skies','Land of high passes','https://images.unsplash.com/photo-1659245123387-0ef44b7d55b6?auto=format&fit=crop&w=2200&q=90'],
    ['Kargil','Ladakh','Surus Valley, rugged mountains and Himalayan heritage','Gateway to Ladakh','https://images.unsplash.com/photo-1673947692587-d39df79fa52c?auto=format&fit=crop&w=2200&q=90']
  ];

  function mount(){
    if(!document.body.classList.contains('home-page'))return;
    const hero=document.querySelector('.reference-hero');
    if(!hero||hero.dataset.cinematic==='1')return;
    hero.dataset.cinematic='1';
    hero.classList.add('cinematic-hero');
    const stage=document.createElement('div');
    stage.className='cinematic-stage';
    stage.innerHTML='<div class="cinematic-main"><div class="cinematic-main-copy"><span class="cinematic-kicker"></span><h2></h2><p></p></div><div class="cinematic-location"></div><button class="cinematic-arrow cinematic-prev" type="button" aria-label="Previous district">‹</button><button class="cinematic-arrow cinematic-next" type="button" aria-label="Next district">›</button></div><div class="cinematic-thumbs" role="tablist" aria-label="Jammu Kashmir and Ladakh districts">'+districts.map((d,i)=>'<button class="cinematic-thumb" type="button" role="tab" data-index="'+i+'" aria-label="'+d[0]+' district, '+d[1]+'"><img src="'+d[4]+'" alt="'+d[0]+' '+d[1]+' landscape" loading="lazy"><span><b>'+d[1].toUpperCase()+'</b><strong>'+d[0]+'</strong></span></button>').join('')+'</div><div class="cinematic-dots">'+districts.map((_,i)=>'<i data-index="'+i+'" aria-label="District '+(i+1)+'"></i>').join('')+'</div>';
    hero.appendChild(stage);

    const main=stage.querySelector('.cinematic-main');
    const copy=stage.querySelector('.cinematic-main-copy');
    const kicker=stage.querySelector('.cinematic-kicker');
    const location=stage.querySelector('.cinematic-location');
    const thumbs=[...stage.querySelectorAll('.cinematic-thumb')];
    const dots=[...stage.querySelectorAll('.cinematic-dots i')];
    let current=10;
    let timer;

    function render(){
      const d=districts[current];
      main.style.backgroundImage='url("'+d[4]+'")';
      kicker.textContent=d[1].toUpperCase()+' · '+d[0].toUpperCase();
      copy.querySelector('h2').textContent=d[0];
      copy.querySelector('p').textContent=d[2];
      location.innerHTML=String(current+1).padStart(2,'0')+' / '+districts.length+'<br><small>'+d[3]+'</small>';
      thumbs.forEach((t,i)=>{const active=i===current;t.classList.toggle('active',active);t.setAttribute('aria-selected',active?'true':'false')});
      dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
    }
    function reset(){
      clearInterval(timer);
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        timer=setInterval(()=>{current=(current+1)%districts.length;render()},6000);
      }
    }
    function go(index){current=(index+districts.length)%districts.length;render();reset()}
    thumbs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));
    dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
    stage.querySelector('.cinematic-prev').addEventListener('click',()=>go(current-1));
    stage.querySelector('.cinematic-next').addEventListener('click',()=>go(current+1));
    stage.addEventListener('mouseenter',()=>clearInterval(timer));
    stage.addEventListener('mouseleave',reset);
    render();
    reset();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
