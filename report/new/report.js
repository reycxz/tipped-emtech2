/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Submit Incident Report Logic
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

  applyTheme(getStoredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ═══════════════════════════════════════════════
  //  SESSION DISPLAY & LOGOUT
  // ═══════════════════════════════════════════════
  const sessionUser = sessionStorage.getItem('tipped_user_name');
  if (sessionUser && userDisplay) {
    userDisplay.textContent = sessionUser;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = '/login';
    });
  }

  // ═══════════════════════════════════════════════
  //  BENTO TILE 1: CAMPUS TOGGLE
  // ═══════════════════════════════════════════════
  const campusBtns = $$('.campus-toggle__btn');
  const campusInput = $('#report-campus');

  campusBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      campusBtns.forEach((b) => {
        b.classList.remove('campus-toggle__btn--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('campus-toggle__btn--active');
      btn.setAttribute('aria-checked', 'true');
      if (campusInput) campusInput.value = btn.dataset.campus;
    });
  });

  // ═══════════════════════════════════════════════
  //  BENTO TILE 2: CATEGORY MATRIX
  // ═══════════════════════════════════════════════
  const categoryPills = $$('.category-pill');
  const categoryInput = $('#report-category');
  const categoryTag   = $('#category-selected-tag');

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      categoryPills.forEach((p) => {
        p.classList.remove('category-pill--active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('category-pill--active');
      pill.setAttribute('aria-checked', 'true');
      const val = pill.dataset.category;
      if (categoryInput) categoryInput.value = val;
      if (categoryTag) categoryTag.textContent = val;
    });
  });

  // ═══════════════════════════════════════════════
  //  BENTO TILE 3: CHARACTER COUNTER
  // ═══════════════════════════════════════════════
  const descTextarea = $('#report-desc');
  const charCounter  = $('#char-counter');

  if (descTextarea && charCounter) {
    descTextarea.addEventListener('input', () => {
      const len = descTextarea.value.length;
      charCounter.textContent = `${len} / 1000 characters`;
      if (len >= 950) {
        charCounter.classList.add('char-counter--warn');
      } else {
        charCounter.classList.remove('char-counter--warn');
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  BENTO TILE 4: PHOTO EVIDENCE DROPZONE
  // ═══════════════════════════════════════════════
  const dropzone      = $('#photo-dropzone');
  const photoInput    = $('#photo-input');
  const thumbnailGrid = $('#thumbnail-grid');
  const photoCounter  = $('#photo-counter');

  let uploadedPhotos = []; // stores { id, dataUrl, name }

  function updatePhotoCounter() {
    if (photoCounter) {
      photoCounter.textContent = `${uploadedPhotos.length} / 5 photos`;
    }
  }

  function renderThumbnails() {
    if (!thumbnailGrid) return;
    thumbnailGrid.innerHTML = '';

    uploadedPhotos.forEach((photo, idx) => {
      const item = document.createElement('div');
      item.className = 'thumbnail-item';
      item.innerHTML = `
        <img src="${photo.dataUrl}" alt="Photo evidence ${idx + 1}" class="thumbnail-item__img" />
        <button type="button" class="thumbnail-item__remove" data-id="${photo.id}" aria-label="Remove photo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      item.querySelector('.thumbnail-item__remove').addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedPhotos = uploadedPhotos.filter((p) => p.id !== photo.id);
        renderThumbnails();
        updatePhotoCounter();
      });

      thumbnailGrid.appendChild(item);
    });

    // If max photos reached, hide or disable dropzone prompt
    if (dropzone) {
      if (uploadedPhotos.length >= 5) {
        dropzone.classList.add('dropzone--max');
      } else {
        dropzone.classList.remove('dropzone--max');
      }
    }
  }

  function handleFiles(files) {
    const remainingSlots = 5 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      alert('You can upload a maximum of 5 photos.');
      return;
    }

    const filesToLoad = Array.from(files).slice(0, remainingSlots);

    filesToLoad.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedPhotos.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          dataUrl: e.target.result,
          name: file.name
        });
        renderThumbnails();
        updatePhotoCounter();
      };
      reader.readAsDataURL(file);
    });
  }

  if (dropzone && photoInput) {
    dropzone.addEventListener('click', () => {
      if (uploadedPhotos.length < 5) photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
      photoInput.value = ''; // reset so same file can be re-selected if deleted
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dropzone--active');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dropzone--active');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  FORM SUBMISSION & MODAL
  // ═══════════════════════════════════════════════
  const form      = $('#incident-form');
  const submitBtn = $('#submit-report-btn');
  const modal     = $('#success-modal');
  const modalTicket = $('#modal-ticket-id');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const floor = $('#report-floor').value;
      const room  = $('#report-room').value.trim();
      const desc  = $('#report-desc').value.trim();
      const campus = $('#report-campus').value;
      const category = $('#report-category').value;
      const landmark = $('#report-landmark').value.trim();

      if (!floor) {
        alert('Please select a Floor Level.');
        $('#report-floor').focus();
        return;
      }
      if (!room) {
        alert('Please enter a Room or Specific Area.');
        $('#report-room').focus();
        return;
      }
      if (!desc) {
        alert('Please provide a Problem Description.');
        $('#report-desc').focus();
        return;
      }

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '.75';
        submitBtn.querySelector('span').textContent = 'SUBMITTING REPORT…';
      }

      setTimeout(() => {
        // Generate random ticket ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const ticketId = `#TIP-2026-${randomNum}`;

        // Save report to localStorage for cross-page demo
        try {
          const now = new Date();
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const formattedTimestamp = `${dateStr} • ${timeStr}`;

          const reports = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
          reports.unshift({
            id: ticketId,
            campus: `${campus} Building — ${room}`,
            rawCampus: `${campus} Campus`,
            room: room,
            floor: floor,
            landmark: landmark,
            category: category,
            status: 'Pending',
            date: formattedTimestamp,
            description: desc,
            photos: uploadedPhotos.map(p => p.dataUrl),
            photosCount: uploadedPhotos.length,
            adminRemark: {
              text: 'Report received and queued for dispatch verification by campus facilities.',
              action: 'Ticket Logged',
              admin: `Facilities Helpdesk (${campus})`
            }
          });
          localStorage.setItem('tipped_user_reports', JSON.stringify(reports));
        } catch (err) {
          console.warn('Storage error:', err);
        }

        if (modalTicket) modalTicket.textContent = ticketId;
        if (modal) modal.classList.remove('modal--hidden');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.querySelector('span').textContent = 'SUBMIT INCIDENT REPORT';
        }
      }, 900);
    });
  }

})();
