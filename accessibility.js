/* SpringNexa accessibility controls — external script for CSP compatibility. */
(function(){
  const root=document.documentElement;
  const key='sn-font-scale';
  const clamp=n=>Math.min(20,Math.max(13,n));
  const apply=n=>{const value=clamp(n);root.style.fontSize=value+'px';try{localStorage.setItem(key,String(value))}catch(_){}};
  try{const saved=Number(localStorage.getItem(key));if(saved)apply(saved)}catch(_){}
  document.querySelectorAll('[data-font-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const current=parseFloat(getComputedStyle(root).fontSize)||16;
    const action=btn.dataset.fontAction;
    apply(action==='increase'?current+1:action==='decrease'?current-1:16);
  }));
})();