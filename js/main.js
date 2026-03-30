/* =============================================
   酒と料理 戸塚駅横研究所 — main.js
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Header scroll effect ───
  const header = document.getElementById('header');
  let lastScrollY = 0;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init

  // ─── 2. Hamburger / Mobile Nav ───
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on mobile nav link click
  document.querySelectorAll('.mobile-nav-link, .mobile-nav a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on backdrop click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) toggleMenu(false);
  });

  // ─── 3. Hero load animation ───
  const hero = document.getElementById('hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  // ─── 4. Scroll reveal (IntersectionObserver) ───
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── 5. Menu Slideshow ───
  const slides = document.querySelectorAll('.slide');
  const slideDotsContainer = document.getElementById('slide-dots');
  let currentSlide = 0;
  let slideshowTimer = null;

  if (slides.length > 0 && slideDotsContainer) {
    // Remove the slide-dots div from slides NodeList consideration
    const actualSlides = Array.from(slides);

    // Build dots
    actualSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `スライド${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetTimer();
      });
      slideDotsContainer.appendChild(dot);
    });

    const dots = slideDotsContainer.querySelectorAll('.slide-dot');

    const goToSlide = (index) => {
      actualSlides[currentSlide].classList.remove('active');
      dots[currentSlide]?.classList.remove('active');
      currentSlide = (index + actualSlides.length) % actualSlides.length;
      actualSlides[currentSlide].classList.add('active');
      dots[currentSlide]?.classList.add('active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);

    const resetTimer = () => {
      clearInterval(slideshowTimer);
      slideshowTimer = setInterval(nextSlide, 3800);
    };

    resetTimer();

    // Pause on hover
    const slideshowEl = document.getElementById('menu-slideshow');
    if (slideshowEl) {
      slideshowEl.addEventListener('mouseenter', () => clearInterval(slideshowTimer));
      slideshowEl.addEventListener('mouseleave', resetTimer);
    }
  }

  // ─── 6. Smooth Scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── 7. Active nav highlight on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--gold)' : '';
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ─── 8. Gallery image lazy-load fade ───
  const galleryItems = document.querySelectorAll('.gallery-item img');
  galleryItems.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });

});
