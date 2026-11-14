(() => {
 const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none';};
 function active(selector){return [...document.querySelectorAll('video')].map(video=>{const r=video.getBoundingClientRect(),area=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))*Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0));return{video,area,ratio:area/Math.max(1,Math.min(r.width,innerWidth)*Math.min(r.height,innerHeight))};}).filter(c=>visible(c.video)&&c.ratio>.5).sort((a,b)=>b.area-a.area||Number(a.video.paused)-Number(b.video.paused)).map(c=>{
 let scope=c.video.closest(selector);if(!scope){scope=c.video.parentElement;for(let i=0;i<7&&scope?.parentElement;i++){const p=scope.parentElement;if(p===document.body||p.querySelectorAll('video').length>1)break;scope=p;}}return{video:c.video,root:scope||c.video.parentElement};})[0]||null;}

 const cardSelector='article, ytd-reel-video-renderer, yt-shorts-video-renderer, [data-e2e="recommend-list-item-container"], [data-e2e="feed-video"]';
 const musicSelector='[data-e2e*="music"], a[href*="/music/"], a[href*="/reels/audio/"], [class*="Music"], [class*="music-title"], .ytReelSoundMetadataViewModelHost, yt-reel-sound-metadata-view-model, #sound-button, [aria-label*="Sound"], [aria-label*="Audio"]';
 const descriptionSelector='[data-e2e="video-desc"], [data-e2e="browse-video-desc"], [data-e2e*="description"], [data-e2e="new-desc-span"], [data-e2e="search-card-video-caption"], #description, #description-inline-expander, #video-title, .ytReelMetapanelViewModelMetadata, h1, h2, [class*="DivVideoInfo"], [class*="Caption"], [class*="caption"], [class*="Description"]';
 const commentSelector='[data-e2e="comment-level-1"], [data-e2e="comment-level-2"], [data-e2e="comment-text"], #content-text, ytd-comment-view-model #content, [class*="CommentText"], [class*="comment-text"], [data-sprout-comment]';
 const panelSelector='[data-e2e="comment-list"], [data-e2e="comment-container"], [class*="DivCommentListContainer"], ytd-comments, ytd-engagement-panel-section-list-renderer, [role="dialog"]';
 const rendered=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
 function metadata(c){
 const data={description:[],hashtags:[],music:[],captions:[],comments:[],context:[]};const seen=new Set();
 const belongs=e=>{const card=e.closest(cardSelector);return !card||card===c.root||card.contains(c.video);};
 function add(key,text){text=String(text||'').trim().slice(0,4000);if(!text||seen.has(text))return;seen.add(text);data[key].push(text);}
 function collect(scope,external=false){
   for(const e of scope.querySelectorAll(commentSelector))if(rendered(e)&&belongs(e))add('comments',e.innerText||e.textContent);
   // Instagram often exposes comments as list items rather than named classes.
   if(external&&/(^|\.)instagram\.com$/.test(location.hostname))for(const e of scope.querySelectorAll('ul li'))if(rendered(e)&&belongs(e)&&!e.querySelector('video'))add('comments',e.innerText||e.textContent);
   for(const e of scope.querySelectorAll('a[href*="/tag/"], a[href*="/hashtag/"]'))if(rendered(e)&&belongs(e))add('hashtags',e.innerText||e.textContent);
   for(const e of scope.querySelectorAll(musicSelector))if(rendered(e)&&belongs(e))add('music',e.innerText?.trim()||e.getAttribute('aria-label')||e.getAttribute('title')||e.textContent);
   for(const e of scope.querySelectorAll(descriptionSelector)){
     if(!rendered(e)||!belongs(e)||e.closest(commentSelector))continue;
     // Skip broad wrappers containing comment lists; they double-count reactions.
     if(e.querySelector(commentSelector))continue;
     add('description',e.innerText?.trim()||e.getAttribute('aria-label')||e.getAttribute('title')||e.textContent);
   }
 }
 if(globalThis.SproutEnrichment){const extra=SproutEnrichment.get(c);for(const [key,items] of Object.entries(extra))for(const text of items)add(key,text);}
 collect(c.root);
 // Sibling metadata must be on screen; neighboring cards never contribute.
 for(const e of document.querySelectorAll(descriptionSelector+', '+musicSelector+', a[href*="/tag/"], a[href*="/hashtag/"]')){
   if(c.root.contains(e)||!visible(e)||!belongs(e)||e.closest(panelSelector))continue;
   if(e.querySelector('video')||e.querySelector(commentSelector))continue;
   add(e.matches('a[href*="/tag/"], a[href*="/hashtag/"]')?'hashtags':e.matches(musicSelector)?'music':'description',e.innerText||e.textContent);
 }
 // Read already-loaded comments in the visible active video's panel, including
 // comments below the scroll fold. No clicks, private endpoints, or network calls.
 for(const panel of document.querySelectorAll(panelSelector))if(!c.root.contains(panel)&&visible(panel)&&belongs(panel))collect(panel,true);
 for(const track of Array.from(c.video.textTracks||[]))for(const cue of Array.from(track.activeCues||[]))add('captions',cue.text);
 for(const e of c.root.querySelectorAll('.ytp-caption-segment, [data-e2e="video-subtitle"], [class*="Subtitle"]'))if(rendered(e))add('captions',e.innerText||e.textContent);
 for(const attr of ['aria-label','title'])add('description',c.video.getAttribute(attr));
 // Obfuscated markup fallback stays inside the active card and excludes comments.
 if(!data.description.length){const clone=c.root.cloneNode(true);for(const e of clone.querySelectorAll(commentSelector+', button, nav, [role="button"]'))e.remove();add('context',clone.innerText||clone.textContent);}
 data.comments=data.comments.slice(0,80);return data;
 }

 function next(c,selectors){const button=[...document.querySelectorAll(selectors)].find(visible);if(button){button.click();return;}let p=c.root;while(p&&!(p.scrollHeight>p.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(p).overflowY)))p=p.parentElement;if(p)p.scrollBy({top:innerHeight,behavior:'smooth'});else{(document.activeElement||document).dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',code:'ArrowDown',keyCode:40,bubbles:true}));c.root.nextElementSibling?.scrollIntoView({behavior:'smooth'});window.scrollBy({top:innerHeight,behavior:'smooth'});}}
 function make(name,match,selector,buttons,link){return{name,isMatch:url=>match(new URL(url)),getActiveVideoContainer:()=>active(selector),extractMetadata:metadata,skipToNextVideo:c=>next(c,buttons),identifier:c=>{const href=c.root.querySelector(link)?.href;const route=location.href.match(/\/(?:shorts|reels?|video)\/([\w-]+)/)?.[0];return href||route||c.video.currentSrc||c.video.src||c.root.innerText?.slice(0,250)||location.href;}};}
 globalThis.SproutAdapters=[make('TikTok',u=>/(^|\.)tiktok\.com$/.test(u.hostname)&&!/^\/(messages|settings|upload)/.test(u.pathname),'[data-e2e="recommend-list-item-container"], [data-e2e="feed-video"], [data-e2e="browse-video"], article','[data-e2e="arrow-right"], [data-e2e="arrow-down"], [aria-label="Go to next video"]','a[href*="/video/"]'),make('Instagram',u=>/(^|\.)instagram\.com$/.test(u.hostname)&&/^\/reels?(\/|$)/.test(u.pathname),'article','[aria-label="Next video"], [aria-label="Next reel"]','a[href*="/reel/"]'),make('YouTube Shorts',u=>/(^|\.)youtube\.com$/.test(u.hostname)&&/^\/shorts(\/|$)/.test(u.pathname),'ytd-reel-video-renderer, yt-shorts-video-renderer','[aria-label="Next video"], #navigation-button-down button','a[href*="/shorts/"]')];
})();