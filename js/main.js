/* ============================================================
   MOTORES DE VEÍCULOS — main.js
   Custom cursor, scroll animations, counters, typewriter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && cursorRing && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    const animRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    const hoverables = document.querySelectorAll('a, button, .product-card, .benefit-card, .wpp-bubble');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('expanded'); cursorRing.classList.add('expanded'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('expanded'); cursorRing.classList.remove('expanded'); });
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('progress-bar');
  const updateProgress = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── INTERSECTION OBSERVER — REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .benefit-card, .product-card, .testimonial-card, .stat-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 4) * 100;
    observer.observe(el);
  });

  /* ── STAGGERED CARDS ── */
  document.querySelectorAll('.benefits-grid .benefit-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
  });
  document.querySelectorAll('.products-grid .product-card').forEach((el, i) => {
    el.dataset.delay = i * 120;
  });
  document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((el, i) => {
    el.dataset.delay = i * 120;
  });
  document.querySelectorAll('#stats .stat-item').forEach((el, i) => {
    el.dataset.delay = i * 150;
  });

  /* ── ANIMATED COUNTERS ── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current  = Math.floor(ease * target);
          el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ── TYPEWRITER HERO ── */
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const words   = typeTarget.dataset.words.split('|');
    let wIndex    = 0;
    let cIndex    = 0;
    let deleting  = false;
    const minWait = 80;
    const maxWait = 140;
    const pauseMs = 2200;

    const type = () => {
      const current = words[wIndex];
      if (deleting) {
        typeTarget.textContent = current.substring(0, cIndex - 1);
        cIndex--;
        if (cIndex === 0) {
          deleting = false;
          wIndex   = (wIndex + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, minWait / 2);
      } else {
        typeTarget.textContent = current.substring(0, cIndex + 1);
        cIndex++;
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(type, pauseMs);
          return;
        }
        setTimeout(type, minWait + Math.random() * (maxWait - minWait));
      }
    };
    setTimeout(type, 1400);
  }

  /* ── SPEED LINE BURST on click ── */
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768) return;
    const burst = document.createElement('div');
    burst.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #E01020;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(burst);
    const anim = burst.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%,-50%) scale(20)', opacity: 0 }
    ], { duration: 400, easing: 'ease-out' });
    anim.onfinish = () => burst.remove();
  });

  /* ── PARALLAX HERO BACKGROUND ── */
  const heroLines = document.querySelector('.hero-lines');
  if (heroLines) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroLines.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ── SMOOTH SCROLL nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── PRODUCT CARD: open WhatsApp on click ── */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-product')) return; // already handled
      const name = card.querySelector('.product-name')?.textContent || 'motor';
      const msg  = encodeURIComponent(`Olá! Vi o site e tenho interesse no: ${name}. Pode me passar mais informações?`);
      window.open(`https://wa.me/5511974993984?text=${msg}`, '_blank');
    });
  });

});
