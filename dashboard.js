/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — User Dashboard Logic
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── Elements ──
  const themeToggle = $('#theme-toggle');
  const logoutBtn   = $('#logout-btn');
  const userDisplay = $('#user-display-name');

  // ═══════════════════════════════════════════════
  //  THEME TOGGLE
  // ═══════════════════════════════════════════════
  function getStoredTheme() {
    return localStorage.getItem('tipped-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tipped-theme', theme);

    if (!themeToggle) return;
    const sunIcon  = themeToggle.querySelector('.theme-toggle__icon--sun');
    const moonIcon = themeToggle.querySelector('.theme-toggle__icon--moon');

    if (theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  // Apply immediately on load
  applyTheme(getStoredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ═══════════════════════════════════════════════
  //  SESSION & USER DATA
  // ═══════════════════════════════════════════════
  const sessionUser = sessionStorage.getItem('tipped_user_name');
  if (sessionUser && userDisplay) {
    userDisplay.textContent = sessionUser;
    const bannerTitle = $('.dash-banner__title');
    if (bannerTitle) {
      bannerTitle.textContent = `Welcome back, ${sessionUser.split(' ')[0]}!`;
    }
  }

  // ═══════════════════════════════════════════════
  //  LOGOUT ACTION
  // ═══════════════════════════════════════════════
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('tipped_user_name');
      sessionStorage.removeItem('tipped_user_role');
      sessionStorage.removeItem('tipped_user_email');
      // Redirect to login page
      window.location.href = '/login';
    });
  }

  // ═══════════════════════════════════════════════
  //  ANIMATE COUNTERS
  // ═══════════════════════════════════════════════
  function animateValue(el, target, duration) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  animateValue($('#count-pending'), 2, 700);
  animateValue($('#count-progress'), 1, 900);
  animateValue($('#count-resolved'), 5, 1100);

})();

