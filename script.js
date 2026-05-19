/* ═══════════════════════════════════════════════════════════════
   VIVEK AKKISETTY — PORTFOLIO v5.0  ★ CINEMATIC EDITION ★
   Animation Engine — Studio / Award-winning level
═══════════════════════════════════════════════════════════════ */
'use strict';

const clamp  = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const lerp   = (a,b,t)   => a+(b-a)*t;
const damp   = (a,b,l,dt)=> lerp(a,b,1-Math.exp(-l*dt));
const rnd    = (lo,hi)   => lo+Math.random()*(hi-lo);
const rndInt = (lo,hi)   => Math.floor(rnd(lo,hi+1));

/* ── Spring ── */
class Spring {
  constructor(k=180,d=22,m=1){ this.k=k;this.d=d;this.m=m;this.pos=0;this.vel=0;this.target=0; }
  tick(dt=.016){
    const F=-(this.k*(this.pos-this.target))-(this.d*this.vel);
    this.vel+=(F/this.m)*dt; this.pos+=this.vel*dt; return this.pos;
  }
  set(v){ this.pos=this.target=v; this.vel=0; }
  settled(){ return Math.abs(this.pos-this.target)<.001&&Math.abs(this.vel)<.001; }
}
class Spring2D {
  constructor(k,d,m){ this.x=new Spring(k,d,m); this.y=new Spring(k,d,m); }
  tick(dt){ return{x:this.x.tick(dt),y:this.y.tick(dt)}; }
  setTarget(x,y){ this.x.target=x; this.y.target=y; }
  set(x,y){ this.x.set(x); this.y.set(y); }
}

/* ── Single RAF loop ── */
const RAF=(()=>{
  const subs=new Set(); let last=0;
  function run(now){ const dt=Math.min((now-last)/1000,.05); last=now; subs.forEach(f=>f(dt,now)); requestAnimationFrame(run); }
  requestAnimationFrame(t=>{last=t;run(t);});
  return{add:f=>subs.add(f),remove:f=>subs.delete(f)};
})();

/* ═══════════════════════════════════════════════
   INJECT CSS  (keyframes, helpers)
═══════════════════════════════════════════════ */
function injectCSS(){
  document.head.insertAdjacentHTML('beforeend',`<style>
  filter:drop-shadow(0 0 4px rgba(92,64,51,.5));transition:filter .2s;}
#va-prog.bloom{filter:drop-shadow(0 0 12px rgba(92,64,51,1));}

/* ── Preloader ── */
#va-pl{position:fixed;inset:0;z-index:99999;background:var(--beige);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.8rem;
  transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);}
#va-pl.out{opacity:0;transform:scale(.95) translateY(-30px);pointer-events:none;}
#va-pn{font-family:var(--font-display);font-size:clamp(5rem,12vw,9rem);font-weight:700;
  color:var(--brown);line-height:1;opacity:0;transform:translateY(24px);
  animation:va-pn-in .6s .2s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes va-pn-in{to{opacity:1;transform:none;}}
#va-pb{width:clamp(160px,28vw,260px);height:1px;background:rgba(92,64,51,.1);border-radius:2px;overflow:hidden;}
#va-pf{height:100%;width:0;background:linear-gradient(90deg,var(--brown-lt),var(--brown));
  border-radius:2px;box-shadow:0 0 8px rgba(92,64,51,.4);}
#va-pl-lbl{font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--brown-lt);}

/* ── Ripple ── */
@keyframes va-rip{from{transform:translate(-50%,-50%) scale(0);opacity:.5}to{transform:translate(-50%,-50%) scale(1);opacity:0}}
@keyframes va-shock{from{transform:translate(-50%,-50%) scale(0);opacity:.6}to{transform:translate(-50%,-50%) scale(2);opacity:0}}

/* ── Reveal keyframes ── */
@keyframes va-up{from{opacity:0;transform:translateY(60px) skewY(2deg)}to{opacity:1;transform:none}}
@keyframes va-left{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}
@keyframes va-right{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}
@keyframes va-zoom{from{opacity:0;transform:scale(.75) translateY(30px);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes va-flip{from{opacity:0;transform:perspective(700px) rotateX(-35deg) translateY(40px)}to{opacity:1;transform:perspective(700px) rotateX(0) translateY(0)}}

/* ── Char animations ── */
.va-c{display:inline-block;will-change:transform,opacity;}
.va-scramble-c{color:var(--brown-lt);display:inline-block;}
@keyframes va-drop{from{opacity:0;transform:translateY(-55px) rotate(-6deg);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
@keyframes va-rise{from{opacity:0;transform:translateY(55px) rotate(4deg);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}

/* ── Specular overlay ── */
.va-spec{position:absolute;inset:0;pointer-events:none;z-index:3;border-radius:inherit;
  background:radial-gradient(circle 80px at var(--sx,50%) var(--sy,50%),rgba(255,255,255,.14) 0%,transparent 70%);
  opacity:0;transition:opacity .35s;}
.va-tilt:hover .va-spec{opacity:1;}

/* ── Nav pill ── */
#va-pill{position:absolute;bottom:0;height:2px;
  background:linear-gradient(90deg,var(--brown-lt),var(--brown));
  border-radius:2px;pointer-events:none;box-shadow:0 0 10px rgba(92,64,51,.45);opacity:0;}

/* ── Orb ── */
.va-orb{position:absolute;border-radius:50%;
  background:radial-gradient(circle,rgba(92,64,51,.11) 0%,transparent 70%);
  pointer-events:none;animation:va-orbit var(--dur) var(--delay) linear infinite;}
@keyframes va-orbit{to{transform:rotate(360deg);}}

/* ── Skill bar shimmer ── */
@keyframes va-bsh{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ── Timeline dot pulse ── */
@keyframes va-tldot{0%,100%{box-shadow:0 0 0 2px var(--brown)}50%{box-shadow:0 0 0 8px rgba(92,64,51,.12)}}
.tl-dot{animation:va-tldot 3s ease-in-out infinite;}

/* ── Contact 3D in ── */
@keyframes va-c3d{from{opacity:0;transform:perspective(800px) rotateX(-28deg) translateY(44px) scale(.95)}
  to{opacity:1;transform:perspective(800px) rotateX(0) translateY(0) scale(1)}}

/* ── Grain drift ── */
@keyframes va-grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-2%,1%)}
  40%{transform:translate(1%,-2%)}60%{transform:translate(2%,2%)}80%{transform:translate(-1%,-1%)}}
.hero-noise{animation:va-grain 6s steps(1) infinite!important;}

/* ── Magnetic release ── */
@keyframes va-magrel{0%{}40%{transform:scale(1.05)}70%{transform:scale(.97)}100%{transform:scale(1)}}

/* ── Socials in ── */
@keyframes va-soc{from{opacity:0;transform:translateY(22px) scale(.65)}to{opacity:1;transform:none}}

/* ── Avail ── */
@keyframes va-avail{0%,100%{box-shadow:0 0 0 0 rgba(92,184,92,.6)}50%{box-shadow:0 0 0 8px rgba(92,184,92,0)}}
.avail-dot{animation:va-avail 2s ease-in-out infinite!important;}

/* ── Badge float ── */
@keyframes va-badge{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-9px) rotate(1deg)}}
.avatar-badge{animation:va-badge 3.2s ease-in-out infinite!important;}
@keyframes va-star{0%,80%,100%{transform:none}90%{transform:rotate(200deg) scale(1.4)}}
.avatar-badge i{animation:va-star 3s linear infinite!important;}

/* ── Avatar ring ── */
@keyframes va-ring{0%,100%{box-shadow:0 0 0 6px rgba(92,64,51,.05);border-color:var(--brown-lt)}
  50%{box-shadow:0 0 0 18px rgba(92,64,51,.01);border-color:var(--brown)}}
.avatar-ring-inner{animation:va-ring 3.5s ease-in-out infinite!important;}

/* ── Footer brand ── */
@keyframes va-brand{0%,100%{letter-spacing:.06em;color:var(--brown-lt)}50%{letter-spacing:.2em;color:var(--beige)}}
.footer-logo{animation:va-brand 5s ease-in-out infinite!important;}

/* ── BG word breathe ── */
@keyframes va-bgw{0%,100%{letter-spacing:-.02em;opacity:.04}50%{letter-spacing:.06em;opacity:.07}}
.hero-bg-word{animation:va-bgw 6s ease-in-out infinite!important;}

/* ── Role pill hover ── */
.role-pill{transition:background .3s,color .3s,transform .5s cubic-bezier(.16,1,.3,1),box-shadow .3s!important;}
.role-pill:hover{background:var(--brown)!important;color:var(--beige)!important;transform:translateY(-3px) scale(1.06)!important;box-shadow:0 8px 20px rgba(92,64,51,.25)!important;}

/* ── Learning tag hover ── */
.learning-tags span{transition:background .3s,color .3s,transform .5s cubic-bezier(.16,1,.3,1),box-shadow .3s!important;cursor:default;}
.learning-tags span:hover{background:var(--brown)!important;color:var(--beige)!important;
  transform:translateY(-5px) scale(1.08)!important;box-shadow:0 10px 24px rgba(92,64,51,.28)!important;}

/* ── Stat mini hover ── */
.stat-mini{transition:background .3s,transform .5s cubic-bezier(.16,1,.3,1)!important;}
.stat-mini:hover{background:rgba(92,64,51,.05)!important;transform:translateY(-4px)!important;}
.stat-mini:hover i{color:var(--brown)!important;transform:scale(1.25) rotate(6deg)!important;}
.stat-mini i{transition:color .3s,transform .5s cubic-bezier(.16,1,.3,1)!important;}

/* ── PC num animate ── */
.project-card:hover .pc-num{color:rgba(92,64,51,.18)!important;transform:scale(1.12) translateX(-5px)!important;}
.pc-num{transition:color .4s,transform .5s cubic-bezier(.16,1,.3,1)!important;}

/* ── About quote ── */
.about-quote{transition:background .3s,transform .5s cubic-bezier(.16,1,.3,1),box-shadow .3s!important;}
.about-quote:hover{background:rgba(92,64,51,.08)!important;transform:translateX(6px)!important;
  box-shadow:-4px 0 24px rgba(92,64,51,.1)!important;}

/* ── TL deco item hover ── */
.tl-deco-item{transition:color .25s,transform .45s cubic-bezier(.16,1,.3,1),background .25s!important;cursor:default;}
.tl-deco-item:hover{color:var(--brown-dk)!important;transform:translateX(5px)!important;
  background:rgba(92,64,51,.06)!important;border-radius:8px;}

/* ── Contact card ── */
.contact-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:var(--brown-lt);transform:scaleY(0);transition:transform .6s cubic-bezier(.16,1,.3,1);transform-origin:bottom;}
.contact-card:hover::before{transform:scaleY(1);}

/* ── Scroll cue ── */
@keyframes va-scroll-cue-in{from{opacity:0}to{opacity:1}}
.scroll-cue{animation:va-scroll-cue-in 1s 2s both!important;}

/* ── Footer links ── */
.footer-links a{display:inline-block;transition:color .3s,transform .5s cubic-bezier(.16,1,.3,1),text-shadow .3s!important;}
.footer-links a:hover{color:var(--brown-lt)!important;transform:translateY(-6px) scale(1.1)!important;
  text-shadow:0 6px 18px rgba(196,169,155,.35)!important;}

/* ── Sf icon on hover ── */
.skill-feature:hover .sf-icon{transform:rotate(12deg) scale(1.12)!important;}
.sf-icon{transition:transform .5s cubic-bezier(.16,1,.3,1)!important;}
.skill-feature{transition:transform .55s cubic-bezier(.16,1,.3,1),box-shadow .45s!important;}
.skill-feature:hover{transform:translateY(-7px) scale(1.01)!important;box-shadow:0 44px 100px rgba(46,31,24,.28)!important;}

/* ── Social hover ── */
.hero-socials a{transition:background .3s,color .3s,transform .5s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s!important;}
.hero-socials a:hover{background:var(--brown)!important;color:var(--beige)!important;border-color:var(--brown)!important;
  transform:translateY(-6px) scale(1.12) rotate(6deg)!important;box-shadow:0 14px 30px rgba(92,64,51,.32)!important;}

/* ── TL icon hover ── */
.tl-card:hover .tl-icon{transform:rotate(-12deg) scale(1.12)!important;}
.tl-icon{transition:transform .5s cubic-bezier(.16,1,.3,1),background .3s!important;}
.tl-card:hover h3{color:var(--brown)!important;}
.tl-card h3{transition:color .3s!important;}
.tl-card:hover .cgpa-val{transform:scale(1.1)!important;}
.cgpa-val{transition:transform .5s cubic-bezier(.16,1,.3,1)!important;}
.cgpa-dots:hover .dot.filled{transform:scaleY(1.5)!important;}
.dot{transition:transform .4s cubic-bezier(.16,1,.3,1)!important;}

/* ── Avatar photo hover ── */
.avatar-wrap:hover .avatar-photo{box-shadow:0 44px 110px rgba(46,31,24,.32)!important;transform:scale(1.04)!important;}
.avatar-photo{transition:box-shadow .5s,transform .5s cubic-bezier(.16,1,.3,1)!important;}

/* ── PC tag hover ── */
.pc-tag{transition:background .3s,color .3s,transform .45s cubic-bezier(.16,1,.3,1)!important;}
.pc-tag:hover{background:var(--brown)!important;color:var(--beige)!important;transform:scale(1.1)!important;}

/* ── PC title color ── */
.project-card:hover .pc-body h3{color:var(--brown)!important;}
.pc-body h3{transition:color .3s!important;}

/* ── Btn ghost ── */
.btn-ghost{transition:color .3s,border-color .3s,gap .5s cubic-bezier(.16,1,.3,1),transform .4s cubic-bezier(.16,1,.3,1)!important;}
.btn-ghost:hover{transform:translateX(5px)!important;}
.btn-ghost:hover i{transform:translateY(5px)!important;}
.btn-ghost i{transition:transform .5s cubic-bezier(.16,1,.3,1)!important;}

/* ── Btn primary icon ── */
.btn-primary i{transition:transform .5s cubic-bezier(.16,1,.3,1)!important;}
.btn-primary:hover i{transform:translateX(6px)!important;}

/* ── Nav item ── */
.nav-item{transition:color .3s!important;}
.nav-item::before{transition:opacity .3s,top .3s!important;}
.nav-item::after{transition:width .6s cubic-bezier(.16,1,.3,1)!important;}
.nav-logo{transition:transform .5s cubic-bezier(.16,1,.3,1)!important;}
.nav-logo:hover{transform:scale(1.06)!important;}

/* ── Reduced motion ── */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;}
}
  </style>`);
}

/* ═══════════════════════════════════════════════
   01. PRELOADER
═══════════════════════════════════════════════ */
function initPreloader(){
  const pl=document.createElement('div'); pl.id='va-pl';
  pl.innerHTML=`<div id="va-pn">0</div><div id="va-pb"><div id="va-pf"></div></div><div id="va-pl-lbl">Loading Portfolio</div>`;
  document.body.appendChild(pl);
  document.body.style.overflow='hidden';
  const num=pl.querySelector('#va-pn'), fill=pl.querySelector('#va-pf');
  let prog=0, tv=0;
  const steps=[10,28,50,72,90,100]; let si=0;
  const adv=()=>{ if(si<steps.length){tv=steps[si++]; setTimeout(adv,rnd(100,250));} };
  adv();
  const tick=()=>{
    prog=lerp(prog,tv,.07);
    const p=Math.round(prog);
    num.textContent=p; fill.style.width=p+'%';
    if(p<99) requestAnimationFrame(tick);
    else{ fill.style.width='100%'; num.textContent='100'; setTimeout(exit,350); }
  };
  requestAnimationFrame(tick);
  function exit(){ pl.classList.add('out'); document.body.style.overflow=''; setTimeout(()=>pl.remove(),950); triggerHero(); }
}

/* ═══════════════════════════════════════════════
   02. HERO ENTRANCE
═══════════════════════════════════════════════ */
function triggerHero(){
  // Eyebrow clip reveal
  const ey=document.querySelector('.hero-eyebrow');
  if(ey){ ey.style.cssText='opacity:0;clip-path:inset(0 100% 0 0);transition:clip-path .9s cubic-bezier(.16,1,.3,1) .1s,opacity .2s .1s';
    requestAnimationFrame(()=>{ ey.style.opacity='1'; ey.style.clipPath='inset(0 0% 0 0)'; }); }

  // Name chars drop from sky
  document.querySelectorAll('.name-line').forEach((line,li)=>{
    const orig=line.textContent.trim();
    line.innerHTML=orig.split('').map((c,i)=>
      `<span class="va-c" style="opacity:0;animation:va-drop .75s cubic-bezier(.16,1,.3,1) ${li*.18+i*.04+.35}s both">${c===' '?'&nbsp;':c}</span>`
    ).join('');
    setTimeout(()=>{ line.querySelectorAll('.va-c').forEach(s=>{s.style.animation='';s.style.opacity='1';}); attachWave(line); }, li*180+orig.length*42+1100);
  });

  // Role pills
  document.querySelectorAll('.role-pill').forEach((p,i)=>{
    p.style.cssText=`opacity:0;transform:translateY(22px) scale(.88);transition:opacity .6s cubic-bezier(.16,1,.3,1) ${.75+i*.12}s,transform .6s cubic-bezier(.16,1,.3,1) ${.75+i*.12}s`;
    setTimeout(()=>{ p.style.opacity='1'; p.style.transform=''; },50);
  });

  // Tagline
  const tl=document.querySelector('.hero-tagline');
  if(tl){ tl.style.cssText='opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.16,1,.3,1) 1s,transform .7s cubic-bezier(.16,1,.3,1) 1s';
    setTimeout(()=>{ tl.style.opacity='1'; tl.style.transform=''; },50); }

  // Buttons
  document.querySelectorAll('.hero-actions>*').forEach((b,i)=>{
    b.style.cssText=`opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.16,1,.3,1) ${1.1+i*.14}s,transform .7s cubic-bezier(.16,1,.3,1) ${1.1+i*.14}s`;
    setTimeout(()=>{ b.style.opacity='1'; b.style.transform=''; },50);
  });

  // Socials stagger
  document.querySelectorAll('.hero-socials a').forEach((a,i)=>{ a.style.animation=`va-soc .6s cubic-bezier(.16,1,.3,1) ${1.35+i*.08}s both`; });

  // Scroll cue
  const sc=document.querySelector('.scroll-cue');
  if(sc){ sc.style.opacity='0'; sc.style.transition='opacity .8s 1.9s'; setTimeout(()=>sc.style.opacity='1',50); }
}

function attachWave(line){
  const spans=line.querySelectorAll('.va-c');
  line.addEventListener('mouseenter',()=>{
    spans.forEach((s,i)=>setTimeout(()=>{
      s.style.transition='transform .45s cubic-bezier(.16,1,.3,1),color .3s';
      s.style.transform='translateY(-11px) rotate(-5deg) scale(1.15)';
      s.style.color='var(--brown)';
      setTimeout(()=>{ s.style.transform=''; s.style.color=''; },470);
    },i*35));
  });
}

/* ═══════════════════════════════════════════════
   03. CURSOR + PARTICLES
═══════════════════════════════════════════════ */
function initCursor(){
  if(window.innerWidth<=768) return;
  const dot=document.createElement('div'); dot.id='va-dot';
  const ring=document.createElement('div'); ring.id='va-ring';
  document.body.append(dot,ring);
  const cvs=document.createElement('canvas'); cvs.id='va-canvas'; document.body.appendChild(cvs);
  const ctx=cvs.getContext('2d');
  const resize=()=>{ cvs.width=innerWidth; cvs.height=innerHeight; };
  resize(); addEventListener('resize',resize);

  const pos=new Spring2D(320,30,1), tail=new Spring2D(110,16,1);
  pos.set(innerWidth/2,innerHeight/2); tail.set(innerWidth/2,innerHeight/2);
  let mx=innerWidth/2, my=innerHeight/2, vis=false, inNav=false;

  addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    pos.setTarget(mx,my); tail.setTarget(mx,my);
    if(!vis){ vis=true; dot.style.opacity='1'; ring.style.opacity='1'; }
    inNav=my<80;
    const a=inNav?'0':'1'; dot.style.opacity=a; ring.style.opacity=a;
    if(!inNav) spawnP(mx,my,false);
  });
  addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });

  // Hover modes
  const setMode=mode=>{
    if(mode==='link'){ dot.style.width='14px';dot.style.height='14px';ring.style.width='58px';ring.style.height='58px';ring.style.borderColor='rgba(92,64,51,.6)';ring.style.background='rgba(92,64,51,.05)'; }
    else if(mode==='tilt'){ dot.style.width='8px';dot.style.height='8px';ring.style.width='82px';ring.style.height='82px';ring.style.borderStyle='dashed';ring.style.borderColor='rgba(92,64,51,.28)'; }
    else{ dot.style.width='6px';dot.style.height='6px';ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(92,64,51,.38)';ring.style.borderStyle='solid';ring.style.background='transparent'; }
  };
  document.querySelectorAll('a,button').forEach(el=>{ el.addEventListener('mouseenter',()=>setMode('link')); el.addEventListener('mouseleave',()=>setMode('default')); });
  document.querySelectorAll('.project-card,.skill-tile,.tl-card,.about-stats-panel,.skill-feature').forEach(el=>{ el.addEventListener('mouseenter',()=>setMode('tilt')); el.addEventListener('mouseleave',()=>setMode('default')); });

  // Click burst
  addEventListener('click',e=>{
    if(e.clientY<80) return;
    for(let i=0;i<18;i++) spawnP(e.clientX,e.clientY,true);
    dot.style.transform='translate(-50%,-50%) scale(3.5)'; dot.style.opacity='.35';
    setTimeout(()=>{ dot.style.transform='translate(-50%,-50%) scale(1)'; dot.style.opacity=inNav?'0':'1'; },220);
  });

  // Particles
  const ps=[];
  function spawnP(x,y,burst){
    if(!burst&&ps.length>60) return;
    const angle=burst?rnd(0,Math.PI*2):rnd(-Math.PI*.3,Math.PI*.3);
    const speed=burst?rnd(2.5,7):rnd(.3,1.4);
    ps.push({ x,y, vx:Math.cos(angle)*speed, vy:burst?Math.sin(angle)*speed:rnd(-.8,.8),
      r:burst?rnd(2,5):rnd(.8,2.4), a:burst?.9:.5, decay:burst?rnd(.02,.05):rnd(.008,.018),
      col:burst?['#5C4033','#8B6F63','#C4A99B','#2E1F18'][rndInt(0,3)]:'rgba(139,111,99,.55)' });
  }

  RAF.add((dt)=>{
    const dp=pos.tick(dt), tp=tail.tick(dt);
    dot.style.left=dp.x+'px'; dot.style.top=dp.y+'px';
    ring.style.left=tp.x+'px'; ring.style.top=tp.y+'px';
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=.04; p.a-=p.decay; p.r*=.97;
      if(p.a<=0){ ps.splice(i,1); continue; }
      ctx.save(); ctx.globalAlpha=clamp(p.a,0,1); ctx.fillStyle=p.col;
      ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(0,p.r),0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  });
}

/* ═══════════════════════════════════════════════
   04. SCROLL PROGRESS + VELOCITY BLOOM
═══════════════════════════════════════════════ */
function initProgress(){
  const bar=document.createElement('div'); bar.id='va-prog'; document.body.appendChild(bar);
  let lastY=0, btimer;
  addEventListener('scroll',()=>{
    const sy=scrollY, max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform=`scaleX(${sy/max})`;
    const vel=Math.abs(sy-lastY); lastY=sy;
    if(vel>18){ bar.classList.add('bloom'); clearTimeout(btimer); btimer=setTimeout(()=>bar.classList.remove('bloom'),280); }
  },{passive:true});
}

/* ═══════════════════════════════════════════════
   05. MAGNETIC BUTTONS
═══════════════════════════════════════════════ */
function initMagnetic(){
  document.querySelectorAll('.btn-primary,.nav-cta,.btn-outline,.hero-socials a').forEach(el=>{
    const sx=new Spring(240,24,1), sy=new Spring(240,24,1);
    let on=false, fn=null;
    el.addEventListener('mouseenter',()=>{
      on=true;
      if(!fn){ fn=(dt)=>{ const tx=sx.tick(dt),ty=sy.tick(dt); el.style.transform=`translate(${tx}px,${ty}px)`;
        if(!on&&sx.settled()&&sy.settled()){ el.style.transform=''; RAF.remove(fn); fn=null; } }; RAF.add(fn); }
    });
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      sx.target=(e.clientX-(r.left+r.width/2))*.38;
      sy.target=(e.clientY-(r.top+r.height/2))*.38;
    });
    el.addEventListener('mouseleave',()=>{
      on=false; sx.target=0; sy.target=0;
      el.style.animation='va-magrel .55s cubic-bezier(.16,1,.3,1)';
      setTimeout(()=>el.style.animation='',560);
    });
  });
}

/* ═══════════════════════════════════════════════
   06. EXPLOSIVE RIPPLE
═══════════════════════════════════════════════ */
function initRipple(){
  document.querySelectorAll('.btn-primary,.btn-outline,.btn-ghost,.nav-cta,.contact-card,.skill-tile,.project-card,.learning-tags span,.role-pill,.avatar-badge').forEach(el=>{
    el.style.position='relative'; el.style.overflow='hidden';
    el.addEventListener('click',function(e){
      const r=this.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      const sz=Math.max(r.width,r.height)*2.5;
      [['va-rip','rgba(92,64,51,.13)','.72s'],['va-shock','transparent','1s']].forEach(([anim,bg,dur],ai)=>{
        const s=document.createElement('span');
        s.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;
          border-radius:50%;pointer-events:none;z-index:0;
          background:${bg};border:${ai===1?'1px solid rgba(92,64,51,.22)':'none'};
          animation:${anim} ${dur} cubic-bezier(.16,1,.3,1) forwards;`;
        this.appendChild(s);
        setTimeout(()=>s.remove(),ai===0?740:1020);
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   07. 3D TILT + SPECULAR
═══════════════════════════════════════════════ */
function initTilt(){
  document.querySelectorAll('.project-card,.skill-tile,.about-stats-panel,.tl-card,.skill-feature').forEach(card=>{
    card.classList.add('va-tilt');
    card.style.position='relative';
    const spec=document.createElement('div'); spec.className='va-spec'; card.appendChild(spec);
    const rx=new Spring(210,25,1), ry=new Spring(210,25,1), sc=new Spring(210,22,1);
    sc.set(1); sc.target=1;
    let on=false, fn=null;
    card.addEventListener('mouseenter',()=>{
      on=true; sc.target=1.032; card.style.zIndex='5';
      if(!fn){ fn=(dt)=>{ const trx=rx.tick(dt),try_=ry.tick(dt),tsc=sc.tick(dt);
        card.style.transform=`perspective(900px) rotateX(${trx}deg) rotateY(${try_}deg) scale(${tsc})`;
        if(!on&&rx.settled()&&ry.settled()&&sc.settled()){ card.style.transform=''; RAF.remove(fn); fn=null; } }; RAF.add(fn); }
    });
    card.addEventListener('mouseleave',()=>{
      on=false; rx.target=0; ry.target=0; sc.target=1;
      setTimeout(()=>card.style.zIndex='',450);
    });
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
      rx.target=-(e.clientY-cy)/(r.height/2)*9; ry.target=(e.clientX-cx)/(r.width/2)*9;
      spec.style.setProperty('--sx',((e.clientX-r.left)/r.width*100)+'%');
      spec.style.setProperty('--sy',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

/* ═══════════════════════════════════════════════
   08. NAV  (spring pill + shadow)
═══════════════════════════════════════════════ */
function initNav(){
  const navbar=document.getElementById('navbar');
  const links=document.querySelectorAll('.nav-item');
  const nl=document.getElementById('navLinks');
  const sections=document.querySelectorAll('section[id]');
  const pill=document.createElement('div'); pill.id='va-pill'; nl&&nl.appendChild(pill);
  const pillSpring={l:new Spring(280,26,1),w:new Spring(280,26,1)};
  let pillFn=null;

  const movePill=el=>{
    if(!el||!nl) return;
    const r=el.getBoundingClientRect(), lr=nl.getBoundingClientRect();
    pillSpring.l.target=r.left-lr.left; pillSpring.w.target=r.width;
    if(pillSpring.l.pos===0){ pillSpring.l.set(r.left-lr.left); pillSpring.w.set(r.width); }
    pill.style.opacity='1';
    if(!pillFn){ pillFn=(dt)=>{ pill.style.left=pillSpring.l.tick(dt)+'px'; pill.style.width=pillSpring.w.tick(dt)+'px';
      if(pillSpring.l.settled()&&pillSpring.w.settled()){ RAF.remove(pillFn); pillFn=null; } }; RAF.add(pillFn); }
  };

  const update=()=>{
    navbar&&navbar.classList.toggle('scrolled',scrollY>20);
    let cur=''; sections.forEach(s=>{ if(scrollY>=s.offsetTop-120) cur=s.id; });
    links.forEach(a=>{ const ac=(a.getAttribute('href')||'').replace('#','')==cur; a.classList.toggle('active',ac); if(ac) movePill(a); });
    if(!cur) pill.style.opacity='0';
  };
  addEventListener('scroll',update,{passive:true}); update();
  links.forEach(a=>{ a.addEventListener('mouseenter',()=>movePill(a)); a.addEventListener('mouseleave',update); });

  const ham=document.getElementById('hamburger');
  if(ham&&nl){
    ham.addEventListener('click',()=>{ const open=nl.classList.toggle('open'); ham.classList.toggle('open',open); document.body.style.overflow=open?'hidden':''; });
    links.forEach(a=>a.addEventListener('click',()=>{ ham.classList.remove('open'); nl.classList.remove('open'); document.body.style.overflow=''; }));
    addEventListener('click',e=>{ if(nl.classList.contains('open')&&!nl.contains(e.target)&&!ham.contains(e.target)){ ham.classList.remove('open'); nl.classList.remove('open'); document.body.style.overflow=''; }});
  }
}

/* ═══════════════════════════════════════════════
   09. SMOOTH SCROLL
═══════════════════════════════════════════════ */
function initScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href')); if(!t) return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+scrollY-72,behavior:'smooth'});
  }));
}

/* ═══════════════════════════════════════════════
   10. SECTION REVEALS  (directional per section)
═══════════════════════════════════════════════ */
function initReveals(){
  const animMap={up:'va-up',left:'va-left',right:'va-right',zoom:'va-zoom',flip:'va-flip'};
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, dir=el.dataset.vaD||'up', del=el.dataset.vaDel||0;
      el.style.animation=`${animMap[dir]||'va-up'} .9s cubic-bezier(.16,1,.3,1) ${del}s both`;
      io.unobserve(el);
    });
  },{threshold:.07,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(el=>{
    el.style.opacity='0';
    const sid=el.closest('section')?.id||'';
    el.dataset.vaD = sid==='about' ? (el.closest('.about-text')?'left':'right')
      : sid==='skills' ? (el.classList.contains('skill-feature')?'left':'up')
      : sid==='projects' ? 'flip'
      : sid==='education' ? 'left'
      : sid==='contact' ? (el.closest('.contact-left')?'left':'right')
      : 'up';
    io.observe(el);
  });

  // Child stagger
  [
    {sel:'.skill-tile',dir:'zoom',gap:.09},
    {sel:'.project-card',dir:'flip',gap:.12},
    {sel:'.contact-card',dir:'right',gap:.1},
    {sel:'.learning-tags span',dir:'zoom',gap:.06},
    {sel:'.stat-mini',dir:'zoom',gap:.1},
    {sel:'.tl-deco-item',dir:'left',gap:.08},
  ].forEach(({sel,dir,gap})=>{
    document.querySelectorAll(sel).forEach((el,i)=>{
      if(el.classList.contains('reveal')) return;
      el.style.opacity='0'; el.dataset.vaD=dir; el.dataset.vaDel=(i*gap).toFixed(2);
      el.classList.add('reveal'); io.observe(el);
    });
  });
}

/* ═══════════════════════════════════════════════
   11. SECTION TITLES  (char rise + scramble hover)
═══════════════════════════════════════════════ */
class Scrambler{
  constructor(el){ this.el=el; this.orig=el.textContent.trim(); this.chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'; this.raf=null; }
  play(){
    const q=this.orig.split('').map((c,i)=>({c,start:rndInt(0,8),end:rndInt(14,22),cur:''}));
    let f=0; const orig=this.orig;
    const tick=()=>{
      let html='',done=0;
      q.forEach(qi=>{ if(f>=qi.end){html+=qi.c;done++;}
        else if(f>=qi.start){if(Math.random()<.3) qi.cur=this.chars[rndInt(0,this.chars.length-1)]; html+=`<span class="va-scramble-c">${qi.cur||qi.c}</span>`;}
        else html+=qi.c; });
      this.el.innerHTML=html;
      if(done<q.length){f++;this.raf=requestAnimationFrame(tick);}else this.el.textContent=orig;
    };
    cancelAnimationFrame(this.raf); this.raf=requestAnimationFrame(tick);
  }
}

function initTitles(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target; el.style.visibility='visible';
      const chars=el.textContent.trim().split('');
      el.innerHTML=chars.map((c,i)=>
        `<span class="va-c" style="opacity:0;animation:va-rise .72s cubic-bezier(.16,1,.3,1) ${i*.04+.08}s both">${c===' '?'&nbsp;':c}</span>`
      ).join('');
      setTimeout(()=>{
        el.querySelectorAll('.va-c').forEach(s=>{s.style.animation='';s.style.opacity='1';});
        el.textContent=chars.join('');
        const sc=new Scrambler(el);
        el.addEventListener('mouseenter',()=>sc.play());
      },chars.length*42+800);
      io.unobserve(el);
    });
  },{threshold:.4});
  document.querySelectorAll('.section-title').forEach(el=>{ el.style.visibility='hidden'; io.observe(el); });
}

/* ═══════════════════════════════════════════════
   12. MULTI-LAYER PARALLAX  (velocity-aware)
═══════════════════════════════════════════════ */
function initParallax(){
  const bgw=document.querySelector('.hero-bg-word');
  const av=document.querySelector('.avatar-wrap');
  const nums=document.querySelectorAll('.section-num');
  let lastY=0, vel=0;
  RAF.add(()=>{
    const sy=scrollY; vel=damp(vel,sy-lastY,8,.016); lastY=sy;
    const vh=innerHeight;
    if(bgw&&sy<vh) bgw.style.transform=`translateY(${sy*.16}px) translateX(${sy*.03}px) skewX(${vel*.05}deg)`;
    if(av&&sy<vh)  av.style.transform=`translateY(${sy*.065}px) rotate(${vel*.04}deg)`;
    nums.forEach(n=>{
      const r=n.closest('.section')?.getBoundingClientRect(); if(!r) return;
      const p=-r.top/r.height;
      if(p>-.5&&p<1.5) n.style.transform=`translateY(${p*55}px)`;
    });
  });
}

/* ═══════════════════════════════════════════════
   13. COUNT UP  (elastic ease)
═══════════════════════════════════════════════ */
function initCountUp(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, end=parseFloat(el.textContent); if(isNaN(end)) return;
      let t=0; el.textContent='0';
      const run=setInterval(()=>{
        t+=16; const p=clamp(t/2000,0,1);
        const ease=p===1?1:1-Math.pow(2,-10*p)*Math.cos(p*10*Math.PI*.5/4.5);
        const v=end*ease; el.textContent=end%1===0?Math.floor(v):v.toFixed(1);
        if(p>=1){el.textContent=end%1===0?end:end.toFixed(1);clearInterval(run);}
      },16);
      io.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('.stat-val,.cgpa-val,.tl-deco-val').forEach(el=>io.observe(el));
}

/* ═══════════════════════════════════════════════
   14. SKILL BARS  (shimmer fill)
═══════════════════════════════════════════════ */
function initBars(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-fill,.sf-fill').forEach(fill=>{
        const tw=fill.dataset.width||fill.style.width||'0'; fill.style.width='0';
        fill.style.backgroundImage='linear-gradient(90deg,var(--brown-lt),var(--brown),var(--brown-lt),var(--brown))';
        fill.style.backgroundSize='300% 100%';
        fill.style.animation='va-bsh 2.5s linear infinite';
        fill.style.transition='width 1.9s cubic-bezier(.16,1,.3,1) .15s';
        requestAnimationFrame(()=>setTimeout(()=>fill.style.width=tw,60));
      });
      io.unobserve(e.target);
    });
  },{threshold:.3});
  document.querySelectorAll('.about-stats-panel,.skill-feature').forEach(el=>io.observe(el));
}

/* ═══════════════════════════════════════════════
   15. AMBIENT ORBS
═══════════════════════════════════════════════ */
function initOrbs(){
  const hero=document.querySelector('.hero'); if(!hero) return;
  [{size:440,x:78,y:28,dur:24,del:0,op:.07},{size:300,x:12,y:72,dur:18,del:-7,op:.05},{size:200,x:92,y:85,dur:14,del:-3,op:.04}].forEach(({size,x,y,dur,del,op})=>{
    const o=document.createElement('div'); o.className='va-orb';
    o.style.cssText=`width:${size}px;height:${size}px;left:${x}%;top:${y}%;transform:translate(-50%,-50%);opacity:${op};--dur:${dur}s;--delay:${del}s;transform-origin:${50+rnd(-25,25)}px ${50+rnd(-25,25)}px;`;
    hero.appendChild(o);
  });
}

/* ═══════════════════════════════════════════════
   15B. AMBIENT BLOBS
═══════════════════════════════════════════════ */
function initAmbientBlobs(){
  const blobs=[
    {size:360,left:'8%',top:'14%',bg:'rgba(56,189,248,.18)',delay:'0s',dur:'20s'},
    {size:260,left:'84%',top:'10%',bg:'rgba(226,179,122,.16)',delay:'-6s',dur:'24s'},
    {size:220,left:'78%',top:'82%',bg:'rgba(244,114,182,.11)',delay:'-12s',dur:'18s'},
  ];
  blobs.forEach(({size,left,top,bg,delay,dur})=>{
    const blob=document.createElement('div');
    blob.className='va-blob';
    blob.style.cssText=`width:${size}px;height:${size}px;left:${left};top:${top};background:${bg};animation-duration:${dur};animation-delay:${delay};`;
    document.body.appendChild(blob);
  });
}

/* ═══════════════════════════════════════════════
   16. TIMELINE  (line grow + dot pop)
═══════════════════════════════════════════════ */
function initTimeline(){
  const tl=document.querySelector('.tl-line'); if(!tl) return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      tl.style.height='0'; tl.style.transition='height 2s cubic-bezier(.16,1,.3,1) .2s';
      requestAnimationFrame(()=>setTimeout(()=>tl.style.height='',60));
      document.querySelectorAll('.tl-dot').forEach((d,i)=>{
        d.style.opacity='0'; d.style.transform='scale(0)';
        setTimeout(()=>{ d.style.transition='opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)'; d.style.opacity='1'; d.style.transform='scale(1)'; },650+i*200);
      });
      io.unobserve(e.target);
    });
  },{threshold:.1});
  io.observe(tl);
}

/* ═══════════════════════════════════════════════
   17. CONTACT  (3D card entrance)
═══════════════════════════════════════════════ */
function initContact(){
  const cr=document.querySelector('.contact-right'); if(!cr) return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.contact-card').forEach((c,i)=>{ c.style.animation=`va-c3d .85s cubic-bezier(.16,1,.3,1) ${i*.1}s both`; });
      io.unobserve(e.target);
    });
  },{threshold:.1});
  io.observe(cr);
}

/* ═══════════════════════════════════════════════
   18. PROJECT SHIMMER
═══════════════════════════════════════════════ */
function initShimmer(){
  document.querySelectorAll('.pc-accent').forEach(acc=>{
    const card=acc.closest('.project-card'); if(!card) return;
    let shim=null;
    card.addEventListener('mouseenter',()=>{
      if(shim) return;
      shim=document.createElement('div');
      shim.style.cssText='position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);pointer-events:none;z-index:4;transition:left .7s cubic-bezier(.16,1,.3,1);';
      acc.style.position='relative'; acc.appendChild(shim);
      requestAnimationFrame(()=>shim.style.left='165%');
      setTimeout(()=>{ shim?.remove(); shim=null; },750);
    });
  });
}


function initProjectLinks(){
  document.querySelectorAll('.project-card[data-live-url]').forEach(card=>{
    const liveUrl=card.dataset.liveUrl;
    if(!liveUrl) return;

    card.tabIndex=0;
    card.setAttribute('role','link');
    card.setAttribute('aria-label','Open live project site');

    const openLive=()=>{ location.href=liveUrl; };

    card.addEventListener('click',e=>{
      if(e.target.closest('a,button,input,select,textarea,label')) return;
      openLive();
    });

    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        openLive();
      }
    });
  });
}
/* ═══════════════════════════════════════════════
   19. TAGS WAVE
═══════════════════════════════════════════════ */
function initTags(){
  const strip=document.querySelector('.learning-strip'); if(!strip) return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.learning-tags span').forEach((t,i)=>{
        t.style.opacity='0'; t.style.transform='translateY(22px) scale(.8)';
        t.style.transition=`opacity .5s cubic-bezier(.16,1,.3,1) ${i*.07}s,transform .5s cubic-bezier(.16,1,.3,1) ${i*.07}s`;
        setTimeout(()=>{ t.style.opacity='1'; t.style.transform=''; },50);
      });
      io.unobserve(e.target);
    });
  },{threshold:.5});
  io.observe(strip);
}

/* ═══════════════════════════════════════════════
   20. MISC
═══════════════════════════════════════════════ */
function initMisc(){
  // Year
  const yr=document.getElementById('year'); if(yr) yr.textContent=new Date().getFullYear();

  // Navbar entrance
  const nav=document.getElementById('navbar');
  if(nav){ nav.style.cssText='transform:translateY(-100%);opacity:0;'; nav.style.transition='transform .9s cubic-bezier(.16,1,.3,1),opacity .6s'; setTimeout(()=>{ nav.style.transform=''; nav.style.opacity=''; },200); }

  // Logo entrance
  const logo=document.querySelector('.nav-logo');
  if(logo){ logo.style.cssText='opacity:0;transform:translateX(-16px);transition:opacity .7s cubic-bezier(.16,1,.3,1) .5s,transform .7s cubic-bezier(.16,1,.3,1) .5s'; setTimeout(()=>{ logo.style.opacity='1'; logo.style.transform=''; },50); }

  // Nav items stagger
  document.querySelectorAll('.nav-item').forEach((a,i)=>{ a.style.cssText=`opacity:0;transform:translateY(-10px);transition:opacity .6s cubic-bezier(.16,1,.3,1) ${.5+i*.08}s,transform .6s cubic-bezier(.16,1,.3,1) ${.5+i*.08}s`; setTimeout(()=>{ a.style.opacity='1'; a.style.transform=''; },50); });
  const cta=document.querySelector('.nav-cta');
  if(cta){ cta.style.cssText='opacity:0;transform:translateY(-10px);transition:opacity .6s cubic-bezier(.16,1,.3,1) .95s,transform .6s cubic-bezier(.16,1,.3,1) .95s'; setTimeout(()=>{ cta.style.opacity='1'; cta.style.transform=''; },50); }

  // Avatar entrance
  const av=document.querySelector('.avatar-wrap');
  if(av){ av.style.cssText='opacity:0;transform:scale(.7) rotate(-10deg);transition:none;'; setTimeout(()=>{ av.style.transition='opacity 1.1s cubic-bezier(.16,1,.3,1) .7s,transform 1.1s cubic-bezier(.16,1,.3,1) .7s'; av.style.opacity='1'; av.style.transform=''; },100); }
}

/* ═══════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════ */
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',()=>{
  injectCSS();
  initMisc();
  initPreloader();
  initProgress();
  initCursor();
  initNav();
  initScroll();
  initReveals();
  initTitles();
  initParallax();
  initCountUp();
  initBars();
  initOrbs();
  initTimeline();
  initContact();
  initShimmer();
  initProjectLinks();
  initTags();
  initMagnetic();
  initRipple();
  initTilt();
});