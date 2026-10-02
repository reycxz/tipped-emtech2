/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Authentication Logic
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Constants ──
  const TIP_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@tip\.edu\.ph$/;

  // ── State ──
  let currentRole = 'user';   // 'user' | 'admin'
  let currentMode = 'signin'; // 'signin' | 'signup'

  // ── DOM References ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Role toggle
  const roleUserBtn  = $('#role-user-btn');
  const roleAdminBtn = $('#role-admin-btn');

  // Mode toggle
  const modeSigninBtn = $('#mode-signin-btn');
  const modeSignupBtn = $('#mode-signup-btn');
  const modeToggle    = $('#mode-toggle');

  // Forms
  const signinForm = $('#signin-form');
  const signupForm = $('#signup-form');

  // Sign-in fields
  const signinEmail     = $('#signin-email');
  const signinEmailIcon = $('#signin-email-icon');
  const signinEmailErr  = $('#signin-email-error');
  const signinPassword  = $('#signin-password');
  const signinTogglePw  = $('#signin-toggle-pw');

  // Sign-up fields
  const signupEmail     = $('#signup-email');
  const signupEmailIcon = $('#signup-email-icon');
  const signupEmailErr  = $('#signup-email-error');
  const signupPassword  = $('#signup-password');
  const signupTogglePw  = $('#signup-toggle-pw');
  const strengthMeter   = $('#password-strength');
  const strengthBar     = $('#strength-bar');
  const strengthLabel   = $('#strength-label');

  // Footer
  const footerToggleText = $('#footer-toggle-text');
  const footerToggleLink = $('#footer-toggle-link');

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

    // Toggle tabs
    [modeSigninBtn, modeSignupBtn].forEach((btn) => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('mode-toggle__tab--active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Toggle forms
    signinForm.classList.toggle('auth-form--hidden', mode !== 'signin');
    signupForm.classList.toggle('auth-form--hidden', mode !== 'signup');

    // Re-trigger entrance animation
    const activeForm = mode === 'signin' ? signinForm : signupForm;
    activeForm.style.animation = 'none';
    // Force reflow
    void activeForm.offsetHeight;
    activeForm.style.animation = '';

    // Footer text
    if (mode === 'signin') {
      footerToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="footer-toggle-link" class="form-link form-link--bold">Sign Up</a>';
    } else {
      footerToggleText.innerHTML = 'Already have an account? <a href="#" id="footer-toggle-link" class="form-link form-link--bold">Sign In</a>';
    }

    // Re-bind footer link
    $('#footer-toggle-link').addEventListener('click', (e) => {
      e.preventDefault();
      setMode(currentMode === 'signin' ? 'signup' : 'signin');
    });

    // Update URL
    const newPath = mode === 'signin' ? '/login' : '/register';
    history.replaceState(null, '', newPath);
  }

  modeSigninBtn.addEventListener('click', () => setMode('signin'));
  modeSignupBtn.addEventListener('click', () => setMode('signup'));

  // Footer toggle link (initial bind)
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
      // Reset to neutral
      input.classList.remove('form-input--valid', 'form-input--error');
      icon.classList.add('input-icon--hidden');
      icon.classList.remove('input-icon--valid');
      error.classList.add('form-error--hidden');
      return;
    }

    if (TIP_EMAIL_REGEX.test(val)) {
      // Valid
      input.classList.add('form-input--valid');
      input.classList.remove('form-input--error');
      icon.classList.remove('input-icon--hidden');
      icon.classList.add('input-icon--valid');
      error.classList.add('form-error--hidden');
    } else {
      // Invalid
      input.classList.add('form-input--error');
      input.classList.remove('form-input--valid');
      icon.classList.add('input-icon--hidden');
      icon.classList.remove('input-icon--valid');
      error.classList.remove('form-error--hidden');
    }
  }

  signinEmail.addEventListener('input', () => validateEmail(signinEmail, signinEmailIcon, signinEmailErr));
  signinEmail.addEventListener('blur', () => validateEmail(signinEmail, signinEmailIcon, signinEmailErr));

  signupEmail.addEventListener('input', () => validateEmail(signupEmail, signupEmailIcon, signupEmailErr));
  signupEmail.addEventListener('blur', () => validateEmail(signupEmail, signupEmailIcon, signupEmailErr));

  // ═══════════════════════════════════════════════
  //  PASSWORD VISIBILITY TOGGLE
  // ═══════════════════════════════════════════════
  function bindPasswordToggle(toggleBtn, passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';

      // Swap icons
      const eyeOpen = toggleBtn.querySelector('.icon-eye');
      const eyeOff  = toggleBtn.querySelector('.icon-eye-off');
      eyeOpen.classList.toggle('hidden', isHidden);
      eyeOff.classList.toggle('hidden', !isHidden);
    });
  }

  bindPasswordToggle(signinTogglePw, signinPassword);
  bindPasswordToggle(signupTogglePw, signupPassword);

  // ═══════════════════════════════════════════════
  //  PASSWORD STRENGTH METER (Sign Up)
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

    // Validate email one more time
    validateEmail(signinEmail, signinEmailIcon, signinEmailErr);
    if (!TIP_EMAIL_REGEX.test(signinEmail.value.trim())) {
      signinEmail.focus();
      return;
    }
    if (signinPassword.value.length === 0) {
      signinPassword.focus();
      return;
    }

    // Demo: show a brief loading state
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
    if (!TIP_EMAIL_REGEX.test(signupEmail.value.trim())) {
      signupEmail.focus();
      return;
    }
    if (signupPassword.value.length < 8) {
      signupPassword.focus();
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
      alert(`[Demo] Account Created\nName: ${$('#signup-name').value}\nEmail: ${signupEmail.value}\nDept: ${$('#signup-dept').value}`);
    }, 1200);
  });

  // ═══════════════════════════════════════════════
  //  FORGOT PASSWORD (placeholder modal)
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
  //  INITIAL ROUTE CHECK
  // ═══════════════════════════════════════════════
  const path = window.location.pathname;
  if (path === '/register') {
    setMode('signup');
  }

})();
