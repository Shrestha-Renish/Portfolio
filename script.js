/* ─────────────────────────────────────────────
   TYPED.JS
───────────────────────────────────────────── */
new Typed('.typing', {
  strings: [
    'Digital Marketer.',
    'Social Media Strategist.',
    'LinkedIn Growth Expert.',
    'Content Creator.',
  ],
  typeSpeed: 65,
  backSpeed: 30,
  backDelay: 2200,
  loop: true,
  cursorChar: '|',
});

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let rafId;

function lerp(a, b, t) { return a + (b - a) * t; }

function animateCursor() {
  ringX = lerp(ringX, mouseX, 0.14);
  ringY = lerp(ringY, mouseY, 0.14);

  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  rafId = requestAnimationFrame(animateCursor);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';

  if (!ring.classList.contains('visible')) {
    ring.classList.add('visible');
    dot.classList.add('visible');
    animateCursor();
  }
});

document.addEventListener('mouseleave', () => {
  ring.classList.remove('visible');
  dot.classList.remove('visible');
});

// Expand cursor on interactive elements
document.querySelectorAll('a, button, [data-cursor-expand]').forEach((el) => {
  el.addEventListener('mouseenter', () => ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});

// Click shrink
document.addEventListener('mousedown', () => ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring.classList.remove('click'));

/* ─────────────────────────────────────────────
   SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ─────────────────────────────────────────────
   STICKY NAV — becomes solid on scroll
───────────────────────────────────────────── */
const header = document.getElementById('site-header');

const headerObserver = new IntersectionObserver(
  ([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
);

const hero = document.getElementById('hero');
if (hero) headerObserver.observe(hero);

/* ─────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────────
   ANIMATED NUMBER COUNTERS
───────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600;
      let   start  = null;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / dur, 1);
        const val = Math.round(easeOutQuart(progress) * target);
        el.textContent = val.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((c) => counterObserver.observe(c));

/* ─────────────────────────────────────────────
   PARALLAX — subtle drift on the inner hero content
   (wrapper has overflow:hidden so it never bleeds)
───────────────────────────────────────────── */
const heroInner = document.querySelector('.hero');

if (heroInner && window.innerWidth > 768) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroInner.style.transform = `translateY(${y * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ─────────────────────────────────────────────
   SMOOTH HOVER UNDERLINE on case study titles
───────────────────────────────────────────── */
document.querySelectorAll('.cs-block').forEach((block) => {
  const title = block.querySelector('.cs-title');
  if (!title) return;

  title.style.transition = 'color 0.35s ease';

  block.addEventListener('mouseenter', () => {
    title.style.color = 'var(--gold)';
  });
  block.addEventListener('mouseleave', () => {
    title.style.color = '';
  });
});
