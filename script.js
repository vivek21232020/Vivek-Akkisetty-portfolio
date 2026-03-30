/* ═══════════════════════════════════════════════
   VIVEK AKKISETTY — PORTFOLIO v2.0
   JavaScript: Cursor, Scroll, Nav, Animations
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Dynamic Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── Custom Cursor ── */
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
    });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
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
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navItems.forEach(item => {
      const href = item.getAttribute('href').replace('#', '');
      item.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── Mobile Menu Toggle ── */
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
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ── Intersection Observer: reveal on scroll ── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));


  /* ── Staggered card reveals ── */
  const staggerGroups = [
    { selector: '.skill-tile',    delay: 0.1 },
    { selector: '.project-card',  delay: 0.12 },
    { selector: '.contact-card',  delay: 0.1 },
  ];

  staggerGroups.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * delay}s`;
        observer.observe(el);
      }
    });
  });


  /* ── Animated progress bars (triggered on visibility) ── */
  const barObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.stat-fill, .sf-fill');
          fills.forEach(fill => {
            const target = fill.style.width;
            fill.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => { fill.style.width = target; }, 100);
            });
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.about-stats-panel, .skill-feature').forEach(el => {
    barObserver.observe(el);
  });


  /* ── Hero name letter animation ── */
  document.querySelectorAll('.name-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = text.split('').map(ch =>
      `<span style="display:inline-block;transition:transform 0.4s ease,opacity 0.4s ease">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');

    line.addEventListener('mouseenter', () => {
      line.querySelectorAll('span').forEach((span, i) => {
        setTimeout(() => {
          span.style.transform = `translateY(-6px)`;
          span.style.color = 'var(--brown)';
          setTimeout(() => {
            span.style.transform = '';
            span.style.color = '';
          }, 350);
        }, i * 40);
      });
    });
  });


  /* ── Parallax on hero bg word ── */
  const heroBg = document.querySelector('.hero-bg-word');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  }

});