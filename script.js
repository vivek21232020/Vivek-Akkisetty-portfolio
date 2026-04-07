/* ═══════════════════════════════════════════════
   VIVEK AKKISETTY — PORTFOLIO v4.0
   Premium Animation Engine
   - Magnetic cursor with distortion
   - Cinematic page entrance
   - GSAP-style spring physics (vanilla JS)
   - Particle trail on cursor
   - Text scramble on section titles
   - Smooth card tilt (3D)
   - Ripple click effects
   - Stagger reveals with spring easing
   - Scroll-linked parallax layers
   - Number count-up animation
   - Morphing nav indicator
   - Hover shimmer effect
═══════════════════════════════════════════════ */

document.documentElement.classList.add('js');

/* ─── Utility: Spring Physics ─────────────────── */
class Spring {
  constructor(stiffness = 0.08, damping = 0.75) {
    this.stiffness = stiffness;
    this.damping   = damping;
    this.value     = 0;
    this.target    = 0;
    this.velocity  = 0;
  }
  update() {
    const force    = (this.target - this.value) * this.stiffness;
    this.velocity  = (this.velocity + force) * this.damping;
    this.value    += this.velocity;
    return this.value;
  }
}

/* ─── Utility: clamp / lerp ──────────────────── */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp  = (a, b, t) => a + (b - a) * t;

/* ─── Utility: rAF ticker ────────────────────── */
const ticker = { cbs: [], add(fn) { this.cbs.push(fn); }, remove(fn) { this.cbs = this.cbs.filter(f => f !== fn); } };
let _ticking = false;
function runTicker() {
  ticker.cbs.forEach(fn => fn());
  _ticking = true;
  requestAnimationFrame(runTicker);
}
runTicker();

/* ─── Page Entrance ──────────────────────────── */
function initPageEntrance() {
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(10px)';
  document.body.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    }, 80);
  });
}

/* ─── Magnetic Cursor with Particle Trail ────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || window.innerWidth <= 768) return;

  // Particle canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9996;`;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = [];
  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.size = Math.random() * 3 + 1;
      this.alpha = 0.6;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.97;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = clamp(this.alpha, 0, 1);
      ctx.fillStyle = '#8B6F63';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  const springX = new Spring(0.12, 0.72);
  const springY = new Spring(0.12, 0.72);
  springX.value = springX.target = mouseX;
  springY.value = springY.target = mouseY;
  let cursorVisible = false;
  let isHovering = false;
  let frameCount = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    springX.target = mouseX;
    springY.target = mouseY;
    if (!cursorVisible) {
      cursorVisible = true;
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
    const inNavZone = mouseY < 80;
    cursor.style.opacity   = inNavZone ? '0' : '1';
    follower.style.opacity = inNavZone ? '0' : '1';

    // Spawn particles (every 2 frames for perf)
    if (frameCount % 2 === 0 && !inNavZone) {
      particles.push(new Particle(mouseX, mouseY));
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });

  // Magnetic effect on interactive elements
  const magnetTargets = document.querySelectorAll('.btn-primary, .nav-cta, .contact-card, .btn-outline');
  magnetTargets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const elX    = rect.left + rect.width / 2;
      const elY    = rect.top  + rect.height / 2;
      const dx     = e.clientX - elX;
      const dy     = e.clientY - elY;
      const dist   = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 60;
      if (dist < maxDist) {
        const pull = (maxDist - dist) / maxDist;
        el.style.transform = `translate(${dx * pull * 0.35}px, ${dy * pull * 0.35}px)`;
      }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Interactive element hover states
  const interactiveEls = 'a, button, .skill-tile, .project-card, .contact-card, .learning-tags span';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveEls)) {
      isHovering = true;
      cursor.style.width   = '14px';
      cursor.style.height  = '14px';
      follower.style.width  = '52px';
      follower.style.height = '52px';
      follower.style.borderColor = 'rgba(92,64,51,0.6)';
      follower.style.background  = 'rgba(92,64,51,0.06)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveEls)) {
      isHovering = false;
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.width  = '32px';
      follower.style.height = '32px';
      follower.style.borderColor = 'rgba(92,64,51,0.35)';
      follower.style.background  = 'transparent';
    }
  });

  // Click burst
  document.addEventListener('click', e => {
    if (e.clientY < 80) return;
    for (let i = 0; i < 10; i++) {
      const p = new Particle(e.clientX, e.clientY);
      p.vx *= 3; p.vy *= 3;
      p.size = Math.random() * 5 + 2;
      particles.push(p);
    }
    // Cursor punch
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    setTimeout(() => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; }, 180);
  });

  ticker.add(() => {
    frameCount++;
    const fx = springX.update();
    const fy = springY.update();

    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';

    // Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
  });
}

/* ─── Text Scramble Effect ───────────────────── */
class TextScramble {
  constructor(el) {
    this.el   = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    this.original = el.textContent;
    this.frame = 0;
    this.queue = [];
    this.rafId = null;
  }
  scramble(newText) {
    const text = newText || this.original;
    const len  = Math.max(this.el.textContent.length, text.length);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from  = this.el.textContent[i] || '';
      const to    = text[i] || '';
      const start = Math.floor(Math.random() * 12);
      const end   = start + Math.floor(Math.random() * 12) + 6;
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.rafId);
    this.frame = 0;
    this._update();
  }
  _update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (Math.random() < 0.28) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span class="scramble-char">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete < this.queue.length) {
      this.frame++;
      this.rafId = requestAnimationFrame(() => this._update());
    } else {
      this.el.textContent = this.queue.map(q => q.to).join('');
    }
  }
}

/* ─── 3D Card Tilt ───────────────────────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-tile, .about-stats-panel, .tl-card');
  cards.forEach(card => {
    const springRX = new Spring(0.1, 0.78);
    const springRY = new Spring(0.1, 0.78);
    const springScale = new Spring(0.15, 0.8);
    springScale.value = springScale.target = 1;
    let active = false;

    card.addEventListener('mouseenter', () => {
      active = true;
      springScale.target = 1.025;
      card.style.willChange = 'transform';
      card.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', () => {
      active = false;
      springRX.target = 0;
      springRY.target = 0;
      springScale.target = 1;
      setTimeout(() => { card.style.zIndex = ''; }, 400);
    });
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      springRX.target = -dy * 8;
      springRY.target =  dx * 8;
    });

    ticker.add(() => {
      if (!active && Math.abs(springRX.velocity) < 0.001 && Math.abs(springRY.velocity) < 0.001 && Math.abs(springScale.velocity) < 0.001) return;
      const rx = springRX.update();
      const ry = springRY.update();
      const sc = springScale.update();
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`;
    });
  });
}

/* ─── Count-Up Numbers ───────────────────────── */
function initCountUp() {
  const els = document.querySelectorAll('.stat-val, .cgpa-val, .tl-deco-val');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.textContent);
      if (isNaN(end)) return;
      let start  = 0;
      const dur  = 1800;
      const step = 16;
      let elapsed = 0;
      el.textContent = '0';
      const timer = setInterval(() => {
        elapsed += step;
        const prog  = clamp(elapsed / dur, 0, 1);
        // Ease out expo
        const ease  = prog === 1 ? 1 : 1 - Math.pow(2, -10 * prog);
        const value = lerp(start, end, ease);
        el.textContent = value % 1 === 0 ? Math.floor(value) : value.toFixed(1);
        if (prog >= 1) clearInterval(timer);
      }, step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => countObserver.observe(el));
}

/* ─── Ripple on Click ────────────────────────── */
function initRipple() {
  const targets = document.querySelectorAll('.btn-primary, .btn-outline, .btn-ghost, .nav-cta, .contact-card, .skill-tile');
  targets.forEach(el => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const size   = Math.max(rect.width, rect.height) * 2.2;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        transform:translate(-50%,-50%) scale(0);
        background:rgba(92,64,51,0.12);
        border-radius:50%;
        pointer-events:none;
        animation: rippleAnim 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
        z-index:0;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 680);
    });
  });
}

/* ─── Scroll Progress Bar ────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2.5px;
    background: linear-gradient(to right, #C4A99B, #5C4033, #2E1F18);
    z-index:9999; width:0%; transform-origin:left;
    transition:width 0.08s linear;
    border-radius:0 2px 2px 0;
    box-shadow: 0 0 8px rgba(92,64,51,0.4);
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = (scrollTop / docHeight * 100) + '%';
  }, { passive: true });
}

/* ─── Section Title Scramble on Reveal ───────── */
function initScrambleTitles() {
  const titles = document.querySelectorAll('.section-title');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scrambler = new TextScramble(entry.target);
        setTimeout(() => scrambler.scramble(), 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  titles.forEach(t => obs.observe(t));
}

/* ─── Premium Reveal with Stagger ───────────── */
function initReveal() {
  // Add inline CSS for scramble chars
  const style = document.createElement('style');
  style.textContent = `
    .scramble-char { color: var(--brown-lt); font-style: normal; }
    @keyframes rippleAnim {
      to { transform:translate(-50%,-50%) scale(1); opacity:0; }
    }
    @keyframes slideUpFade {
      from { opacity:0; transform:translateY(40px) skewY(1deg); }
      to   { opacity:1; transform:translateY(0) skewY(0deg); }
    }
    @keyframes slideInLeft {
      from { opacity:0; transform:translateX(-40px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity:0; transform:translateX(40px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes zoomIn {
      from { opacity:0; transform:scale(0.88) translateY(20px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes floatBadge {
      0%,100% { transform:translateY(0px); }
      50%      { transform:translateY(-8px); }
    }
    .avatar-badge { animation: floatBadge 3s ease-in-out infinite; }
    .tl-item .reveal { --anim: slideInLeft; }
    .hero-right .reveal { --anim: slideInRight; }

    /* Shimmer hover on project cards */
    .project-card::before {
      content:'';
      position:absolute;
      top:0; left:-100%; width:60%; height:100%;
      background:linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
      transition:none;
      pointer-events:none;
      z-index:2;
    }
    .project-card:hover::before {
      animation: shimmerSlide 0.65s ease forwards;
    }
    @keyframes shimmerSlide {
      to { left:150%; }
    }

    /* Nav morphing underline */
    .nav-links { position: relative; }
    #navIndicator {
      position:absolute;
      bottom:-2px; height:2px;
      background:var(--brown);
      border-radius:2px;
      transition:left 0.4s cubic-bezier(0.16,1,0.3,1), width 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
      opacity:0;
      pointer-events:none;
    }
    
    /* Avatar ring pulse */
    .avatar-ring-inner {
      animation: ringPulse 3s ease-in-out infinite;
    }
    @keyframes ringPulse {
      0%,100% { box-shadow: 0 0 0 6px rgba(92,64,51,0.05); }
      50%      { box-shadow: 0 0 0 14px rgba(92,64,51,0.02); }
    }

    /* Hero bg word drift */
    .hero-bg-word {
      transition: transform 0.1s linear;
      will-change: transform;
    }

    /* Skill tile icon bounce */
    .skill-tile:hover .st-icon {
      animation: iconBounce 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }
    @keyframes iconBounce {
      0%,100% { transform:scale(1); }
      30%      { transform:scale(0.85); }
      60%      { transform:scale(1.15); }
    }

    /* Contact card slide in with spring */
    .contact-card {
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), 
                  background 0.3s ease,
                  border-color 0.3s ease,
                  box-shadow 0.45s cubic-bezier(0.16,1,0.3,1);
    }
    .contact-card:hover {
      transform: translateX(10px) scale(1.01);
      box-shadow: -4px 0 24px rgba(92,64,51,0.15);
    }

    /* Learning tag stagger */
    .learning-tags span {
      transition: background 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .learning-tags span:hover {
      transform: translateY(-3px) scale(1.05);
    }

    /* Scroll cue refined */
    .scroll-cue span {
      animation: fadeUpText 1s ease 1.5s both;
    }
    @keyframes fadeUpText {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Stat bar animated gradient */
    .stat-fill, .sf-fill {
      background-size: 200% 100%;
      animation: barShimmer 2s ease-in-out infinite;
    }
    @keyframes barShimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }

    /* Footer hover glow */
    .footer-links a {
      transition: color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1), text-shadow 0.3s ease;
    }
    .footer-links a:hover {
      transform: translateY(-4px);
      text-shadow: 0 4px 12px rgba(196,169,155,0.4);
    }

    /* About quote border animate */
    .about-quote {
      position:relative;
      overflow:hidden;
    }
    .about-quote::after {
      content:'';
      position:absolute;
      top:0; left:0;
      width:3px; height:0;
      background:var(--brown);
      transition:height 1s cubic-bezier(0.16,1,0.3,1) 0.3s;
    }
    .about-quote.visible::after { height:100%; }

    /* Section number parallax */
    .section-num { will-change: transform; }
  `;
  document.head.appendChild(style);

  // Reveal observer
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el   = entry.target;
        const anim = getComputedStyle(el).getPropertyValue('--anim').trim() || 'slideUpFade';
        el.style.animation = `${anim} 0.8s cubic-bezier(0.16,1,0.3,1) both`;
        el.classList.add('visible');

        // Trigger about-quote border
        if (el.classList.contains('about-quote')) {
          el.classList.add('visible');
        }
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });

  // Stagger cards
  [
    { sel: '.skill-tile',         delay: 0.09, anim: 'zoomIn' },
    { sel: '.project-card',       delay: 0.12, anim: 'slideUpFade' },
    { sel: '.contact-card',       delay: 0.09, anim: 'slideInRight' },
    { sel: '.learning-tags span', delay: 0.06, anim: 'zoomIn' },
    { sel: '.stat-mini',          delay: 0.1,  anim: 'zoomIn' },
  ].forEach(({ sel, delay, anim }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.style.opacity = '0';
        el.style.setProperty('--anim', anim);
        el.style.animationDelay = `${i * delay}s`;
        el.classList.add('reveal');
        revealObserver.observe(el);
      }
    });
  });

  // Progress bars
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-fill, .sf-fill').forEach(fill => {
        const tw = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'width 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s';
        requestAnimationFrame(() => setTimeout(() => { fill.style.width = tw; }, 60));
      });
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.about-stats-panel, .skill-feature').forEach(el => barObserver.observe(el));
}

/* ─── Navbar: Morphing Indicator + Shadow ────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const navLinks = document.getElementById('navLinks');
  const sections = document.querySelectorAll('section[id]');

  // Morphing underline indicator
  const indicator = document.createElement('div');
  indicator.id = 'navIndicator';
  navLinks && navLinks.appendChild(indicator);

  const updateNavIndicator = (el) => {
    if (!el || !navLinks) return;
    const rect    = el.getBoundingClientRect();
    const listRect = navLinks.getBoundingClientRect();
    indicator.style.opacity = '1';
    indicator.style.left    = (rect.left - listRect.left) + 'px';
    indicator.style.width   = rect.width + 'px';
  };

  const updateNav = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navItems.forEach(item => {
      const href = (item.getAttribute('href') || '').replace('#', '');
      const isActive = href === current;
      item.classList.toggle('active', isActive);
      if (isActive) updateNavIndicator(item);
    });
    if (!current) indicator.style.opacity = '0';
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => updateNavIndicator(item));
    item.addEventListener('mouseleave', updateNav);
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ─── Smooth Scroll ──────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Dynamic Year ───────────────────────────── */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ─── Hero: Letter Wave + Parallax ──────────── */
function initHero() {
  // Letter wave
  document.querySelectorAll('.name-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = text.split('').map((ch, i) =>
      `<span style="display:inline-block;transition:transform 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s, color 0.3s ease">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    line.addEventListener('mouseenter', () => {
      line.querySelectorAll('span').forEach((span, i) => {
        setTimeout(() => {
          span.style.transform = 'translateY(-8px) rotate(-2deg)';
          span.style.color = 'var(--brown)';
          setTimeout(() => {
            span.style.transform = '';
            span.style.color = '';
          }, 420);
        }, i * 35);
      });
    });
  });

  // Parallax on hero bg word + avatar
  const heroBgWord = document.querySelector('.hero-bg-word');
  const avatarWrap = document.querySelector('.avatar-wrap');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > window.innerHeight) return;
    if (heroBgWord) heroBgWord.style.transform = `translateY(${sy * 0.14}px) translateX(${sy * 0.02}px)`;
    if (avatarWrap) avatarWrap.style.transform  = `translateY(${sy * 0.06}px)`;
  }, { passive: true });

  // Eyebrow text entrance
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) {
    eyebrow.style.clipPath = 'inset(0 100% 0 0)';
    eyebrow.style.transition = 'clip-path 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s';
    setTimeout(() => { eyebrow.style.clipPath = 'inset(0 0% 0 0)'; }, 100);
  }
}

/* ─── Section Number Parallax ────────────────── */
function initSectionNums() {
  const nums = document.querySelectorAll('.section-num');
  window.addEventListener('scroll', () => {
    nums.forEach(num => {
      const rect = num.closest('.section')?.getBoundingClientRect();
      if (!rect) return;
      const progress = -rect.top / rect.height;
      if (progress > -0.5 && progress < 1.5) {
        num.style.transform = `translateY(${progress * 40}px)`;
      }
    });
  }, { passive: true });
}

/* ─── Availability Dot Pulse ─────────────────── */
function initAvailDot() {
  const dot = document.querySelector('.avail-dot');
  if (!dot) return;
  dot.style.boxShadow = '0 0 0 0 rgba(92,184,92,0.5)';
}

/* ─── Init All ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initPageEntrance();
  initReveal();
  initNavbar();
  initSmoothScroll();
  initHero();
  initCursor();
  initCardTilt();
  initCountUp();
  initRipple();
  initScrollProgress();
  initScrambleTitles();
  initSectionNums();
  initAvailDot();
});