(() => {
  const levels=[0,150,450,900,1500];
  const defaults = {balanceVersion:2,health:200,maxHealth:250,xp:0,stage:1,treeState:'healthy',videosSkipped:0,videosWatched:0,sensitivity:'medium',enabled:true,customKeywords:[],recoverySkips:0,recovering:false};
  const stage = xp => xp>=1500?5:xp>=900?4:xp>=450?3:xp>=150?2:1;
  function normalize(state) {
    const s={...defaults,...state};
    if(state&&state.balanceVersion!==2){
      s.health=Math.round(s.health/(state.maxHealth||100)*250);
      s.xp*=3; // Preserve the existing stage and progress with the new thresholds.
    }
    s.balanceVersion=2;s.maxHealth=250;s.health=Math.max(0,Math.min(s.maxHealth,s.health));
    s.stage=stage(s.xp);
    s.treeState=s.recovering||s.health/s.maxHealth<.25?'wilted':s.health/s.maxHealth<.6?'drooping':'healthy';
    return s;
  }
  function reduce(state, action) {
    const s = normalize(state);
    if(action.type==='SKIP') {
      s.videosSkipped++; s.health=Math.min(s.maxHealth,s.health+5);
      if(s.recovering) {s.recoverySkips++; if(s.recoverySkips>=2){s.recovering=false;s.recoverySkips=0;}}
      else s.xp+=3;
    } else if(action.type==='WATCH') {
      s.videosWatched++;s.health=Math.max(0,s.health-15);s.xp=Math.max(0,s.xp-10);
      if(s.health===0){s.recovering=true;s.recoverySkips=0;}
    } else if(action.type==='SETTINGS') {
      const p=action.patch||{};
      if(typeof p.enabled==='boolean')s.enabled=p.enabled;
      if(['low','medium','high'].includes(p.sensitivity))s.sensitivity=p.sensitivity;
      if(Array.isArray(p.customKeywords))s.customKeywords=[...new Set(p.customKeywords.filter(x=>typeof x==='string').map(x=>x.trim().slice(0,80)).filter(Boolean))].slice(0,50);
    }
    return normalize(s);
  }
  globalThis.SproutStorage={defaults,levels,normalize,reduce,getState:async()=>normalize((await chrome.storage.local.get('sprout')).sprout),updateTree:async(type,patch)=>{const r=await chrome.runtime.sendMessage({type:'SPROUT_UPDATE',action:{type,patch}});if(!r?.ok)throw new Error(r?.error||'Could not save');return r.state;}};
})();
