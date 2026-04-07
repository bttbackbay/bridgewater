/**
 * BTT Bridgewater BJJ - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and form submission
 */

(function() {
  'use strict';

  // ===== Constants =====
  var SCROLL_THRESHOLD = 50;
  var NAV_OFFSET = 100;
  var OBSERVER_ROOT_MARGIN = '-100px 0px -70% 0px';

  // ===== Mobile Navigation =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');

      const expanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', expanded);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(event) {
      if (!event.target.closest('.nav') && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    hamburger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // ===== Form Submission (Netlify Forms) =====
  const contactForm = document.querySelector('.contact-form');
  const formSuccess = document.querySelector('.form-success');
  const formContainer = document.querySelector('.form-container');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      // Honeypot check
      const honeypot = contactForm.querySelector('input[name="bot-field"]');
      if (honeypot && honeypot.value) {
        if (formContainer) formContainer.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('active');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        if (response.ok) {
          if (formContainer) formContainer.style.display = 'none';
          if (formSuccess) {
            formSuccess.classList.add('active');
            formSuccess.setAttribute('role', 'alert');
          }
        } else {
          throw new Error('submission_failed');
        }
      })
      .catch(error => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        alert('Something went wrong sending your message. Please try again, or contact us directly by phone or email.');
        console.error('Form submission error:', error);
      });
    });
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      rootMargin: OBSERVER_ROOT_MARGIN,
      threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // ===== Scroll Header Enhancement =====
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    if (nav) {
      if (window.scrollY > SCROLL_THRESHOLD) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      const sectionEls = document.querySelectorAll('section[id]');
      let currentColor = 'var(--color-deep-blue)';

      sectionEls.forEach(section => {
        const sectionTop = section.offsetTop - NAV_OFFSET;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentColor = section.dataset.navColor || 'var(--color-deep-blue)';
        }
      });

      nav.style.backgroundColor = currentColor;
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

  // ===== Scroll Reveal =====
  var revealEls = document.querySelectorAll('.section-title, .card, .instructor-card, .pricing-card, .why-btt-feature, .why-btt-image, .contact-layout, .schedule-table-container');
  revealEls.forEach(function(el) { el.classList.add('reveal'); });

  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  revealEls.forEach(function(el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    revealObserver.observe(el);
  });

  document.addEventListener('contentRendered', function() {
    var dynamicEls = document.querySelectorAll('.card, .instructor-card, .pricing-card');
    dynamicEls.forEach(function(el, i) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
        revealObserver.observe(el);
      }
    });
  });

  // ===== Skip Link Enhancement =====
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

})();
