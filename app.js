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
  const strengthMeter   = $('#password-strength');
  const strengthBar     = $('#strength-bar');
  const strengthLabel   = $('#strength-label');
  const footerToggleText = $('#footer-toggle-text');
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
    if (mode === 'signin') {
      footerToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="footer-toggle-link" class="form-link form-link--bold">Sign Up</a>';
    } else {
      footerToggleText.innerHTML = 'Already have an account? <a href="#" id="footer-toggle-link" class="form-link form-link--bold">Sign In</a>';
    }

    $('#footer-toggle-link').addEventListener('click', (e) => {
      e.preventDefault();
      setMode(currentMode === 'signin' ? 'signup' : 'signin');
    });

    const newPath = mode === 'signin' ? '/login' : '/register';
    history.replaceState(null, '', newPath);
  }

  modeSigninBtn.addEventListener('click', () => setMode('signin'));
  modeSignupBtn.addEventListener('click', () => setMode('signup'));
  footerToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('signup');
  });

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
      return;
    }
    strengthMeter.classList.remove('strength-meter--hidden');
    const { level, label } = evaluateStrength(val);
    strengthBar.setAttribute('data-level', level);
    strengthLabel.setAttribute('data-level', level);
    strengthLabel.textContent = label;
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
      btn.textContent = 'SIGN IN TO TIPPED';
      btn.disabled = false;
      btn.style.opacity = '';
      alert(`[Demo] Sign In as ${currentRole}\nEmail: ${signinEmail.value}\nRemember: ${$('#remember-me').checked}`);
    }, 1200);
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateEmail(signupEmail, signupEmailIcon, signupEmailErr);
    if (!TIP_EMAIL_REGEX.test(signupEmail.value.trim())) { signupEmail.focus(); return; }
    if (signupPassword.value.length < 8) { signupPassword.focus(); return; }

    const btn = $('#signup-submit');
    btn.textContent = 'CREATING ACCOUNT…';
    btn.disabled = true;
    btn.style.opacity = '.7';

    setTimeout(() => {
      btn.textContent = 'CREATE ACCOUNT';
      btn.disabled = false;
      btn.style.opacity = '';
      alert(`[Demo] Account Created\nName: ${$('#signup-name').value}\nEmail: ${signupEmail.value}\nDept: ${$('#signup-dept').value}`);
    }, 1200);
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

  // Run counter animations when metrics cell is visible
  const metricsCell = $('#bento-metrics');
  if (metricsCell) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter($('#metric-active'), 0, '', 600);
          animateCounter($('#metric-resolved'), 24, '', 1000);
          animateCounter($('#metric-avg'), 2.4, 'min', 1200);
          animateCounter($('#metric-uptime'), 99.8, '%', 1400);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(metricsCell);
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
