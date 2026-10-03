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
  const bannerTitle = $('.dash-banner__title') || $('#dash-welcome-title');
  if (bannerTitle) {
    if (sessionUser && sessionUser.trim()) {
      const firstName = sessionUser.trim().split(/\s+/)[0];
      bannerTitle.textContent = `Welcome back, ${firstName}!`;
    } else {
      bannerTitle.textContent = 'Welcome back, Student!';
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

  // ── Baseline Reports (Cleared for manual testing) ──
  const baselineReports = [];

  let userReports = [];
  try {
    userReports = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
  } catch (e) {
    console.warn('Storage read error', e);
  }

  const allReports = [...userReports];

  const pendingCount = allReports.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length;
  const progressCount = allReports.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = allReports.filter((r) => r.status === 'Resolved').length;

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

  animateValue($('#count-pending'), pendingCount, 700);
  animateValue($('#count-progress'), progressCount, 900);
  animateValue($('#count-resolved'), resolvedCount, 1100);

  // ═══════════════════════════════════════════════
  //  DYNAMIC RECENT ACTIVITY PREVIEW
  // ═══════════════════════════════════════════════
  const activityGrid = $('.activity-grid');
  if (activityGrid) {
    if (allReports.length === 0) {
      activityGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem 1rem; color: var(--color-slate-400); font-size: 0.875rem;">
          No incident tickets logged yet.
        </div>
      `;
    } else {
      const recent = allReports.slice(0, 4);
      activityGrid.innerHTML = recent.map((ticket) => {
        let statusClass = 'activity-card__status--pending';
        if (ticket.status === 'In Progress' || ticket.status === 'Under Review') {
          statusClass = 'activity-card__status--progress';
        } else if (ticket.status === 'Resolved') {
          statusClass = 'activity-card__status--resolved';
        }

        return `
          <div class="activity-card">
            <div class="activity-card__head">
              <span class="activity-card__id">${ticket.id}</span>
              <span class="activity-card__status ${statusClass}">${ticket.status}</span>
            </div>
            <span class="activity-card__location">${ticket.campus || 'Arlegui Campus'}</span>
            <div class="activity-card__foot">
              <span class="activity-card__category">${ticket.category || 'General'}</span>
              <span class="activity-card__time">${ticket.date ? ticket.date.split('•')[0].trim() : 'Recent'}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

})();

