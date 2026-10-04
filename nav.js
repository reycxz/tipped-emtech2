/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Global Responsive Navigation & Mobile Drawer
   File: /nav.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ═══════════════════════════════════════════════
  //  1. THEME SYNCHRONIZATION
  // ═══════════════════════════════════════════════
  function getStoredTheme() {
    return localStorage.getItem('tipped-theme') || 'dark';
  }

  function applyGlobalTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tipped-theme', theme);

    // Update Header Theme Toggle Icons
    const desktopToggle = $('#theme-toggle');
    if (desktopToggle) {
      const sun = desktopToggle.querySelector('.theme-toggle__icon--sun');
      const moon = desktopToggle.querySelector('.theme-toggle__icon--moon');
      if (theme === 'dark') {
        if (sun) sun.classList.remove('hidden');
        if (moon) moon.classList.add('hidden');
      } else {
        if (sun) sun.classList.add('hidden');
        if (moon) moon.classList.remove('hidden');
      }
    }

    // Update Profile Dropdown Theme Text & Icons
    const dropdownThemeText = $('#dropdown-theme-text');
    const dropdownThemeSun = $('.dropdown-theme-sun');
    const dropdownThemeMoon = $('.dropdown-theme-moon');
    if (dropdownThemeText) {
      dropdownThemeText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
    if (dropdownThemeSun && dropdownThemeMoon) {
      if (theme === 'dark') {
        dropdownThemeSun.classList.remove('hidden');
        dropdownThemeMoon.classList.add('hidden');
      } else {
        dropdownThemeSun.classList.add('hidden');
        dropdownThemeMoon.classList.remove('hidden');
      }
    }

    // Update Mobile Drawer Theme Toggle Row
    const drawerToggle = $('#mobile-drawer-theme-toggle');
    const drawerThemeText = $('#mobile-theme-mode-text');
    if (drawerToggle) {
      if (theme === 'dark') {
        drawerToggle.classList.add('mobile-theme-toggle-btn--active');
        if (drawerThemeText) drawerThemeText.textContent = 'Dark Mode Active';
      } else {
        drawerToggle.classList.remove('mobile-theme-toggle-btn--active');
        if (drawerThemeText) drawerThemeText.textContent = 'Light Mode Active';
      }
    }
  }

  // Apply on immediate execution
  applyGlobalTheme(getStoredTheme());

  // ═══════════════════════════════════════════════
  //  2. SESSION USER DISPLAY & GREETINGS
  // ═══════════════════════════════════════════════
  function syncUserInfo() {
    const isAdminPage = window.location.pathname.includes('/admin');
    let rawName = sessionStorage.getItem('tipped_user_name');
    let rawRole = sessionStorage.getItem('tipped_user_role');

    if (!rawName) {
      rawName = isAdminPage ? 'Facilities Admin' : 'John Doe';
    }
    if (!rawRole) {
      rawRole = isAdminPage ? 'ADMIN' : 'USER';
    }

    // Calculate User Initials
    const parts = rawName.trim().split(/\s+/);
    const initials = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0][0] || (isAdminPage ? 'AD' : 'JD')).toUpperCase();

    // 1. Desktop Profile Menu Button & Dropdown Header
    const headerAvatar = $('#header-avatar-initials');
    const dropdownAvatar = $('#dropdown-avatar-initials');
    const dropdownName = $('#dropdown-user-name');
    const dropdownRole = $('#dropdown-user-role');
    const userDisplay = $('#user-display-name');

    if (headerAvatar) headerAvatar.textContent = initials;
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (dropdownName) dropdownName.textContent = rawName;
    if (userDisplay) userDisplay.textContent = rawName;
    if (dropdownRole) {
      if (rawRole.toUpperCase().includes('ADMIN') || rawRole.toUpperCase().includes('STAFF') || isAdminPage) {
        dropdownRole.textContent = 'ADMIN';
        dropdownRole.style.background = 'rgba(239, 68, 68, 0.2)';
        dropdownRole.style.color = '#EF4444';
        dropdownRole.style.borderColor = 'rgba(239, 68, 68, 0.35)';
      } else {
        dropdownRole.textContent = 'USER';
      }
    }

    const firstName = rawName.trim().split(/\s+/)[0] || (isAdminPage ? 'Admin' : 'Student');

    // 2. Dynamic Hero Welcome Card Greeting (/dashboard)
    const bannerTitle = $('.dash-banner__title') || $('#dash-welcome-title');
    if (bannerTitle) {
      bannerTitle.textContent = `Welcome back, ${firstName}!`;
    }

    // 2b. Dynamic Admin Welcome Greeting (/admin)
    const adminGreetingFirstname = $('#admin-user-firstname');
    if (adminGreetingFirstname) {
      adminGreetingFirstname.textContent = firstName;
    }

    // 3. Mobile Drawer User Card
    const mobName = $('#mobile-user-name');
    const mobRole = $('#mobile-user-role');
    const mobAvatar = $('#mobile-avatar-text');

    if (mobName) mobName.textContent = rawName;
    if (mobRole) {
      if (rawRole.toUpperCase().includes('ADMIN') || rawRole.toUpperCase().includes('STAFF') || isAdminPage) {
        mobRole.textContent = 'Staff / Admin';
      } else {
        mobRole.textContent = 'Student / Faculty';
      }
    }
    if (mobAvatar) mobAvatar.textContent = initials;
  }

  // ═══════════════════════════════════════════════
  //  3. NAVBAR PROFILE MENU DROPDOWN CONTROLLER
  // ═══════════════════════════════════════════════
  function initProfileDropdown() {
    const container = $('#profile-dropdown-container');
    const avatarBtn = $('#profile-avatar-btn');
    const menu = $('#profile-dropdown-menu');
    const themeToggleBtn = $('#dropdown-theme-toggle');
    const logoutBtn = $('#dropdown-logout-btn');

    if (!container || !avatarBtn || !menu) return;

    function toggleMenu() {
      const isOpen = menu.classList.contains('profile-dropdown-menu--open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      menu.classList.add('profile-dropdown-menu--open');
      menu.setAttribute('aria-hidden', 'false');
      avatarBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('profile-dropdown-menu--open');
      menu.setAttribute('aria-hidden', 'true');
      avatarBtn.setAttribute('aria-expanded', 'false');
    }

    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    // Analytics modal trigger inside dropdown
    const metricsBtn = $('#dropdown-advanced-metrics-btn');
    if (metricsBtn) {
      metricsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        if (typeof window.openMetricsModal === 'function') {
          window.openMetricsModal();
        } else {
          const modal = document.getElementById('admin-metrics-modal');
          if (modal) {
            modal.classList.remove('admin-modal-backdrop--hidden');
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
          }
        }
      });
    }

    // Theme toggle action inside dropdown
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyGlobalTheme(next);
      });
    }

    // Logout action inside dropdown
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.clear();
        window.location.href = '/login';
      });
    }
  }

  // ═══════════════════════════════════════════════
  //  4. MOBILE SLIDE-OVER DRAWER CONTROLLER
  // ═══════════════════════════════════════════════
  function initMobileNav() {
    const menuBtn = $('#mobile-menu-btn');
    const drawer = $('#mobile-drawer');
    const backdrop = $('#mobile-drawer-backdrop');
    const closeBtn = $('#mobile-drawer-close');
    const bnavMenu = $('#bnav-menu');
    const drawerThemeToggle = $('#mobile-drawer-theme-toggle');
    const drawerLogout = $('#mobile-drawer-logout');
    const alertsBtn = $('#mob-link-alerts');

    function openDrawer() {
      if (drawer) {
        drawer.classList.add('mobile-drawer--open');
        drawer.setAttribute('aria-hidden', 'false');
      }
      if (backdrop) {
        backdrop.classList.add('mobile-drawer-backdrop--open');
        backdrop.setAttribute('aria-hidden', 'false');
      }
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (drawer) {
        drawer.classList.remove('mobile-drawer--open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (backdrop) {
        backdrop.classList.remove('mobile-drawer-backdrop--open');
        backdrop.setAttribute('aria-hidden', 'true');
      }
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    }

    if (bnavMenu) {
      bnavMenu.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('mobile-drawer--open')) {
        closeDrawer();
      }
    });

    // Mobile Drawer Theme Toggle Row
    if (drawerThemeToggle) {
      drawerThemeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyGlobalTheme(next);
      });
    }

    // Drawer Logout
    if (drawerLogout) {
      drawerLogout.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = '/login';
      });
    }

    // Alerts Interactive Item
    if (alertsBtn) {
      alertsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        alert('🔔 Notifications: Campus facilities operations are fully online. All systems operational.');
      });
    }

    // Highlight Active Link in Mobile Drawer
    highlightActiveLinks();
  }

  // ═══════════════════════════════════════════════
  //  4. FLOATING CAMERA ACTION BUTTON (FAB) FLOW
  // ═══════════════════════════════════════════════
  function initCameraFab() {
    const fabBtn = $('#camera-fab-btn');
    const fabInput = $('#camera-fab-input');

    if (!fabBtn || !fabInput) return;

    fabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fabInput.click();
    });

    fabInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // 1. Image only validation
      const invalidFiles = files.filter((f) => !f.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        alert('Only image files are supported. Video formats are blocked.');
      }

      const validImages = files.filter((f) => f.type.startsWith('image/'));
      if (validImages.length === 0) return;

      // 2. Max 5 photos validation
      let filesToLoad = validImages;
      if (validImages.length > 5) {
        alert('Maximum 5 photos allowed per incident report. Attaching the first 5 photos.');
        filesToLoad = validImages.slice(0, 5);
      }

      // 3. Load photos into Data URLs
      const photoPromises = filesToLoad.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            resolve({
              id: Date.now() + Math.random().toString(36).substr(2, 9),
              dataUrl: ev.target.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(photoPromises).then((loadedPhotos) => {
        try {
          sessionStorage.setItem('tipped_pending_photos', JSON.stringify(loadedPhotos));
        } catch (err) {
          console.warn('Session storage write error:', err);
        }

        // 4. Auto-redirect to /report/new
        window.location.href = '/report/new';
      });
    });
  }

  function highlightActiveLinks() {
    const path = window.location.pathname.toLowerCase();

    // Map of routes to element IDs
    const navMap = [
      { prefix: '/dashboard', mobLink: '#mob-link-dashboard' },
      { prefix: '/my-reports', mobLink: '#mob-link-reports' },
      { prefix: '/report/new', mobLink: '#mob-link-submit' },
      { prefix: '/admin', mobLink: '#mob-link-admin' }
    ];

    navMap.forEach((item) => {
      const isMatch = path.startsWith(item.prefix) || (item.prefix === '/dashboard' && (path === '/' || path === '/index.html'));
      const mobEl = $(item.mobLink);

      if (mobEl) {
        if (isMatch) mobEl.classList.add('mobile-nav-link--active');
        else mobEl.classList.remove('mobile-nav-link--active');
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  INIT ON DOM LOAD
  // ═══════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      syncUserInfo();
      initProfileDropdown();
      initMobileNav();
      initCameraFab();
    });
  } else {
    syncUserInfo();
    initProfileDropdown();
    initMobileNav();
    initCameraFab();
  }

})();

