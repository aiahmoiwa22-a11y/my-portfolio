
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. PRELOADER
     ========================================================== */
  const preloader = document.getElementById('preloader');

  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    window.setTimeout(() => preloader.remove(), 700);
  };


  window.addEventListener('load', () => {
    window.setTimeout(hidePreloader, 400);
  });
  window.setTimeout(hidePreloader, 4000);


  /* ==========================================================
     2. STICKY NAVIGATION + NAVBAR BACKGROUND ON SCROLL
     ========================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const SCROLL_THRESHOLD = 40;

  const updateHeaderState = () => {
    if (!siteHeader) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });


  /* ==========================================================
     3. MOBILE MENU TOGGLE
     ========================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !mobileMenu) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    if (!hamburgerBtn || !mobileMenu) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close the mobile menu whenever a nav link is tapped
    mobileMenu.querySelectorAll('[data-nav-mobile]').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }


  /* ==========================================================
     4. SMOOTH SCROLLING (anchor links)
     ========================================================== */
  const headerHeight = () => siteHeader ? siteHeader.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() + 1;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Update the URL hash without jumping
      window.history.pushState(null, '', targetId);
    });
  });



  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(document.querySelectorAll('main .section[id]'));

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        // Treat the section as "active" once it occupies the
        // vertical center band of the viewport.
        rootMargin: `-${headerHeight() + 20}px 0px -55% 0px`,
        threshold: 0
      }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }


  /* ==========================================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================================== */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-reveal-delay'), 10) || 0;

          window.setTimeout(() => {
            el.classList.add('in-view');
          }, delay);

          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately if unsupported
    revealEls.forEach((el) => el.classList.add('in-view'));
  }


  /* ==========================================================
     7. TYPING ANIMATION (hero headline)
     ========================================================== */
  const typedTarget = document.getElementById('typedTarget');

  const typedPhrases = [
    'SOLUTIONS',
    'FAST',
    'EXPERIENCE',
    'CREATIVITY'
  ];

  const runTypingAnimation = (el, phrases) => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 70;
    const DELETE_SPEED = 40;
    const HOLD_DELAY = 1200;
    const SWAP_DELAY = 300;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }

      el.textContent = currentPhrase.substring(0, charIndex);

      let nextDelay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        nextDelay = HOLD_DELAY;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        nextDelay = SWAP_DELAY;
      }

      window.setTimeout(tick, nextDelay);
    };

    tick();
  };

  if (typedTarget) {
    runTypingAnimation(typedTarget, typedPhrases);
  }


  /* ==========================================================
     8. ANIMATED COUNTERS
     ========================================================== */
  const counterEls = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counterEls.forEach((el) => counterObserver.observe(el));
  } else {
    counterEls.forEach((el) => {
      el.textContent = el.getAttribute('data-target') || '0';
    });
  }


  /* ==========================================================
     9. SKILLS PROGRESS BAR ANIMATION
     ========================================================== */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  if (skillBars.length && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  } else {
    skillBars.forEach((bar) => bar.classList.add('in-view'));
  }


  /* ==========================================================
     10. PROJECT FILTERING
     ========================================================== */
  const projectFilterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  const filterProjects = (filter) => {
    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  };

  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      filterProjects(btn.getAttribute('data-filter'));
    });
  });


  /* ==========================================================
     11. VIEW MORE PROJECTS (demo interaction)
     ========================================================== */
  const viewMoreBtn = document.getElementById('viewMoreProjectsBtn');

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      viewMoreBtn.innerHTML = '<span>All Projects Loaded</span><i class="fa-solid fa-check"></i>';
      viewMoreBtn.disabled = true;
      viewMoreBtn.style.opacity = '0.7';
      viewMoreBtn.style.pointerEvents = 'none';
    });
  }


  /* ==========================================================
     12. PHOTOGRAPHY GALLERY FILTERING
     ========================================================== */
  const photoFilterButtons = document.querySelectorAll('[data-photo-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const filterGallery = (filter) => {
    galleryItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      item.classList.toggle('is-hidden', !shouldShow);
    });
  };

  photoFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      photoFilterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      filterGallery(btn.getAttribute('data-photo-filter'));
    });
  });


  /* ==========================================================
     13. GALLERY LIGHTBOX
     ========================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let visibleGalleryImages = [];
  let currentLightboxIndex = 0;

  const getVisibleGalleryItems = () =>
    Array.from(galleryItems).filter((item) => !item.classList.contains('is-hidden'));

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg) return;
    visibleGalleryImages = getVisibleGalleryItems();
    if (!visibleGalleryImages.length) return;

    currentLightboxIndex = index;
    const img = visibleGalleryImages[currentLightboxIndex].querySelector('img');
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showLightboxImage = (direction) => {
    if (!visibleGalleryImages.length) return;
    currentLightboxIndex =
      (currentLightboxIndex + direction + visibleGalleryImages.length) % visibleGalleryImages.length;
    const img = visibleGalleryImages[currentLightboxIndex].querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visible = getVisibleGalleryItems();
      const visibleIndex = visible.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(1));

  if (lightbox) {
    // Close when clicking the dark backdrop (outside the image/controls)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(-1);
    if (e.key === 'ArrowRight') showLightboxImage(1);
  });


  /* ==========================================================
     14. CONTACT FORM VALIDATION
     ========================================================== */
  const contactForm = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showFieldError = (field, message) => {
    field.style.borderColor = 'var(--color-pink)';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('title', message);
  };

  const clearFieldError = (field) => {
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
    field.removeAttribute('title');
  };

  const validateContactForm = (form) => {
    let isValid = true;

    const name = form.querySelector('#cfName');
    const email = form.querySelector('#cfEmail');
    const subject = form.querySelector('#cfSubject');
    const message = form.querySelector('#cfMessage');

    [name, email, subject, message].forEach((field) => clearFieldError(field));

    if (!name.value.trim() || name.value.trim().length < 2) {
      showFieldError(name, 'Please enter your full name.');
      isValid = false;
    }

    if (!email.value.trim() || !EMAIL_PATTERN.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subject.value.trim() || subject.value.trim().length < 3) {
      showFieldError(subject, 'Please enter a subject.');
      isValid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showFieldError(message, 'Your message should be at least 10 characters.');
      isValid = false;
    }

    return isValid;
  };

  if (contactForm) {
    // Clear individual field errors as the user types
    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => clearFieldError(field));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactFormStatus) return;

      if (!validateContactForm(contactForm)) {
        contactFormStatus.textContent = 'Please fix the highlighted fields and try again.';
        contactFormStatus.classList.remove('is-success');
        contactFormStatus.classList.add('is-error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
      }

      // Simulate an async send (no backend wired up yet)
      window.setTimeout(() => {
        contactFormStatus.textContent = "Message sent! I'll get back to you soon.";
        contactFormStatus.classList.remove('is-error');
        contactFormStatus.classList.add('is-success');

        contactForm.reset();

        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }

        window.setTimeout(() => {
          contactFormStatus.textContent = '';
          contactFormStatus.classList.remove('is-success');
        }, 5000);
      }, 1100);
    });
  }


  /* ==========================================================
     15. BACK-TO-TOP BUTTON
     ========================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  const BACK_TO_TOP_THRESHOLD = 480;

  const updateBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle('is-visible', window.scrollY > BACK_TO_TOP_THRESHOLD);
  };

  updateBackToTopVisibility();
  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ==========================================================
     16. RIPPLE BUTTON EFFECT
     ========================================================== */
  const rippleTargets = document.querySelectorAll('.btn, .filter-btn');

  const createRipple = (e, target) => {
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

    ripple.style.position = 'absolute';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.35)';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '0.6';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';

    target.appendChild(ripple);

    // Trigger the animation on the next frame
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(2.2)';
      ripple.style.opacity = '0';
    });

    window.setTimeout(() => ripple.remove(), 650);
  };

  rippleTargets.forEach((target) => {
    // Ensure ripple is contained and positioned correctly
    const computedPosition = window.getComputedStyle(target).position;
    if (computedPosition === 'static') {
      target.style.position = 'relative';
    }
    target.style.overflow = target.style.overflow || 'hidden';

    target.addEventListener('click', (e) => createRipple(e, target));
  });


  /* ==========================================================
     17. LAZY LOADING SUPPORT (fallback for older browsers)
     ========================================================== */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported — nothing further to do.
    lazyImages.forEach((img) => img.classList.add('is-loaded'));
  } else if ('IntersectionObserver' in window) {
    // Fallback: manually swap in the image src when it nears the viewport.
    const lazyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('is-loaded');
          observer.unobserve(img);
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach((img) => lazyObserver.observe(img));
  }


  /* ==========================================================
     18. UPLOAD INPUT FEEDBACK (Skills / Modeling upload banners)
     ========================================================== */
  const uploadInputs = document.querySelectorAll('[data-upload-input]');

  uploadInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const label = input.previousElementSibling;
      if (!label) return;

      const fileCount = input.files ? input.files.length : 0;
      const span = label.querySelector('span');
      if (span) {
        span.textContent = fileCount > 0 ? `${fileCount} Photo${fileCount > 1 ? 's' : ''} Selected` : 'Upload Photos';
      }
    });
  });


  /* ==========================================================
     19. FOOTER YEAR
     ========================================================== */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});