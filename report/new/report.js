/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Submit Incident Report Logic
   Official T.I.P. Manila Campus Building & Room Mapping Standard
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
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
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
  //  OFFICIAL T.I.P. MANILA LOCATION MAPPING DATA
  // ═══════════════════════════════════════════════
  const CAMPUS_DATA = {
    arlegui: {
      name: 'Arlegui Campus',
      codePrefix: 'ARL',
      buildings: [
        {
          code: 'A',
          name: 'Arlegui Main Building',
          floors: [
            { level: '1st Floor', facilitiesHint: 'Lobby, Registrar, Accounting, Clinic, Restrooms' },
            { level: '2nd Floor', facilitiesHint: 'Classrooms, Faculty Room, Restrooms' },
            { level: '3rd Floor', facilitiesHint: 'CAD Lab 302, Computer Labs, Physics Lab, Classrooms' },
            { level: '4th Floor', facilitiesHint: 'Classrooms, Engineering Labs, Restrooms' },
            { level: '5th Floor', facilitiesHint: 'Drawing Rooms, Classrooms, Study Area' },
            { level: '6th Floor', facilitiesHint: 'Auditorium, AVR, Rooftop Hall' }
          ]
        }
      ]
    },
    casal: {
      name: 'Casal Campus',
      codePrefix: 'CSL',
      buildings: [
        {
          code: 'F',
          name: "Founder's Building",
          floors: [
            { level: '1st Floor', facilitiesHint: 'Admissions, Canteen, Student Affairs, Restrooms' },
            { level: '2nd Floor', facilitiesHint: 'Casal Library, Reading Hall, Restrooms' },
            { level: '3rd Floor', facilitiesHint: 'Classrooms, Faculty Center, Restrooms' },
            { level: '4th Floor', facilitiesHint: 'Classrooms, Chemistry Lab, Study Area' },
            { level: '5th Floor', facilitiesHint: 'Classrooms, Computer Lab, AVR' },
            { level: '6th Floor', facilitiesHint: 'Multi-Purpose Hall, Rooftop' }
          ]
        },
        {
          code: 'C',
          name: 'Building 2',
          floors: [
            { level: '1st Floor', facilitiesHint: 'IT Computer Lab 102, Server Room, IT Faculty' },
            { level: '2nd Floor', facilitiesHint: 'Electronics Lab, Hardware Workshop, Classrooms' },
            { level: '3rd Floor', facilitiesHint: 'Study Hall 2, Drafting Room, Restroom' }
          ]
        },
        {
          code: 'PC-5',
          name: 'P. Casal 5',
          floors: [
            { level: '1st Floor', facilitiesHint: 'Security Office, Student Lounge' },
            { level: '2nd Floor', facilitiesHint: 'Classrooms, Student Council' },
            { level: '3rd Floor', facilitiesHint: 'Classrooms, Faculty Extension' },
            { level: '4th Floor', facilitiesHint: 'Lecture Rooms, Discussion Rooms' }
          ]
        },
        {
          code: 'PC-12',
          name: 'P. Casal 12',
          floors: [
            { level: '1st Floor', facilitiesHint: 'Architecture Lobby, Exhibition Hall' },
            { level: '2nd Floor', facilitiesHint: 'Architecture Studios, CAD Stations' },
            { level: '3rd Floor', facilitiesHint: 'Design Studios, Model Making Lab' },
            { level: '4th Floor', facilitiesHint: 'Senior Studios, Thesis Defense Room' }
          ]
        },
        {
          code: 'PE',
          name: 'PE Center & Annex',
          floors: [
            { level: 'Ground Level', facilitiesHint: 'Gymnasium, Sports Equipment Depot, Bleachers' },
            { level: '2nd Floor', facilitiesHint: 'Dance Studio, Fitness & Weights Gym' },
            { level: '3rd Floor', facilitiesHint: 'Martial Arts Hall, Table Tennis Area' },
            { level: 'Rooftop Annex', facilitiesHint: 'Open Training Deck' }
          ]
        },
        {
          code: 'EXT',
          name: 'Outdoor / Common Grounds',
          floors: [
            { level: 'Ground Level', facilitiesHint: 'Main Plaza, Gazebo, Flagpole Area, Parking Lot' }
          ]
        }
      ]
    }
  };

  // ═══════════════════════════════════════════════
  //  BENTO TILE 1: CASCADING LOCATION PICKER
  // ═══════════════════════════════════════════════
  const campusBtns       = $$('.campus-toggle__btn');
  const campusInput      = $('#report-campus');
  const buildingSelect   = $('#report-building');
  const floorSelect      = $('#report-floor');
  const roomInput        = $('#report-room');
  const landmarkInput    = $('#report-landmark');
  const floorHintBadge   = $('#floor-hint-badge');
  const floorHintText    = $('#floor-hint-text');
  const previewRoomCode  = $('#preview-room-code');
  const previewLocationDesc = $('#preview-location-desc');

  let currentCampusKey   = 'arlegui';
  let currentBuildingObj = null;
  let currentFloorObj    = null;

  function formatRoomCode(buildingCode, roomStr) {
    if (!buildingCode) return 'TBD';
    if (!roomStr || !roomStr.trim()) return `${buildingCode}-TBD`;

    const raw = roomStr.trim();
    // If user already typed "F-306" or "A-101"
    if (raw.toUpperCase().startsWith(`${buildingCode}-`)) {
      return raw.toUpperCase();
    }

    // Check for room number pattern e.g. "306", "101B", "Lab 302" -> extracts 302
    const numMatch = raw.match(/\b\d{1,4}[A-Z]?\b/i);
    if (numMatch) {
      return `${buildingCode}-${numMatch[0].toUpperCase()}`;
    }

    // Clean text for special places like "Canteen", "Casal Library", "Main Plaza"
    const cleaned = raw
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((w) => w.toUpperCase())
      .slice(0, 2)
      .join('-');

    return `${buildingCode}-${cleaned || 'AREA'}`;
  }

  function updateLivePreview() {
    const campusData = CAMPUS_DATA[currentCampusKey];
    const bCode = currentBuildingObj ? currentBuildingObj.code : '';
    const bName = currentBuildingObj ? currentBuildingObj.name : '';
    const fLevel = currentFloorObj ? currentFloorObj.level : (floorSelect ? floorSelect.value : '');
    const rVal = roomInput ? roomInput.value.trim() : '';

    const formattedCode = formatRoomCode(bCode, rVal);

    if (previewRoomCode) {
      previewRoomCode.textContent = `#${formattedCode}`;
    }

    if (previewLocationDesc) {
      const parts = [
        campusData ? campusData.name : '',
        bName ? `${bName}${fLevel ? `, ${fLevel}` : ''}` : ''
      ].filter(Boolean);
      previewLocationDesc.textContent = parts.join(' • ') || 'Please select location details above';
    }
  }

  function populateFloors(buildingObj) {
    if (!floorSelect) return;
    floorSelect.innerHTML = '<option value="" disabled selected>Select floor level…</option>';

    if (!buildingObj || !buildingObj.floors) {
      if (floorHintBadge) floorHintBadge.style.display = 'none';
      currentFloorObj = null;
      updateLivePreview();
      return;
    }

    buildingObj.floors.forEach((f) => {
      const opt = document.createElement('option');
      opt.value = f.level;
      opt.textContent = f.level;
      floorSelect.appendChild(opt);
    });

    // Auto-select first floor if only 1 option (like EXT grounds)
    if (buildingObj.floors.length === 1) {
      floorSelect.selectedIndex = 1;
      onFloorChange();
    } else {
      floorSelect.selectedIndex = 0;
      if (floorHintBadge) floorHintBadge.style.display = 'none';
      currentFloorObj = null;
      updateLivePreview();
    }
  }

  function onFloorChange() {
    if (!floorSelect || !currentBuildingObj) return;
    const selectedLevel = floorSelect.value;
    const floorObj = currentBuildingObj.floors.find((f) => f.level === selectedLevel);
    currentFloorObj = floorObj || null;

    if (floorObj && floorObj.facilitiesHint) {
      if (floorHintText) floorHintText.textContent = `Known Facilities: ${floorObj.facilitiesHint}`;
      if (floorHintBadge) floorHintBadge.style.display = 'inline-flex';
    } else {
      if (floorHintBadge) floorHintBadge.style.display = 'none';
    }

    updateLivePreview();
  }

  function populateBuildings(campusKey) {
    if (!buildingSelect) return;
    buildingSelect.innerHTML = '<option value="" disabled selected>Select building…</option>';

    const campusData = CAMPUS_DATA[campusKey];
    if (!campusData || !campusData.buildings) return;

    campusData.buildings.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.code;
      opt.textContent = `${b.name} (${b.code})`;
      buildingSelect.appendChild(opt);
    });

    // Auto-select if only 1 building (e.g. Arlegui Main Building)
    if (campusData.buildings.length === 1) {
      buildingSelect.selectedIndex = 1;
      currentBuildingObj = campusData.buildings[0];
      populateFloors(currentBuildingObj);
    } else {
      buildingSelect.selectedIndex = 0;
      currentBuildingObj = null;
      populateFloors(null);
    }
    updateLivePreview();
  }

  function onBuildingChange() {
    if (!buildingSelect) return;
    const bCode = buildingSelect.value;
    const campusData = CAMPUS_DATA[currentCampusKey];
    currentBuildingObj = campusData ? campusData.buildings.find((b) => b.code === bCode) : null;
    populateFloors(currentBuildingObj);
  }

  // Campus Toggle Listeners
  campusBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      campusBtns.forEach((b) => {
        b.classList.remove('campus-toggle__btn--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('campus-toggle__btn--active');
      btn.setAttribute('aria-checked', 'true');

      const campusVal = btn.dataset.campus.toLowerCase();
      currentCampusKey = campusVal;
      if (campusInput) campusInput.value = campusVal;

      // Reset lower inputs on campus switch
      if (roomInput) roomInput.value = '';
      if (landmarkInput) landmarkInput.value = '';
      populateBuildings(currentCampusKey);
    });
  });

  if (buildingSelect) {
    buildingSelect.addEventListener('change', onBuildingChange);
  }

  if (floorSelect) {
    floorSelect.addEventListener('change', onFloorChange);
  }

  if (roomInput) {
    roomInput.addEventListener('input', updateLivePreview);
  }

  // Initialize building & floor cascading picker
  populateBuildings(currentCampusKey);

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

    // If max photos reached, style dropzone
    if (dropzone) {
      if (uploadedPhotos.length >= 5) {
        dropzone.classList.add('dropzone--max');
      } else {
        dropzone.classList.remove('dropzone--max');
      }
    }
  }

  // ── Auto-load photos passed from Camera FAB trigger ──
  try {
    const pendingPhotosRaw = sessionStorage.getItem('tipped_pending_photos');
    if (pendingPhotosRaw) {
      const pendingPhotos = JSON.parse(pendingPhotosRaw);
      if (Array.isArray(pendingPhotos) && pendingPhotos.length > 0) {
        uploadedPhotos = pendingPhotos.slice(0, 5);
        renderThumbnails();
        updatePhotoCounter();
      }
      sessionStorage.removeItem('tipped_pending_photos');
    }
  } catch (err) {
    console.warn('Could not read pending photos:', err);
  }

  function handleFiles(files) {
    const nonImages = Array.from(files).filter((f) => !f.type.startsWith('image/'));
    if (nonImages.length > 0) {
      alert('Only image files are allowed. Video formats are blocked.');
    }

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const remainingSlots = 5 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      alert('Maximum 5 photos allowed per incident report.');
      return;
    }

    if (imageFiles.length > remainingSlots) {
      alert(`Maximum 5 photos allowed per incident report. Attaching first ${remainingSlots} photo(s).`);
    }

    const filesToLoad = imageFiles.slice(0, remainingSlots);

    filesToLoad.forEach((file) => {
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
  const form        = $('#incident-form');
  const submitBtn   = $('#submit-report-btn');
  const modal       = $('#success-modal');
  const modalTicket = $('#modal-ticket-id');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const bCode = buildingSelect ? buildingSelect.value : '';
      const floor = floorSelect ? floorSelect.value : '';
      const room  = roomInput ? roomInput.value.trim() : '';
      const desc  = descTextarea ? descTextarea.value.trim() : '';
      const campusKey = (campusInput ? campusInput.value : currentCampusKey).toLowerCase();
      const category = (categoryInput ? categoryInput.value : 'HVAC & Cooling');
      const landmark = landmarkInput ? landmarkInput.value.trim() : '';

      if (!bCode) {
        alert('Please select a Building.');
        if (buildingSelect) buildingSelect.focus();
        return;
      }
      if (!floor) {
        alert('Please select a Floor Level.');
        if (floorSelect) floorSelect.focus();
        return;
      }
      if (!room) {
        alert('Please enter a Room or Specific Area.');
        if (roomInput) roomInput.focus();
        return;
      }
      if (!desc) {
        alert('Please provide a Problem Description.');
        if (descTextarea) descTextarea.focus();
        return;
      }

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '.75';
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'SUBMITTING REPORT…';
      }

      setTimeout(() => {
        const campusData = CAMPUS_DATA[campusKey] || CAMPUS_DATA.arlegui;
        const bObj = campusData.buildings.find((b) => b.code === bCode) || currentBuildingObj;
        const formattedRoomCode = formatRoomCode(bCode, room);

        // Ticket ID generation (e.g. ARL-FAC-2026-0877, CSL-ELE-2026-0142)
        const campusCode = campusData.codePrefix || 'ARL';
        let catCode = 'FAC';
        const c = (category || '').toLowerCase();
        if (c.includes('elect') || c.includes('power')) catCode = 'ELE';
        else if (c.includes('water') || c.includes('sanitat') || c.includes('plumb')) catCode = 'PLM';
        else if (c.includes('hvac') || c.includes('cool') || c.includes('air')) catCode = 'HVC';
        else if (c.includes('it') || c.includes('digital') || c.includes('network')) catCode = 'DIT';
        else if (c.includes('safety') || c.includes('hazard')) catCode = 'SAF';
        else if (c.includes('faculty') || c.includes('acad')) catCode = 'ACA';
        else if (c.includes('furnitur') || c.includes('fixture')) catCode = 'FAC';
        else catCode = 'FAC';

        const randomNum = String(Math.floor(100 + Math.random() * 9000)).padStart(4, '0');
        const ticketId = `${campusCode}-${catCode}-2026-${randomNum}`;

        // Structured Location DTO according to official mapping standard
        const locationPayload = {
          campus: campusKey,
          building_code: bCode,
          building_name: bObj ? bObj.name : bCode,
          floor_level: floor,
          room_code: formattedRoomCode,
          specific_area: room,
          landmark: landmark
        };

        // Save report to localStorage for cross-page demo
        try {
          const now = new Date();
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const formattedTimestamp = `${dateStr} • ${timeStr}`;

          const reports = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
          reports.unshift({
            id: ticketId,
            campus: `${bObj ? bObj.name : campusData.name} — ${formattedRoomCode} (${room})`,
            rawCampus: campusData.name,
            building_code: locationPayload.building_code,
            building_name: locationPayload.building_name,
            floor_level: locationPayload.floor_level,
            room_code: locationPayload.room_code,
            specific_area: locationPayload.specific_area,
            room: `${formattedRoomCode} (${room})`,
            floor: floor,
            landmark: landmark,
            category: category,
            status: 'Pending',
            date: formattedTimestamp,
            description: desc,
            photos: uploadedPhotos.map((p) => p.dataUrl),
            photosCount: uploadedPhotos.length,
            location: locationPayload,
            adminRemark: {
              text: `Report queued for dispatch verification at ${locationPayload.building_name} (${formattedRoomCode}).`,
              action: 'Ticket Logged',
              admin: `Facilities Helpdesk (${campusData.name})`
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
          const span = submitBtn.querySelector('span');
          if (span) span.textContent = 'SUBMIT INCIDENT REPORT';
        }
      }, 750);
    });
  }

})();
