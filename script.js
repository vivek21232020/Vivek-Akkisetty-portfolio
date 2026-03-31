/* ═══════════════════════════════════════════════
   VIVEK AKKISETTY — PORTFOLIO v2.0
   JavaScript: Cursor, Scroll, Nav, Animations
═══════════════════════════════════════════════ */

/* ── Run immediately: mark body as JS-enabled ── */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* ── Dynamic Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── Custom Cursor (desktop only) ── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';

      const inNavZone = mouseY < 90;
      cursor.style.opacity   = inNavZone ? '0' : '1';
      follower.style.opacity = inNavZone ? '0' : '1';
    });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.09;
      followerY += (mouseY - followerY) * 0.09;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }


  /* ── Navbar: scroll shadow + active link highlight ── */
  const navbar   = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      const href = (item.getAttribute('href') || '').replace('#', '');
      item.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── Mobile Menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ── Smooth Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });


  /* ── Reveal on scroll (Intersection Observer) ── */
  const makeObserver = () => {
    return new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Cancel the CSS fallback animation now that JS has handled it
            entry.target.style.animation = 'none';
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
  };

  const observer = makeObserver();

  /* Reveal all .reveal elements */
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Staggered cards */
  [
    { selector: '.skill-tile',   delay: 0.08 },
    { selector: '.project-card', delay: 0.1  },
    { selector: '.contact-card', delay: 0.08 },
  ].forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * delay}s`;
        observer.observe(el);
      }
    });
  });


  /* ── Animated progress bars ── */
  const barObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-fill, .sf-fill').forEach(fill => {
            const w = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => { fill.style.width = w; }, 150);
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.about-stats-panel, .skill-feature').forEach(el => {
    barObserver.observe(el);
  });


  /* ── Hero name hover letter animation ── */
  document.querySelectorAll('.name-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = text.split('').map(ch =>
      `<span style="display:inline-block;transition:transform 0.35s ease,color 0.35s ease">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');

    line.addEventListener('mouseenter', () => {
      line.querySelectorAll('span').forEach((span, i) => {
        setTimeout(() => {
          span.style.transform = 'translateY(-5px)';
          span.style.color = 'var(--brown)';
          setTimeout(() => {
            span.style.transform = '';
            span.style.color = '';
          }, 320);
        }, i * 35);
      });
    });
  });


  /* ── Parallax on hero bg word ── */
  const heroBg = document.querySelector('.hero-bg-word');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }, { passive: true });
  }

});