const btn  = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const nav  = document.getElementById('site-nav');
const backdrop = document.getElementById('mobile-backdrop');

// Mobile menu toggle (improved)
if (btn && menu) {
  const iconOpen  = btn.querySelector('svg[data-icon="open"]');
  const iconClose = btn.querySelector('svg[data-icon="close"]');
  const links = document.querySelectorAll('#mobile-menu .mobile-link');

  const openMenu = () => {
    // height animation
    const content = menu.firstElementChild;
    const target = content ? content.scrollHeight : 0;
    menu.style.maxHeight = target + 'px';
    menu.classList.remove('opacity-0');
    menu.classList.add('opacity-100');
    btn.setAttribute('aria-expanded', 'true');
    // icons
    if (iconOpen) iconOpen.classList.add('hidden');
    if (iconClose) iconClose.classList.remove('hidden');
    // backdrop
    if (backdrop) {
      backdrop.classList.remove('pointer-events-none');
      backdrop.classList.add('opacity-100');
    }
    // lock scroll
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeMenu = () => {
    menu.style.maxHeight = '0px';
    menu.classList.add('opacity-0');
    menu.classList.remove('opacity-100');
    btn.setAttribute('aria-expanded', 'false');
    if (iconOpen) iconOpen.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
    if (backdrop) {
      backdrop.classList.add('pointer-events-none');
      backdrop.classList.remove('opacity-100');
    }
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
  };

  const toggleMenu = () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  };

  btn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  links.forEach(el => el.addEventListener('click', closeMenu));

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) { // md breakpoint
      closeMenu();
    }
  });
}

// Smooth navbar reveal on scroll
if (nav) {
  let ticking = false;
  const threshold = 24;

  const updateNav = () => {
    const scrolled = window.scrollY || window.pageYOffset;
    if (scrolled > threshold) {
      nav.classList.remove('-translate-y-full', 'opacity-0');
      nav.classList.add('translate-y-0', 'opacity-100');
    } else {
      nav.classList.add('-translate-y-full', 'opacity-0');
      nav.classList.remove('translate-y-0', 'opacity-100');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Initial state
  updateNav();
}

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (_) {}
});

// Set footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Simple lightbox for project images with data-full
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('img-modal');
  const modalImg = document.getElementById('img-modal-img');
  const closeBtn = document.getElementById('img-modal-close');
  const backdrop = document.getElementById('img-modal-backdrop');
  if (!modal || !modalImg) return;

  const open = (src) => {
    modalImg.src = src || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.add('hidden');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-full]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const src = el.getAttribute('data-full');
      if (src) open(src);
    });
  });
  closeBtn && closeBtn.addEventListener('click', close);
  backdrop && backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
});

// Scroll-to-top button
document.addEventListener('DOMContentLoaded', () => {
  const scrollUp = document.getElementById('scroll-up');
  if (!scrollUp) return;
  const showAt = 200; // px
  let ticking = false;

  const updateBtn = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > showAt) {
      scrollUp.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      scrollUp.classList.add('opacity-100', 'translate-y-0');
    } else {
      scrollUp.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      scrollUp.classList.remove('opacity-100', 'translate-y-0');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBtn);
      ticking = true;
    }
  }, { passive: true });

  scrollUp.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial state
  updateBtn();
});

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const supportsIO = 'IntersectionObserver' in window;
  if (!supportsIO) {
    items.forEach(el => {
      el.classList.remove('opacity-0', 'translate-y-8');
      el.classList.add('opacity-100', 'translate-y-0');
    });
    return;
  }
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Prepare per-text child animations with stagger and directional slide
  items.forEach(el => {
    const texts = el.querySelectorAll('h1, h2, h3, h4, p, li, dt, dd, a, button, small, figcaption');
    texts.forEach((t, i) => {
      t.dataset.textAnim = 'true';
      if (!reduceMotion) {
        t.classList.add('opacity-0', 'transition-all', 'duration-500', 'ease-out', 'will-change-transform');
        // apply directional offset based on nearest data-dir for EACH element
        const dirEl = t.closest('[data-dir]');
        const d = dirEl ? dirEl.getAttribute('data-dir') : null; // 'left' | 'right' | null
        if (d === 'left') {
          t.classList.add('-translate-x-6');
        } else if (d === 'right') {
          t.classList.add('translate-x-6');
        } else {
          // default subtle up if no direction specified
          t.classList.add('translate-y-2');
        }
        // stagger delays up to ~600ms
        t.style.transitionDelay = `${Math.min(i * 70, 600)}ms`;
      } else {
        t.classList.add('opacity-100');
        t.classList.remove('opacity-0');
      }
    });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-8');
        // reveal per-text children
        const texts = el.querySelectorAll('[data-text-anim="true"]');
        texts.forEach(t => {
          t.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
          t.classList.remove('opacity-0', 'translate-y-2', 'translate-x-6', '-translate-x-6');
        });
      } else if (!reduceMotion) {
        el.classList.add('opacity-0', 'translate-y-8');
        el.classList.remove('opacity-100', 'translate-y-0');
        // hide per-text children for re-entrance (re-apply directional offset based on nearest data-dir)
        const texts = el.querySelectorAll('[data-text-anim="true"]');
        texts.forEach(t => {
          const dirEl = t.closest('[data-dir]');
          const d = dirEl ? dirEl.getAttribute('data-dir') : null;
          t.classList.add('opacity-0');
          t.classList.remove('opacity-100', 'translate-x-0', 'translate-y-0');
          // reset all offsets then apply target
          t.classList.remove('translate-y-2', 'translate-x-6', '-translate-x-6');
          if (d === 'left') t.classList.add('-translate-x-6');
          else if (d === 'right') t.classList.add('translate-x-6');
          else t.classList.add('translate-y-2');
        });
      }
    });
  }, { threshold: 0.2 });
  items.forEach(el => observer.observe(el));
});

// Typewriter effect for the home subtitle
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = ['Programmer', 'Freelancer', 'UI/UX Designer', 'IT Student'];
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    // Simple swap without typing
    let i = 0;
    el.textContent = words[i];
    setInterval(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
    }, 2000);
    return;
  }

  const typeSpeed = 90;      // ms per character when typing
  const deleteSpeed = 60;    // ms per character when deleting
  const holdTime = 900;      // pause when full word is shown
  const betweenWords = 350;  // pause after delete before next type

  let wordIndex = 0;
  let charIndex = 0;
  let typing = true;

  const tick = () => {
    const word = words[wordIndex];
    if (typing) {
      el.textContent = word.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) {
        typing = false;
        setTimeout(tick, holdTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = word.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        typing = true;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, betweenWords);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  };

  // Start typing from current initial content
  const initial = el.textContent || '';
  const startIndex = words.indexOf(initial);
  if (startIndex >= 0) wordIndex = startIndex; // align with initial if matches
  el.textContent = '';
  charIndex = 0;
  typing = true;
  tick();
});
