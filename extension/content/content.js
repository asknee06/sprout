(() => {
 let state,adapter,current=null,busy=false,timer,lastURL=location.href;const evaluated=new Set();
 const host=document.createElement('div');host.id='sprout-root';host.style.cssText='all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647';
 const shadow=host.attachShadow({mode:'open'});document.documentElement.append(host);
 shadow.innerHTML=`<style>:host{all:initial}*{box-sizing:border-box}button{font:inherit;cursor:pointer} .veil{position:fixed;inset:0;display:grid;place-items:center;background:#13261d33;pointer-events:auto;font:14px/1.5 system-ui;color:#244735}.card{width:min(380px,calc(100vw - 32px));padding:28px;text-align:center;border:1px solid #ffffffb3;border-radius:28px;background:#f4f8f0e8;backdrop-filter:blur(24px);box-shadow:0 24px 90px #0b251d33}.tree{height:230px}.tree svg{height:100%}h2{font-size:23px;line-height:1.25;font-weight:500;letter-spacing:-.6px;margin:10px 0}p{color:#718273}.eyebrow{font-size:10px;letter-spacing:2px}.actions{display:grid;gap:9px;margin-top:22px}.actions button{padding:13px;border-radius:14px;border:1px solid #315b4420;background:#ffffff80;color:#315b44}.actions button:first-child{background:#315b44;color:white}small{display:block;opacity:.75;font-size:11px}button:focus-visible{outline:3px solid #9bbca0;outline-offset:3px}.pill{position:fixed;bottom:24px;right:24px;border:1px solid #ffffffb0;border-radius:24px;background:#f4f8f0e8;backdrop-filter:blur(18px);box-shadow:0 6px 30px #16302220;display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 18px 10px;width:210px;max-width:calc(100vw - 16px);pointer-events:auto;color:#315b44;font:12px system-ui}.pill svg{height:194px;width:174px;max-width:100%;filter:drop-shadow(0 4px 6px #254b3020)}.pill meter{display:block;width:65px;height:6px;accent-color:#548667}.pill,.card{cursor:grab;touch-action:none}.pill:active,.card:active{cursor:grabbing}.pill{user-select:none}.widget-controls{display:grid;gap:4px;text-align:center;width:100%;font-size:10px;color:#718573}.pill meter{width:100%;height:4px}.widget-toggle{opacity:.7}.tree-hero{position:relative;width:100%;display:grid;place-items:center}.choice-feedback{min-height:30px;text-align:center;font:11px/1.4 system-ui;color:#486e4f}.choice-feedback.loss{color:#967047}.tree-hero svg{transform-origin:50% 90%}.tree-hero.gain svg{animation:nurture 1.1s ease-out}.tree-hero.loss svg{animation:droop 1.2s ease-in-out}.tree-hero.pet svg{animation:nurture .8s ease-out}.particle{position:absolute;left:50%;top:44%;pointer-events:none;font:17px system-ui;animation:float-leaf 1.8s ease-out both;animation-delay:var(--delay);color:#6c9a65;--direction:-90px}.loss .particle{color:#b19560;--direction:85px}@keyframes nurture{0%{transform:scale(.9) rotate(-4deg)}40%{transform:scale(1.12) rotate(4deg);filter:drop-shadow(0 0 14px #a9cd7d)}75%{transform:scale(1.04) rotate(-2deg)}100%{transform:scale(1)}}@keyframes droop{0%{transform:rotate(0)}25%{transform:rotate(-8deg) scale(.94)}55%{transform:rotate(6deg) scale(.96)}80%{transform:rotate(-3deg)}100%{transform:rotate(0)}}@keyframes float-leaf{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--direction)) rotate(80deg)}}@media(prefers-reduced-motion:reduce){.tree-hero svg,.particle{animation:none!important}.particle{display:none}}.widget-toggle{background:transparent;border:0;color:#315b44;padding:4px;font:11px system-ui}.card{max-height:calc(100vh - 16px);overflow:auto}.notice{min-height:18px;font-size:12px}</style><div id="badge"></div><div id="modal"></div>`;
 const modal=shadow.querySelector('#modal'),badge=shadow.querySelector('#badge');let collapsed=false,previousFocus;

 let positions={},positionLoaded=false,badgeKey='',dragging=false,feedback=null,feedbackTimer,petTimer;
 function applyState(next){const before=state;state=next;if(before&&(next.videosSkipped>before.videosSkipped||next.videosWatched>before.videosWatched)){const gain=next.videosSkipped>before.videosSkipped;const hp=next.health-before.health,xp=next.xp-before.xp;const delta=n=>(n>0?'+':'')+n;feedback={kind:gain?'gain':'loss',text:(next.stage>before.stage?'New growth stage! ':gain?'A little stronger. ':'Your tree droops. ')+delta(hp)+' HP · '+delta(xp)+' XP'};clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>{feedback=null;renderBadge();},4000);}renderBadge();}

 let suppressTreeClick=false;
 const moveHandlers=new Map();
 function clampPosition(x,y,width,height){return{x:Math.max(8,Math.min(x,Math.max(8,innerWidth-width-8))),y:Math.max(8,Math.min(y,Math.max(8,innerHeight-height-8)))};}
 function place(el,key,x,y){const r=el.getBoundingClientRect(),p=clampPosition(x,y,r.width,r.height);el.style.position='fixed';el.style.left=p.x+'px';el.style.top=p.y+'px';el.style.right='auto';el.style.bottom='auto';positions[key]=p;}
 function savePositions(){chrome.storage.local.set({sproutPositions:positions}).catch(()=>{});}
 function movable(el,handle,key){
   moveHandlers.set(key,el);
   if(positions[key])place(el,key,positions[key].x,positions[key].y);
   let drag=null;
   handle.onpointerdown=e=>{if(e.button!==0||e.target.closest('button,input,select,textarea,a'))return;e.preventDefault();e.stopPropagation();const r=el.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};suppressTreeClick=false;dragging=true;handle.setPointerCapture(e.pointerId);};
   handle.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;e.preventDefault();if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>5)suppressTreeClick=true;place(el,key,drag.left+e.clientX-drag.x,drag.top+e.clientY-drag.y);};
   const finish=e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;dragging=false;savePositions();setTimeout(()=>{suppressTreeClick=false;},0);};
   handle.onpointerup=finish;handle.onpointercancel=finish;handle.onlostpointercapture=finish;
   handle.onkeydown=e=>{if(e.target!==handle)return;const steps={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const step=steps[e.key];if(!step)return;e.preventDefault();e.stopPropagation();const r=el.getBoundingClientRect(),amount=e.shiftKey?40:10;place(el,key,r.left+step[0]*amount,r.top+step[1]*amount);savePositions();};
 }
 chrome.storage.local.get('sproutPositions').then(r=>{positions=Object.fromEntries(Object.entries(r.sproutPositions||{}).filter(([k,v])=>['badge','prompt'].includes(k)&&Number.isFinite(v?.x)&&Number.isFinite(v?.y)));positionLoaded=true;badgeKey='';renderBadge();const card=modal.querySelector('.card');if(card&&positions.prompt)place(card,'prompt',positions.prompt.x,positions.prompt.y);});
 window.addEventListener('resize',()=>{for(const [key,el]of moveHandlers){if(el.isConnected&&positions[key])place(el,key,positions[key].x,positions[key].y);}savePositions();});
 function renderBadge(){
   if(dragging)return;
   const key=JSON.stringify([!!state?.enabled,!!adapter,collapsed,state?.health,state?.maxHealth,state?.stage,state?.treeState,state?.xp,positionLoaded,feedback]);
   if(key===badgeKey)return;badgeKey=key;
   if(!state?.enabled||!adapter){badge.innerHTML='';moveHandlers.delete('badge');return;}
   badge.innerHTML='<section class="pill" tabindex="0" aria-label="Your Sprout tree. Drag the background or use arrow keys to move.">'+'<div class="tree-hero '+(feedback?.kind||'')+'" title="Click to give your tree a little encouragement">'+renderSprout(state,true)+(feedback?Array.from({length:6},(_,i)=>'<span class="particle" style="--x:'+(i*22-55)+'px;--delay:'+(i*.08)+'s">'+(feedback.kind==='gain'?'✦':'❧')+'</span>').join(''):'')+'</div><div class="choice-feedback '+(feedback?.kind||'')+'" role="status" aria-live="polite">'+(feedback?.text||'Growing at your pace')+'</div><div class="widget-controls">'+(collapsed?'':'<span>'+state.health+' / '+state.maxHealth+' HP<meter min="0" max="'+state.maxHealth+'" value="'+state.health+'"></meter></span>')+'<button class="widget-toggle">'+(collapsed?'Show health':'Hide health')+'</button></div></section>';
   badge.querySelector('.tree-hero').onclick=()=>{if(suppressTreeClick)return;const hero=badge.querySelector('.tree-hero');hero.classList.remove('pet');void hero.offsetWidth;hero.classList.add('pet');clearTimeout(petTimer);petTimer=setTimeout(()=>hero.classList.remove('pet'),850);};
   badge.querySelector('.widget-toggle').onclick=()=>{collapsed=!collapsed;renderBadge();};
   movable(badge.querySelector('.pill'),badge.querySelector('.pill'),'badge');
 }

 function close(resume=false){if(!current)return;const old=current;old.video.removeEventListener('play',hold);current=null;moveHandlers.delete('prompt');modal.innerHTML='';if(resume)old.video.play().catch(()=>{});previousFocus?.focus?.();}
 function hold(){current?.video.pause();}
 function show(c){if(current||!c)return false;current={...c,id:adapter.name+':'+adapter.identifier(c)};previousFocus=document.activeElement;c.video.pause();c.video.addEventListener('play',hold);modal.innerHTML=`<div class="veil"><section class="card" tabindex="0" role="dialog" aria-modal="true" aria-labelledby="sprout-title"><div class="eyebrow">A LITTLE ROOM TO BREATHE</div><div class="tree">${renderSprout(state)}</div><h2 id="sprout-title">This video may feel emotionally heavy.</h2><p>Would you like to watch it?</p><div class="actions"><button id="skip">No, skip & grow<small>+5 HP · ${state.recovering?'Help your tree recover':'+3 XP'}</small></button><button id="watch">Yes, watch anyway<small>−15 HP · −10 XP</small></button></div><p class="notice" aria-live="polite"></p><small>A keyword-based nudge. The choice is always yours.</small></section></div>`;
  for(const [id,type] of [['skip','SKIP'],['watch','WATCH']])modal.querySelector('#'+id).onclick=async()=>{if(busy)return;busy=true;modal.querySelectorAll('button').forEach(b=>b.disabled=true);try{const target=current;const targetAdapter=adapter;applyState(await SproutStorage.updateTree(type));evaluated.add(target.id);close(type==='WATCH');if(type==='SKIP'&&target)targetAdapter.skipToNextVideo(target);renderBadge();}catch{modal.querySelector('.notice').textContent='Could not save. Please try again.';modal.querySelectorAll('button').forEach(b=>b.disabled=false);}finally{busy=false;}};
  movable(modal.querySelector('.card'),modal.querySelector('.card'),'prompt');modal.querySelector('#skip').focus();return true;
 }
 shadow.addEventListener('keydown',e=>{if(!current)return;if(e.key==='Escape'){e.preventDefault();modal.querySelector('#watch').click();}if(e.key==='Tab'){const b=[...modal.querySelectorAll('button')];e.preventDefault();b[(b.indexOf(shadow.activeElement)+(e.shiftKey?-1:1)+b.length)%b.length].focus();}});

 // Keep a pending decision through transient visibility and metadata changes.
 // Only a different card that remains active for a full second is navigation.
 let pendingNavigation=null;
 function reconcilePrompt(c){
   if(!current)return false;
   if(busy)return true;
   if(!c){pendingNavigation=null;return true;}
   if(c.video===current.video||c.root===current.root){
     pendingNavigation=null;
     if(c.video!==current.video){current.video.removeEventListener('play',hold);current.video=c.video;c.video.addEventListener('play',hold);}
     hold();return true;
   }
   const r=current.video.getBoundingClientRect();
   const previousVisible=current.video.isConnected&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
   if(previousVisible){pendingNavigation=null;return true;}
   if(!pendingNavigation||pendingNavigation.video!==c.video){pendingNavigation={video:c.video,since:Date.now()};return true;}
   if(Date.now()-pendingNavigation.since<1000)return true;
   pendingNavigation=null;close(false);return false;
 }
 async function scan(){
   if(!state)return;
   const nextAdapter=SproutAdapters.find(a=>a.isMatch(location.href));
   if(busy)return;
   adapter=nextAdapter;renderBadge();
   if(!adapter||!state.enabled){pendingNavigation=null;close(true);return;}
   const c=adapter.getActiveVideoContainer();
   if(reconcilePrompt(c)||!c)return;
   const text=adapter.extractMetadata(c);if(!Object.values(text).some(v=>Array.isArray(v)?v.length:String(v||'').trim()))return;
   const id=adapter.name+':'+adapter.identifier(c);if(evaluated.has(id))return;
   if(SproutClassifier.score(text,state).trigger)show(c);
 }

 const schedule=()=>{if(timer)return;timer=setTimeout(()=>{timer=null;scan();},120);};
 new MutationObserver(records=>{if(records.some(r=>!host.contains(r.target)))schedule();}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['src','class','aria-label','data-video-id']});
 setInterval(()=>{if(lastURL!==location.href)lastURL=location.href;scan();},500);
 document.addEventListener('play',()=>{if(current)hold();schedule();},true);
 document.addEventListener('loadedmetadata',schedule,true);
 document.addEventListener('scroll',schedule,{passive:true,capture:true});
 chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.sprout){applyState(SproutStorage.normalize(changes.sprout.newValue));schedule();}});

 chrome.runtime.onMessage.addListener((m,s,reply)=>{
   if(m.type!=='SPROUT_DIAGNOSE')return;
   try{const a=SproutAdapters.find(a=>a.isMatch(location.href));const c=a?.getActiveVideoContainer();const data=c?a.extractMetadata(c):null;const result=data?SproutClassifier.score(data,state||{}):null;
   reply({ok:true,version:chrome.runtime.getManifest().version,enabled:state?.enabled,platform:a?.name,activeVideo:!!c,promptOpen:!!current,result,counts:data?Object.fromEntries(Object.entries(data).map(([k,v])=>[k,v.length])):{}});
   }catch(e){reply({ok:false,error:e.message});}
 });
 chrome.runtime.onMessage.addListener((m,s,reply)=>{if(m.type!=='SIMULATE_TRIGGER')return;adapter=SproutAdapters.find(a=>a.isMatch(location.href));const c=adapter?.getActiveVideoContainer();reply({ok:!!(state&&c&&show(c)),error:!state?'Sprout is starting. Try again.':!c?'Open a supported short-form video first.':'A prompt is already open.'});});
 SproutStorage.getState().then(s=>{state=s;scan();});
})();
