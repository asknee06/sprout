(() => {
  globalThis.renderSprout = (s,mini=false) => {
    const n=Math.max(1,Math.min(5,Number(s.stage)||1)), wilt=s.treeState==='wilted', droop=s.treeState==='drooping', color=wilt?'#b18a55':droop?'#81936b':'#4e9168';
    const vitality=Math.max(0,Math.min(1,Number(s.health)/(Number(s.maxHealth)||250)));const levels=[0,150,450,900,1500];const progress=n===5?1:Math.max(0,Math.min(1,((Number(s.xp)||0)-levels[n-1])/(levels[n]-levels[n-1])));
    let leaves='',branches=''; const count=[2,6,16,22,30][n-1],top=177-n*21-progress*10+(1-vitality)*16;
    for(let i=0;i<count;i++){
      const a=i*2.39996,r=n===1?22+progress*8:Math.sqrt((i+1)/count)*(25+n*9),x=120+Math.cos(a)*r,y=top+Math.sin(a)*r*.73+(wilt?17:0);
      branches+=`<path d="M120 196 Q118 ${y+15} ${x} ${y}"/>`;
      leaves+=`<ellipse cx="${x}" cy="${y}" rx="${(n===1?17:13)*(.75+vitality*.25+progress*.12)}" ry="${6+vitality*3}" transform="rotate(${Math.cos(a)*40+(wilt?55:droop?25:0)+(1-vitality)*45} ${x} ${y})" fill="${i%3===0?(wilt?'#c6a46d':'#88b58a'):color}"/>`;
      if(n>=4&&i%4===0)leaves+=`<circle cx="${x+5}" cy="${y-4}" r="4" fill="#efc9c4"/><circle cx="${x+5}" cy="${y-4}" r="1.4" fill="#fcf1d4"/>`;
    }
    return `<svg viewBox="${mini?(['62 118 116 148','58 93 124 173','45 66 150 200','34 35 172 231','20 0 200 266'][n-1]):'0 0 240 280'}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stage ${n} ${wilt?'resting':droop?'drooping':'healthy'} tree"><ellipse cx="120" cy="253" rx="51" ry="8" fill="#345b4212"/>${n===5?'<circle cx="120" cy="125" r="87" fill="#e7d695" opacity=".16"/>':''}<g stroke="#8a7661" stroke-width="${n+1}" fill="none" stroke-linecap="round">${branches}<path d="M120 220 Q${wilt?135:116} 174 120 ${top}"/></g><g>${leaves}</g><path d="M83 216 L91 249 Q120 261 149 249 L157 216" fill="${n<2?'#c38f78':'#dddacc'}"/><ellipse cx="120" cy="216" rx="38" ry="10" fill="#ede7d9"/><ellipse cx="120" cy="215" rx="31" ry="6" fill="#897862"/><path d="M120 216 L120 204" stroke="#8a7661" stroke-width="4"/>${n===5?'<path d="M139 91q5-7 10 0q5-7 10 0" fill="none" stroke="#ab9251" stroke-width="2"/>':''}</svg>`;
  };
})();
