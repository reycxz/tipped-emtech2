/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Authentication & Bento Grid Logic
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Constants ──
  const TIP_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/;

  // ── State ──
  let currentRole = 'user';
  let currentMode = 'signin';

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── DOM References ──
  const roleUserBtn  = $('#role-user-btn');
  const roleAdminBtn = $('#role-admin-btn');
  const modeSigninBtn = $('#mode-signin-btn');
  const modeSignupBtn = $('#mode-signup-btn');
  const signinForm = $('#signin-form');
  const signupForm = $('#signup-form');
  const signinEmail     = $('#signin-email');
  const signinEmailIcon = $('#signin-email-icon');
  const signinEmailErr  = $('#signin-email-error');
  const signinPassword  = $('#signin-password');
  const signinTogglePw  = $('#signin-toggle-pw');
  const signupEmail     = $('#signup-email');
  const signupEmailIcon = $('#signup-email-icon');
  const signupEmailErr  = $('#signup-email-error');
  const signupPassword  = $('#signup-password');
  const signupTogglePw  = $('#signup-toggle-pw');
  const signupConfirmPassword = $('#signup-confirm-password');
  const signupToggleConfirmPw = $('#signup-toggle-confirm-pw');
  const signupConfirmPwErr    = $('#signup-confirm-password-error');
  const strengthMeter   = $('#password-strength');
  const strengthBar     = $('#strength-bar');
  const strengthLabel   = $('#strength-label');
  const footerToggleLink = $('#footer-toggle-link');
  const themeToggle      = $('#theme-toggle');

  // ═══════════════════════════════════════════════
  //  THEME TOGGLE (Dark ↔ Light)
  // ═══════════════════════════════════════════════
  function getStoredTheme() {
    return localStorage.getItem('tipped-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tipped-theme', theme);

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

  // Init theme
  applyTheme(getStoredTheme());

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ═══════════════════════════════════════════════
  //  ROLE TOGGLE
  // ═══════════════════════════════════════════════
  function setRole(role) {
    currentRole = role;
    [roleUserBtn, roleAdminBtn].forEach((btn) => {
      const isActive = btn.dataset.role === role;
      btn.classList.toggle('role-toggle__tab--active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });
  }

  roleUserBtn.addEventListener('click', () => setRole('user'));
  roleAdminBtn.addEventListener('click', () => setRole('admin'));

  // ═══════════════════════════════════════════════
  //  MODE TOGGLE (Sign In ↔ Sign Up)
  // ═══════════════════════════════════════════════
  function setMode(mode) {
    currentMode = mode;

    [modeSigninBtn, modeSignupBtn].forEach((btn) => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('mode-toggle__tab--active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    signinForm.classList.toggle('auth-form--hidden', mode !== 'signin');
    signupForm.classList.toggle('auth-form--hidden', mode !== 'signup');

    // Re-trigger entrance animation
    const activeForm = mode === 'signin' ? signinForm : signupForm;
    activeForm.style.animation = 'none';
    void activeForm.offsetHeight;
    activeForm.style.animation = '';

    // Footer text
    if (footerToggleLink) {
      if (mode === 'signin') {
        footerToggleLink.textContent = "Don't have an account?";
      } else {
        footerToggleLink.textContent = "Already have an account?";
      }
    }

    const newPath = mode === 'signin' ? '/login' : '/register';
    history.replaceState(null, '', newPath);
  }

  modeSigninBtn.addEventListener('click', () => setMode('signin'));
  modeSignupBtn.addEventListener('click', () => setMode('signup'));
  if (footerToggleLink) {
    footerToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      setMode(currentMode === 'signin' ? 'signup' : 'signin');
    });
  }

  // ═══════════════════════════════════════════════
  //  EMAIL VALIDATION
  // ═══════════════════════════════════════════════
  function validateEmail(input, icon, error) {
    const val = input.value.trim();
    if (val === '') {
      input.classList.remove('form-input--valid', 'form-input--error');
      icon.classList.add('input-icon--hidden');
      icon.classList.remove('input-icon--valid');
      error.classList.add('form-error--hidden');
      return;
    }
    if (TIP_EMAIL_REGEX.test(val)) {
      input.classList.add('form-input--valid');
      input.classList.remove('form-input--error');
      icon.classList.remove('input-icon--hidden');
      icon.classList.add('input-icon--valid');
      error.classList.add('form-error--hidden');
    } else {
      input.classList.add('form-input--error');
      input.classList.remove('form-input--valid');
      icon.classList.add('input-icon--hidden');
      icon.classList.remove('input-icon--valid');
      error.classList.remove('form-error--hidden');
    }
  }

  signinEmail.addEventListener('input', () => validateEmail(signinEmail, signinEmailIcon, signinEmailErr));
  signinEmail.addEventListener('blur',  () => validateEmail(signinEmail, signinEmailIcon, signinEmailErr));
  signupEmail.addEventListener('input', () => validateEmail(signupEmail, signupEmailIcon, signupEmailErr));
  signupEmail.addEventListener('blur',  () => validateEmail(signupEmail, signupEmailIcon, signupEmailErr));

  // ═══════════════════════════════════════════════
  //  PASSWORD VISIBILITY TOGGLE
  // ═══════════════════════════════════════════════
  function bindPasswordToggle(toggleBtn, passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      const eyeOpen = toggleBtn.querySelector('.icon-eye');
      const eyeOff  = toggleBtn.querySelector('.icon-eye-off');
      eyeOpen.classList.toggle('hidden', isHidden);
      eyeOff.classList.toggle('hidden', !isHidden);
    });
  }

  bindPasswordToggle(signinTogglePw, signinPassword);
  bindPasswordToggle(signupTogglePw, signupPassword);
  if (signupToggleConfirmPw && signupConfirmPassword) {
    bindPasswordToggle(signupToggleConfirmPw, signupConfirmPassword);
  }

  // ═══════════════════════════════════════════════
  //  CONFIRM PASSWORD VALIDATION
  // ═══════════════════════════════════════════════
  function validateConfirmPassword() {
    if (!signupConfirmPassword) return true;
    const pw = signupPassword ? signupPassword.value : '';
    const confirm = signupConfirmPassword.value;

    if (confirm === '') {
      signupConfirmPassword.classList.remove('form-input--valid', 'form-input--error');
      if (signupConfirmPwErr) signupConfirmPwErr.classList.add('form-error--hidden');
      return false;
    }

    if (pw === confirm) {
      signupConfirmPassword.classList.add('form-input--valid');
      signupConfirmPassword.classList.remove('form-input--error');
      if (signupConfirmPwErr) signupConfirmPwErr.classList.add('form-error--hidden');
      return true;
    } else {
      signupConfirmPassword.classList.add('form-input--error');
      signupConfirmPassword.classList.remove('form-input--valid');
      if (signupConfirmPwErr) signupConfirmPwErr.classList.remove('form-error--hidden');
      return false;
    }
  }

  if (signupConfirmPassword) {
    signupConfirmPassword.addEventListener('input', validateConfirmPassword);
    signupConfirmPassword.addEventListener('blur', validateConfirmPassword);
  }

  // ═══════════════════════════════════════════════
  //  PASSWORD STRENGTH METER
  // ═══════════════════════════════════════════════
  function evaluateStrength(pw) {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 'weak',   label: 'Weak' };
    if (score === 2) return { level: 'fair',   label: 'Fair' };
    if (score === 3) return { level: 'good',   label: 'Good' };
    return { level: 'strong', label: 'Strong' };
  }

  signupPassword.addEventListener('input', () => {
    const val = signupPassword.value;
    if (val.length === 0) {
      strengthMeter.classList.add('strength-meter--hidden');
    } else {
      strengthMeter.classList.remove('strength-meter--hidden');
      const { level, label } = evaluateStrength(val);
      strengthBar.setAttribute('data-level', level);
      strengthLabel.setAttribute('data-level', level);
      strengthLabel.textContent = label;
    }
    if (signupConfirmPassword && signupConfirmPassword.value) {
      validateConfirmPassword();
    }
  });

  // ═══════════════════════════════════════════════
  //  FORM SUBMISSIONS
  // ═══════════════════════════════════════════════
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateEmail(signinEmail, signinEmailIcon, signinEmailErr);
    if (!TIP_EMAIL_REGEX.test(signinEmail.value.trim())) { signinEmail.focus(); return; }
    if (signinPassword.value.length === 0) { signinPassword.focus(); return; }

    const btn = $('#signin-submit');
    btn.textContent = 'SIGNING IN…';
    btn.disabled = true;
    btn.style.opacity = '.7';

    setTimeout(() => {
      btn.textContent = 'SIGN IN';
      btn.disabled = false;
      btn.style.opacity = '';
      
      const emailVal = signinEmail.value.trim();
      const extractedName = emailVal.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'John Doe';
      sessionStorage.setItem('tipped_user_name', extractedName);
      sessionStorage.setItem('tipped_user_role', currentRole.toUpperCase());
      sessionStorage.setItem('tipped_user_email', emailVal);

      if (currentRole === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }, 700);
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateEmail(signupEmail, signupEmailIcon, signupEmailErr);
    if (!TIP_EMAIL_REGEX.test(signupEmail.value.trim())) { signupEmail.focus(); return; }
    if (signupPassword.value.length < 8) { signupPassword.focus(); return; }
    if (signupConfirmPassword && !validateConfirmPassword()) {
      signupConfirmPassword.focus();
      return;
    }

    const btn = $('#signup-submit');
    btn.textContent = 'CREATING ACCOUNT…';
    btn.disabled = true;
    btn.style.opacity = '.7';

    setTimeout(() => {
      btn.textContent = 'CREATE ACCOUNT';
      btn.disabled = false;
      btn.style.opacity = '';

      const nameVal = $('#signup-name').value.trim() || 'John Doe';
      sessionStorage.setItem('tipped_user_name', nameVal);
      sessionStorage.setItem('tipped_user_role', 'USER');
      sessionStorage.setItem('tipped_user_email', signupEmail.value.trim());

      window.location.href = '/dashboard';
    }, 700);
  });

  // ═══════════════════════════════════════════════
  //  FORGOT PASSWORD
  // ═══════════════════════════════════════════════
  $('#forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Enter your @tip.edu.ph email to reset your password:');
    if (email && TIP_EMAIL_REGEX.test(email)) {
      alert(`A password reset link has been sent to ${email}`);
    } else if (email) {
      alert('Please enter a valid @tip.edu.ph email address.');
    }
  });

  // ═══════════════════════════════════════════════
  //  NEED HELP / SUPPORT MODAL
  // ═══════════════════════════════════════════════
  const needHelpLink = $('#need-help-link');
  const helpModalBackdrop = $('#help-modal-backdrop');
  const helpModalClose = $('#help-modal-close');
  const helpForm = $('#help-form');
  const helpSuccessMsg = $('#help-success-msg');

  function openHelpModal() {
    if (helpModalBackdrop) {
      helpModalBackdrop.classList.remove('help-modal-backdrop--hidden');
      if (helpSuccessMsg) helpSuccessMsg.classList.add('hidden');
      const nameInput = $('#help-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 60);
    }
  }

  function closeHelpModal() {
    if (helpModalBackdrop) {
      helpModalBackdrop.classList.add('help-modal-backdrop--hidden');
    }
  }

  if (needHelpLink) {
    needHelpLink.addEventListener('click', (e) => {
      e.preventDefault();
      openHelpModal();
    });
  }

  if (helpModalClose) {
    helpModalClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeHelpModal();
    });
  }

  if (helpModalBackdrop) {
    helpModalBackdrop.addEventListener('click', (e) => {
      if (e.target === helpModalBackdrop) {
        closeHelpModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModalBackdrop && !helpModalBackdrop.classList.contains('help-modal-backdrop--hidden')) {
      closeHelpModal();
    }
  });

  if (helpForm) {
    helpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#help-name').value.trim();
      const email = $('#help-email').value.trim();
      const issue = $('#help-issue').value;

      if (!name || !email || !issue) {
        return;
      }

      if (helpSuccessMsg) {
        helpSuccessMsg.classList.remove('hidden');
      }

      const submitBtn = $('#help-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTED';
      }

      setTimeout(() => {
        helpForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'SUBMIT';
        }
        if (helpSuccessMsg) {
          helpSuccessMsg.classList.add('hidden');
        }
        closeHelpModal();
      }, 1600);
    });
  }

  // ═══════════════════════════════════════════════
  //  ANIMATED METRIC COUNTERS
  // ═══════════════════════════════════════════════
  function animateCounter(el, target, suffix, duration) {
    const isFloat = String(target).includes('.');
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (isFloat) {
        el.innerHTML = current.toFixed(1) + (suffix ? `<small>${suffix}</small>` : '');
      } else {
        el.innerHTML = Math.round(current) + (suffix ? `<small>${suffix}</small>` : '');
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════════
  //  DYNAMIC REAL-TIME INCIDENT LEADERBOARD
  // ═══════════════════════════════════════════════
  function getIncidentLeaderboardData() {
    let reports = [];
    try {
      reports = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
    } catch (e) {
      console.warn('Storage read error', e);
    }

    const baselineSeed = [
      { category: 'Water & Sanitation' },
      { category: 'Water & Sanitation' },
      { category: 'Water & Sanitation' },
      { category: 'Water & Sanitation' },
      { category: 'Water & Sanitation' },
      { category: 'Water & Sanitation' },
      { category: 'HVAC & Cooling' },
      { category: 'HVAC & Cooling' },
      { category: 'HVAC & Cooling' },
      { category: 'HVAC & Cooling' },
      { category: 'Electrical & Power' },
      { category: 'Electrical & Power' },
      { category: 'Digital & IT' }
    ];

    const allReports = reports.length > 0 ? [...reports, ...baselineSeed] : baselineSeed;

    const categoryLabels = {
      'Water & Sanitation': 'Trash & Restroom Sanitation',
      'HVAC & Cooling': 'Air Conditioning Malfunction',
      'Electrical & Power': 'Power Outages & Sparking Sockets',
      'Digital & IT': 'Lab Network & Workstations',
      'Furniture & Fixtures': 'Desks, Chairs & Fixtures',
      'Life Safety & Hazards': 'Campus Safety & Slip Hazards',
      'Faculty / Academic': 'Classroom Facilities',
      'General Concern / Other': 'General Facilities Concern'
    };

    const counts = {};
    allReports.forEach((r) => {
      const cat = r.category || 'General Concern / Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([cat, count]) => ({
        category: cat,
        name: categoryLabels[cat] || cat,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }

  function renderLeaderboard() {
    const list = $('#leaderboard-list');
    if (!list) return;

    const topIssues = getIncidentLeaderboardData();
    list.innerHTML = topIssues.map((item, idx) => {
      const rank = idx + 1;
      const rankClass = rank === 1 ? 'leaderboard-item__rank--gold' : '';
      return `
        <li class="leaderboard-item">
          <span class="leaderboard-item__rank ${rankClass}">${rank}</span>
          <span class="leaderboard-item__name">${item.name}</span>
          <span class="leaderboard-item__count">${item.count}</span>
        </li>
      `;
    }).join('');
  }

  renderLeaderboard();

  // Run counter animations when leaderboard cell is visible
  const leaderboardCell = $('#bento-leaderboard');
  if (leaderboardCell) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counts = $$('.leaderboard-item__count');
          counts.forEach((el) => {
            const val = parseInt(el.textContent, 10);
            if (!isNaN(val)) {
              animateCounter(el, val, '', 800);
            }
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(leaderboardCell);
  }

  // ═══════════════════════════════════════════════
  //  STAGGERED BENTO CELL ENTRANCE
  // ═══════════════════════════════════════════════
  const bentoCells = $$('.bento-cell');
  bentoCells.forEach((cell, i) => {
    cell.style.opacity = '0';
    cell.style.transform = 'translateY(16px)';
    cell.style.transition = `opacity .5s var(--ease-out) ${i * .08}s, transform .5s var(--ease-out) ${i * .08}s, box-shadow .3s var(--ease-out), background .4s var(--ease-out), border-color .4s var(--ease-out)`;

    requestAnimationFrame(() => {
      cell.style.opacity = '1';
      cell.style.transform = 'translateY(0)';
    });
  });

  // ═══════════════════════════════════════════════
  //  INITIAL ROUTE CHECK
  // ═══════════════════════════════════════════════
  const path = window.location.pathname;
  if (path === '/register') {
    setMode('signup');
  }

})();
