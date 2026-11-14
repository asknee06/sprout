(() => {
 const groups=[
 [3.5,['cant do this anymore','cannot do this anymore','cant take it anymore','cant go on','i dont matter','no reason to live','cry myself to sleep','never coming back','lost the will','nothing matters anymore','every day hurts','im not enough','not good enough','no one would notice','i feel invisible','i feel unwanted','sorrowful','sorrow','mournful','somber','sombre','tearjerker','funeral music','sad','sadness','depressing','depressed','depression','depressive','melancholy','melancholic','heartbroken','heartbreak','heartbreaking','hopeless','worthless','suicidal','suicide','grief','grieving','mourning','loneliness','lonely','mental breakdown','panic attack','crying myself to sleep','nobody cares','no one cares','tired of living','exhausted of life','give up','want to disappear','not okay','not ok','lost someone','rest in peace','miss you so much']],
 [2,['cant move on','cant let go','i miss her','i miss him','she left me','he left me','they left me','i still miss','it still hurts','pretending to be happy','fake smile','crying alone','nobody understands','no one understands','emotionally drained','i feel nothing','i feel lost','feeling lost','crying','cried','tears','overthinking','anxiety','anxious','burnout','numb','empty inside','heavy heart','dark thoughts','tired of trying','falling apart','feel empty','feeling empty','hurts so much','in pain','all alone','feel alone','feeling alone','miss you','missing you','breakup','break up','broke up','broken heart','lost my','wish you were here','cannot stop crying','can not stop crying','made me cry','makes me cry','im crying','i am crying','made me tear up','so painful','so real','too real','this hurts','felt this','felt that','relatable pain','unrequited','abandoned','rejected','emotional damage']],
 [.75,['regret','broken','vent','pain','suffering','hurt','alone','empty','tired','emotional','slowed','reverb','rainy','nostalgia','nostalgic','💔','😢','😭','🥀','😞','😔']]
 ];
 const normalize=t=>String(t||'').normalize('NFKC').replace(/([a-z])([A-Z])/g,'$1 $2').toLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}\p{Emoji_Presentation}]+/gu,' ').replace(/\s+/g,' ').trim();
 const tags=['sad','sadness','sadvibes','sadedit','sadstory','sadmusic','sadquotes','sadsong','sadtok','depression','depressed','depressing','depressiontok','melancholy','melancholic','heartbreak','heartbroken','lonely','loneliness','grief','mentalbreakdown','venttok','crying'];
 function analyze(value,custom){const raw=String(value||''),text=' '+normalize(raw)+' ';let points=0;const hits=new Set();
 for(const [weight,words] of [...groups,[4,custom||[]]])for(const word of words){const key=normalize(word);if(key&&text.includes(' '+key+' ')&&!['not '+key,'not feeling '+key,'no longer '+key,'never '+key].some(phrase=>text.includes(' '+phrase+' '))&&!hits.has(key)){hits.add(key);points+=weight;}}
 for(const tag of raw.match(/#[\p{L}\p{N}_]+/gu)||[]){const compact=normalize(tag).replace(/ /g,'');if(tags.some(k=>compact===k||compact.startsWith(k)&&/^(edit|edits|tok|vibes|quotes|story|stories|music|song|songs|video|videos|reposts|repost|core|life|thoughts|hours|feeling|feelings|fyp|forever|\d+)$/.test(compact.slice(k.length)))){points=Math.max(points,3.5);hits.add(tag);}}
 return{points:Math.min(points,12),hits:[...hits]};}
 function score(input,s={}){
 const data=typeof input==='string'?{description:input}:input||{};
 let total=0;const hits=new Set(),sources=[];
 for(const [key,weight] of [['description',1],['hashtags',1.1],['music',1.25],['captions',1],['context',.65]]){const r=analyze(Array.isArray(data[key])?data[key].join('\n'):data[key],s.customKeywords);if(r.points){total+=r.points*weight;sources.push(key);r.hits.forEach(h=>hits.add(h));}}
 // Explicit melancholy music metadata is enough to request a choice by itself.
 // Slowed/reverb and generic artist names remain weak signals.
 const music=analyze(Array.isArray(data.music)?data.music.join('\n'):data.music,s.customKeywords);
 const musicText=' '+normalize(Array.isArray(data.music)?data.music.join(' '):data.music)+' ';
 const explicitMusic=['sad','sadness','depressing','depressed','depression','melancholy','melancholic','sorrowful','mournful','somber','sombre','heartbreak','heartbroken','grief','funeral music'].some(k=>musicText.includes(' '+k+' '));
 let commentsScore=0,matchedComments=0;const seen=new Set();
 for(const comment of (data.comments||[]).slice(0,80)){const key=normalize(comment);if(!key||seen.has(key))continue;seen.add(key);const r=analyze(comment,s.customKeywords);if(r.points){matchedComments++;commentsScore+=Math.min(2,r.points*.6);r.hits.forEach(h=>hits.add(h));}}
 if(commentsScore){total+=Math.min(5,commentsScore);sources.push('comments');}
 const threshold={high:1.5,medium:3,low:5}[s.sensitivity]||3;
 return{score:Math.round(total*100)/100,threshold,hits:[...hits],sources,matchedComments,trigger:total>=threshold||explicitMusic};
 }
 globalThis.SproutClassifier={score,normalize};
})();