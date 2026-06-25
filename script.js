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

/* ─────────────────────────────────────────────
   MARQUEE — highlight span under stationary cursor
   CSS :hover doesn't re-evaluate during animations,
   so we use elementFromPoint on every rAF tick.
───────────────────────────────────────────── */
(function () {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  let cx = null, cy = null;
  let lit = null;
  let raf = null;

  function tick() {
    if (cx === null) return;
    const el = document.elementFromPoint(cx, cy);
    const span = el && el.tagName === 'SPAN' && !el.classList.contains('sep') && el.closest('.marquee-inner')
      ? el : null;

    if (span !== lit) {
      if (lit) lit.classList.remove('marquee-lit');
      lit = span;
      if (lit) lit.classList.add('marquee-lit');
    }
    raf = requestAnimationFrame(tick);
  }

  track.addEventListener('pointerenter', (e) => {
    cx = e.clientX; cy = e.clientY;
    raf = requestAnimationFrame(tick);
  });
  track.addEventListener('pointermove', (e) => {
    cx = e.clientX; cy = e.clientY;
  });
  track.addEventListener('pointerleave', () => {
    cx = cy = null;
    if (lit) { lit.classList.remove('marquee-lit'); lit = null; }
    cancelAnimationFrame(raf);
  });
})();

/* ─────────────────────────────────────────────
   METRIC ANIMATIONS — count-up + card stagger
───────────────────────────────────────────── */

// Easing
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

// Count-up: works with elements that may have <sup> children
// by updating only the first text node so markup stays intact
function animateCount(el) {
  const target  = parseInt(el.dataset.count, 10);
  const format  = el.dataset.format || '';   // 'K' → display as "2.1K"
  const suffix  = el.dataset.suffix || '';   // '%', '+', '×'
  const dur     = 2800;
  let   start   = null;

  // Find or create the leading text node
  let textNode = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
  if (!textNode) {
    textNode = document.createTextNode('');
    el.insertBefore(textNode, el.firstChild);
  }

  function step(ts) {
    if (!start) start = ts;
    const p   = Math.min((ts - start) / dur, 1);
    const val = Math.round(easeOutQuart(p) * target);

    if (format === 'K') {
      textNode.textContent = (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      textNode.textContent = val + suffix;
    }

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      // Gold flash on completion
      el.classList.add('count-done');
      setTimeout(() => el.classList.remove('count-done'), 700);
    }
  }

  requestAnimationFrame(step);
}

// Observe numeric stat elements
const countEls = document.querySelectorAll(
  '.h-stat-num[data-count], .cs-m-val[data-count]'
);

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

countEls.forEach(el => countObserver.observe(el));

// Symbol pop-in for non-numeric cs-m-val (↑, ✓, etc.)
const symbolEls = document.querySelectorAll('.cs-m-val:not([data-count])');

const symbolObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('metric-symbol-pop');
    symbolObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

symbolEls.forEach(el => symbolObserver.observe(el));

// Staggered entrance for .cs-metric cards
const metricGroups = document.querySelectorAll('.cs-metrics');

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.cs-metric').forEach((card, i) => {
      setTimeout(() => card.classList.add('metric-in'), i * 150);
    });
    metricsObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

metricGroups.forEach(g => metricsObserver.observe(g));
