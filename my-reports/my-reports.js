/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — My Reports / Ticket Tracker Logic
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── High Quality Inline Evidence SVGs (Sample Data) ──
  const sampleEvidence = {
    acLeak: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
          <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/></filter>
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <!-- Wall grid -->
        <line x1="0" y1="220" x2="400" y2="220" stroke="#334155" stroke-width="2"/>
        <!-- AC Unit Body -->
        <rect x="60" y="60" width="280" height="90" rx="8" fill="url(#metal)" filter="url(#shadow)"/>
        <rect x="70" y="70" width="260" height="15" rx="3" fill="#64748b"/>
        <!-- Louver flap -->
        <rect x="70" y="130" width="260" height="10" rx="2" fill="#475569"/>
        <!-- Brand indicator -->
        <circle cx="310" cy="115" r="4" fill="#38bdf8"/>
        <!-- Water droplets leaking -->
        <path d="M 120 145 C 117 150, 115 158, 120 165 C 124 165, 126 158, 120 145 Z" fill="#38bdf8"/>
        <path d="M 180 145 C 177 155, 174 168, 180 178 C 185 178, 188 168, 180 145 Z" fill="#38bdf8"/>
        <path d="M 270 145 C 268 152, 266 160, 270 168 C 274 168, 276 160, 270 145 Z" fill="#38bdf8"/>
        <!-- Water puddle below -->
        <ellipse cx="200" cy="240" rx="90" ry="12" fill="#0284c7" opacity="0.6"/>
        <ellipse cx="200" cy="240" rx="60" ry="7" fill="#38bdf8" opacity="0.8"/>
        <!-- Label tag -->
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">PHOTO EVIDENCE #1</text>
      </svg>
    `)}`,
    pipeLeak: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="pipeBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#pipeBg)"/>
        <!-- Ceiling tile lines -->
        <line x1="100" y1="0" x2="100" y2="300" stroke="#334155" stroke-dasharray="4,4"/>
        <line x1="250" y1="0" x2="250" y2="300" stroke="#334155" stroke-dasharray="4,4"/>
        <!-- Water pipe -->
        <path d="M 50 150 L 350 150" stroke="#64748b" stroke-width="26" stroke-linecap="round"/>
        <circle cx="200" cy="150" r="22" fill="#475569" stroke="#94a3b8" stroke-width="4"/>
        <!-- Pipe leak drip -->
        <path d="M 200 170 C 196 182, 192 195, 200 210 C 206 210, 209 195, 200 170 Z" fill="#38bdf8"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">DRAIN PIPE COUPLER</text>
      </svg>
    `)}`,
    ballast: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <!-- Ceiling Grid -->
        <rect x="50" y="40" width="300" height="100" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <!-- Two Tube Lights -->
        <rect x="70" y="60" width="260" height="18" rx="9" fill="#f8fafc" opacity="0.95" filter="drop-shadow(0 0 8px #fef08a)"/>
        <!-- Flickering/Dead tube -->
        <rect x="70" y="100" width="260" height="18" rx="9" fill="#475569" opacity="0.5"/>
        <path d="M 90 109 L 140 109 M 220 109 L 280 109" stroke="#000" stroke-width="2"/>
        <!-- Spark warning -->
        <polygon points="200,160 208,185 218,185 210,205 222,205 202,235 206,200 196,200" fill="#f59e0b"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">FIXTURE #405</text>
      </svg>
    `)}`,
    plumbingValve: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <!-- Tile pattern -->
        <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" stroke-width="2"/>
        <line x1="0" y1="200" x2="400" y2="200" stroke="#1e293b" stroke-width="2"/>
        <line x1="130" y1="0" x2="130" y2="300" stroke="#1e293b" stroke-width="2"/>
        <line x1="270" y1="0" x2="270" y2="300" stroke="#1e293b" stroke-width="2"/>
        <!-- Flush Valve & Pipe -->
        <rect x="190" y="40" width="20" height="140" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="200" cy="110" r="28" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
        <rect x="220" y="104" width="45" height="12" rx="4" fill="#94a3b8"/>
        <!-- Water spray -->
        <path d="M 200 180 Q 230 220 250 260 M 200 180 Q 170 220 150 260" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6,4"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">RESTROOM CUBICLE 2</text>
      </svg>
    `)}`,
    switchRack: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0b0f19"/>
        <!-- Server Cabinet Rack -->
        <rect x="40" y="40" width="320" height="220" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <!-- Switch 1 -->
        <rect x="60" y="65" width="280" height="35" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <!-- Port LEDs (Orange Alert) -->
        <circle cx="80" cy="82" r="3" fill="#22c55e"/>
        <circle cx="95" cy="82" r="3" fill="#ef4444"/>
        <circle cx="110" cy="82" r="3" fill="#ef4444"/>
        <circle cx="125" cy="82" r="3" fill="#22c55e"/>
        <!-- Patch cables -->
        <path d="M 95 85 Q 95 120 130 140" stroke="#3b82f6" stroke-width="3" fill="none"/>
        <path d="M 110 85 Q 110 125 150 140" stroke="#eab308" stroke-width="3" fill="none"/>
        <!-- Switch 2 -->
        <rect x="60" y="130" width="280" height="35" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">CISCO RACK LAB 102</text>
      </svg>
    `)}`
  };

  // ── Baseline Mock Reports Specification ──
  const baselineReports = [
    {
      id: '#TIP-2026-0892',
      status: 'In Progress',
      date: 'Oct 1, 2026 • 09:14 AM',
      campus: 'Arlegui Building — CAD Lab 302',
      rawCampus: 'Arlegui Campus',
      room: 'CAD Lab 302',
      category: 'HVAC & Cooling',
      categoryIcon: '❄️',
      description: 'Inverter split-type AC unit leaking water directly onto student drafting desks. Unit producing loud rattling noise.',
      photos: [sampleEvidence.acLeak, sampleEvidence.pipeLeak],
      adminRemark: {
        text: 'Technician dispatched to Arlegui CAD Lab. Replacement drain pipe installed and unit tested.',
        action: 'Technician Dispatched',
        admin: 'Facilities Admin (Arlegui)'
      }
    },
    {
      id: '#TIP-2026-0741',
      status: 'Resolved',
      date: 'Sep 28, 2026 • 02:45 PM',
      campus: 'Casal Building — 4th Floor Hallway',
      rawCampus: 'Casal Campus',
      room: '4th Floor Hallway (Near Room 405)',
      category: 'Electrical & Power',
      categoryIcon: '⚡',
      description: 'Flickering fluorescent ballast causing buzzing sound near Room 405. Light completely died during afternoon classes.',
      photos: [sampleEvidence.ballast],
      adminRemark: {
        text: 'Ballast replaced with new energy-efficient LED tube. Verified working order.',
        action: 'Repairs Completed',
        admin: 'Maintenance Lead (Casal)'
      }
    },
    {
      id: '#TIP-2026-0914',
      status: 'Pending',
      date: 'Oct 2, 2026 • 11:20 AM',
      campus: 'Arlegui Building — 2nd Floor Restroom',
      rawCampus: 'Arlegui Campus',
      room: '2nd Floor Restroom',
      category: 'Water & Sanitation',
      categoryIcon: '🚰',
      description: 'Second cubicle flush valve stuck open, running water continuously and overflowing floor drain.',
      photos: [sampleEvidence.plumbingValve],
      adminRemark: {
        text: 'Work order dispatched. Facilities plumbing team assigned for immediate inspection.',
        action: 'Work Order Assigned',
        admin: 'Facilities Helpdesk'
      }
    },
    {
      id: '#TIP-2026-0688',
      status: 'Under Review',
      date: 'Sep 29, 2026 • 10:05 AM',
      campus: 'Casal Building — IT Computer Lab 102',
      rawCampus: 'Casal Campus',
      room: 'IT Computer Lab 102',
      category: 'Digital & IT',
      categoryIcon: '💻',
      description: 'Ceiling-mounted network switch rack dropping packets intermittently for 12 workstations.',
      photos: [sampleEvidence.switchRack],
      adminRemark: {
        text: 'Network diagnostics scheduled with campus IT administrator during lunch break.',
        action: 'Diagnostics Scheduled',
        admin: 'IT Systems Admin'
      }
    },
    {
      id: '#TIP-2026-0512',
      status: 'Dismissed',
      date: 'Sep 24, 2026 • 04:30 PM',
      campus: 'Arlegui Building — Main Lobby',
      rawCampus: 'Arlegui Campus',
      room: 'Main Lobby',
      category: 'Furniture & Fixtures',
      categoryIcon: '🪑',
      description: 'Study table moved to corner blocking entrance hallway.',
      photos: [],
      adminRemark: {
        text: 'Table was repositioned for ongoing student council exhibit; authorized by Student Affairs.',
        action: 'Notice Filed',
        admin: 'Security Office'
      }
    }
  ];

  // ── Category Icon Map ──
  const categoryIcons = {
    'HVAC & Cooling': '❄️',
    'Electrical & Power': '⚡',
    'Water & Sanitation': '🚰',
    'Digital & IT': '💻',
    'Furniture & Fixtures': '🪑',
    'Life Safety & Hazards': '⚠️',
    'Faculty / Academic': '🎓'
  };

  // ── Retrieve Merged Reports ──
  function getAllReports() {
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
    } catch (e) {
      console.warn('Storage parsing error', e);
    }

    const storedIds = new Set(stored.map((r) => r.id));
    const merged = [...stored, ...baselineReports.filter((b) => !storedIds.has(b.id))];

    // Ensure any report has proper defaults
    return merged.map((item) => {
      const cat = item.category || 'HVAC & Cooling';
      const icon = item.categoryIcon || categoryIcons[cat] || '📋';
      return {
        id: item.id || '#TIP-2026-0001',
        status: item.status || 'Pending',
        date: item.date || 'Oct 3, 2026 • 08:00 AM',
        campus: item.campus || 'Arlegui Building — Main Hall',
        rawCampus: item.rawCampus || (item.campus && item.campus.includes('Casal') ? 'Casal Campus' : 'Arlegui Campus'),
        room: item.room || '',
        category: cat,
        categoryIcon: icon,
        description: item.description || 'Facility maintenance report submitted via student portal.',
        photos: Array.isArray(item.photos) ? item.photos : [],
        adminRemark: item.adminRemark || {
          text: 'Ticket acknowledged by campus maintenance office. Technician review in progress.',
          action: 'Under Facilities Review',
          admin: 'Facilities Helpdesk'
        }
      };
    });
  }

  // ── Elements ──
  const themeToggle   = $('#theme-toggle');
  const logoutBtn     = $('#logout-btn');
  const userDisplay   = $('#user-display-name');
  const statusTabs    = $$('.status-tab-btn');
  const campusTabs    = $$('.campus-subtab-btn');
  const searchInput   = $('#tracker-search-input');
  const cardsGrid     = $('#tracker-cards-grid');

  // Lightbox Elements
  const lightboxModal   = $('#lightbox-modal');
  const lightboxImg     = $('#lightbox-img');
  const lightboxClose   = $('#lightbox-close-btn');
  const lightboxBackdrop= $('#lightbox-backdrop');
  const lightboxCaption = $('#lightbox-caption');

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
  //  FILTER STATE
  // ═══════════════════════════════════════════════
  let activeStatusFilter = 'All'; // 'All', 'Pending', 'Under Review', 'In Progress', 'Resolved', 'Dismissed'
  let activeCampusFilter = 'All'; // 'All', 'Arlegui Campus', 'Casal Campus'
  let searchQuery = '';

  function getStatusClass(status) {
    switch (status) {
      case 'Pending':      return 'status-pill--pending';
      case 'Under Review': return 'status-pill--review';
      case 'In Progress':  return 'status-pill--progress';
      case 'Resolved':     return 'status-pill--resolved';
      case 'Dismissed':    return 'status-pill--dismissed';
      default:             return 'status-pill--pending';
    }
  }

  // ═══════════════════════════════════════════════
  //  LIGHTBOX CONTROLLER
  // ═══════════════════════════════════════════════
  function openLightbox(src, captionText) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || 'Photo Evidence';
    }
    lightboxModal.classList.remove('lightbox-modal--hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('lightbox-modal--hidden');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.classList.contains('lightbox-modal--hidden')) {
      closeLightbox();
    }
  });

  // ═══════════════════════════════════════════════
  //  RENDER TICKET CARDS
  // ═══════════════════════════════════════════════
  function updateCounts(reports) {
    const counts = {
      'All': reports.length,
      'Pending': 0,
      'Under Review': 0,
      'In Progress': 0,
      'Resolved': 0,
      'Dismissed': 0
    };

    reports.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });

    statusTabs.forEach((btn) => {
      const st = btn.dataset.status;
      const countEl = btn.querySelector('.status-tab__count');
      if (countEl && counts[st] !== undefined) {
        countEl.textContent = counts[st];
      }
    });
  }

  function renderFeed() {
    const allReports = getAllReports();
    updateCounts(allReports);

    // Apply Filters
    const filtered = allReports.filter((item) => {
      // 1. Status Filter
      if (activeStatusFilter !== 'All' && item.status !== activeStatusFilter) {
        return false;
      }
      // 2. Campus Filter
      if (activeCampusFilter !== 'All') {
        const itemCampus = (item.rawCampus || item.campus || '').toLowerCase();
        const targetCampus = activeCampusFilter.toLowerCase();
        if (!itemCampus.includes(targetCampus.replace(' campus', ''))) {
          return false;
        }
      }
      // 3. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesCampus = (item.campus || '').toLowerCase().includes(q);
        const matchesRoom = (item.room || '').toLowerCase().includes(q);
        const matchesCategory = (item.category || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchesId && !matchesCampus && !matchesRoom && !matchesCategory && !matchesDesc) {
          return false;
        }
      }
      return true;
    });

    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';

    // Empty State
    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div class="empty-state-tile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="empty-state-icon">
            <rect x="3" y="4" width="18" height="16" rx="3"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="11" y2="17"></line>
          </svg>
          <div class="empty-state-text">No reports found for this filter</div>
          <p class="empty-state-sub">There are currently no tickets matching your active status, building, or search criteria.</p>
          <a href="/report/new" class="empty-state-link">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>+ File a new report</span>
          </a>
        </div>
      `;
      return;
    }

    // Render Cards
    filtered.forEach((ticket) => {
      const card = document.createElement('article');
      card.className = 'ticket-card';

      // Status pill class
      const statusClass = getStatusClass(ticket.status);

      // Thumbnails HTML
      let thumbnailsHtml = '';
      if (ticket.photos && ticket.photos.length > 0) {
        thumbnailsHtml = `
          <div class="ticket-card__evidence" aria-label="Photo evidence gallery">
            ${ticket.photos.map((photoUrl, idx) => `
              <div class="ticket-thumbnail-item" data-photo="${encodeURIComponent(photoUrl)}" data-caption="Ticket ${ticket.id} • Photo ${idx + 1}" title="Click to enlarge photo">
                <img src="${photoUrl}" alt="Incident photo ${idx + 1}" class="ticket-thumbnail-img" />
                <div class="ticket-thumbnail-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Remarks HTML
      let remarksHtml = '';
      if (ticket.adminRemark && ticket.adminRemark.text) {
        remarksHtml = `
          <div class="ticket-remarks-box">
            <div class="ticket-remarks__header">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span>OFFICIAL FACILITIES RESPONSE</span>
            </div>
            <p class="ticket-remarks__text">"${ticket.adminRemark.text}"</p>
            <div class="ticket-remarks__footer">
              <span class="ticket-remarks__action-badge">${ticket.adminRemark.action || 'Updated'}</span>
              <span>• Updated by ${ticket.adminRemark.admin || 'Facilities Office'}</span>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <!-- Card Header Row -->
          <div class="ticket-card__header">
            <div class="ticket-card__id-group">
              <span class="ticket-card__id">${ticket.id}</span>
              <span class="ticket-status-pill ${statusClass}">
                <span class="status-indicator-dot"></span>
                <span>${ticket.status}</span>
              </span>
            </div>
            <span class="ticket-card__timestamp">${ticket.date}</span>
          </div>

          <!-- Location & Category Tags -->
          <div class="ticket-card__tags">
            <span class="ticket-tag ticket-tag--location">
              📍 ${ticket.campus}
            </span>
            <span class="ticket-tag ticket-tag--category">
              ${ticket.categoryIcon || '📋'} ${ticket.category}
            </span>
          </div>

          <!-- Problem Summary -->
          <p class="ticket-card__desc">${ticket.description}</p>

          <!-- Evidence Thumbnails -->
          ${thumbnailsHtml}
        </div>

        <!-- Embedded Admin Remarks Box -->
        ${remarksHtml}
      `;

      // Attach Lightbox click handlers to thumbnail items
      card.querySelectorAll('.ticket-thumbnail-item').forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          const pUrl = decodeURIComponent(thumb.dataset.photo);
          const pCap = thumb.dataset.caption;
          openLightbox(pUrl, pCap);
        });
      });

      cardsGrid.appendChild(card);
    });
  }

  // ═══════════════════════════════════════════════
  //  EVENT LISTENERS: FILTERS & SEARCH
  // ═══════════════════════════════════════════════
  statusTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      statusTabs.forEach((b) => b.classList.remove('status-tab-btn--active'));
      btn.classList.add('status-tab-btn--active');
      activeStatusFilter = btn.dataset.status;
      renderFeed();
    });
  });

  campusTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      campusTabs.forEach((b) => b.classList.remove('campus-subtab-btn--active'));
      btn.classList.add('campus-subtab-btn--active');
      activeCampusFilter = btn.dataset.campus;
      renderFeed();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderFeed();
    });
  }

  // Initial Render
  renderFeed();

})();
