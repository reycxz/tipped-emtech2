/* ═══════════════════════════════════════════════════════════
   TIPPED Portal — Campus Admin Console Logic (/admin)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── Inline High-Res SVG Evidence Samples ──
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
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <line x1="0" y1="220" x2="400" y2="220" stroke="#334155" stroke-width="2"/>
        <rect x="60" y="60" width="280" height="90" rx="8" fill="url(#metal)"/>
        <rect x="70" y="70" width="260" height="15" rx="3" fill="#64748b"/>
        <rect x="70" y="130" width="260" height="10" rx="2" fill="#475569"/>
        <circle cx="310" cy="115" r="4" fill="#38bdf8"/>
        <path d="M 120 145 C 117 150, 115 158, 120 165 C 124 165, 126 158, 120 145 Z" fill="#38bdf8"/>
        <path d="M 180 145 C 177 155, 174 168, 180 178 C 185 178, 188 168, 180 145 Z" fill="#38bdf8"/>
        <ellipse cx="200" cy="240" rx="90" ry="12" fill="#0284c7" opacity="0.6"/>
        <rect x="15" y="15" width="140" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">ARLEGUI CAD LAB 302</text>
      </svg>
    `)}`,
    pipeLeak: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <line x1="100" y1="0" x2="100" y2="300" stroke="#334155" stroke-dasharray="4,4"/>
        <line x1="250" y1="0" x2="250" y2="300" stroke="#334155" stroke-dasharray="4,4"/>
        <path d="M 50 150 L 350 150" stroke="#64748b" stroke-width="26" stroke-linecap="round"/>
        <circle cx="200" cy="150" r="22" fill="#475569" stroke="#94a3b8" stroke-width="4"/>
        <path d="M 200 170 C 196 182, 192 195, 200 210 C 206 210, 209 195, 200 170 Z" fill="#38bdf8"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">DRAIN PIPE COUPLER</text>
      </svg>
    `)}`,
    ballast: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <rect x="50" y="40" width="300" height="100" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <rect x="70" y="60" width="260" height="18" rx="9" fill="#f8fafc" opacity="0.95"/>
        <rect x="70" y="100" width="260" height="18" rx="9" fill="#475569" opacity="0.5"/>
        <polygon points="200,160 208,185 218,185 210,205 222,205 202,235 206,200 196,200" fill="#f59e0b"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">FIXTURE #405 CASAL</text>
      </svg>
    `)}`,
    plumbingValve: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <rect x="190" y="40" width="20" height="140" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="200" cy="110" r="28" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
        <path d="M 200 180 Q 230 220 250 260 M 200 180 Q 170 220 150 260" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6,4"/>
        <rect x="15" y="15" width="140" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">RESTROOM CUBICLE 2</text>
      </svg>
    `)}`,
    switchRack: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0b0f19"/>
        <rect x="40" y="40" width="320" height="220" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
        <rect x="60" y="65" width="280" height="35" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <circle cx="80" cy="82" r="3" fill="#22c55e"/>
        <circle cx="95" cy="82" r="3" fill="#ef4444"/>
        <circle cx="110" cy="82" r="3" fill="#ef4444"/>
        <rect x="15" y="15" width="130" height="24" rx="4" fill="#000000" opacity="0.75"/>
        <text x="25" y="31" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">CISCO RACK LAB 102</text>
      </svg>
    `)}`
  };

  // ── Baseline Master Tickets Data ──
  const baselineAdminReports = [
    {
      id: '#TIP-2026-0892',
      status: 'In Progress',
      priority: 'High',
      date: 'Oct 1, 2026 • 09:14 AM',
      reporterName: 'Juan De La Cruz',
      reporterEmail: 'jdelacruz.m@tip.edu.ph',
      campus: 'Arlegui Building — CAD Lab 302',
      rawCampus: 'Arlegui Campus',
      room: 'CAD Lab 302',
      category: 'HVAC & Cooling',
      description: 'Inverter AC leaking water on drafting desks. Unit producing loud rattling noise.',
      photos: [sampleEvidence.acLeak, sampleEvidence.pipeLeak],
      remarks: [
        {
          action: 'Technician Dispatched',
          priority: 'High',
          note: 'Technician dispatched to Arlegui CAD Lab 302. Replaced AC drain pipe coupler.',
          admin: 'Facilities Admin',
          date: 'Oct 1, 2026 • 10:30 AM'
        }
      ]
    },
    {
      id: '#TIP-2026-0741',
      status: 'Resolved',
      priority: 'Medium',
      date: 'Sep 28, 2026 • 02:45 PM',
      reporterName: 'Maria Santos',
      reporterEmail: 'msantos.e@tip.edu.ph',
      campus: 'Casal Building — 4th Floor Hallway',
      rawCampus: 'Casal Campus',
      room: '4th Floor Hallway',
      category: 'Electrical & Power',
      description: 'Flickering fluorescent ballast buzzing near Room 405. Completely died during class.',
      photos: [sampleEvidence.ballast],
      remarks: [
        {
          action: 'Resolved On-Site',
          priority: 'Medium',
          note: 'Replaced ballast and tube with 18W energy-efficient LED fixture. Tested functional.',
          admin: 'Facilities Admin',
          date: 'Sep 28, 2026 • 04:15 PM'
        }
      ]
    },
    {
      id: '#TIP-2026-0914',
      status: 'Pending',
      priority: 'Critical',
      date: 'Oct 2, 2026 • 11:20 AM',
      reporterName: 'Kevin Reyes',
      reporterEmail: 'kreyes.c@tip.edu.ph',
      campus: 'Arlegui Building — 2nd Floor Restroom',
      rawCampus: 'Arlegui Campus',
      room: '2nd Floor Restroom',
      category: 'Water & Sanitation',
      description: 'Flush valve stuck open continuously overflowing floor drain.',
      photos: [sampleEvidence.plumbingValve],
      remarks: [
        {
          action: 'Inspection Scheduled',
          priority: 'Critical',
          note: 'Plumbing contractor notified for immediate water shutoff and valve overhaul.',
          admin: 'Facilities Admin',
          date: 'Oct 2, 2026 • 11:45 AM'
        }
      ]
    },
    {
      id: '#TIP-2026-0688',
      status: 'Under Review',
      priority: 'High',
      date: 'Sep 29, 2026 • 10:05 AM',
      reporterName: 'Alyssa Tan',
      reporterEmail: 'atan.c@tip.edu.ph',
      campus: 'Casal Building — IT Computer Lab 102',
      rawCampus: 'Casal Campus',
      room: 'IT Computer Lab 102',
      category: 'Digital & IT',
      description: 'Ceiling network switch rack dropping packets intermittently for 12 workstations.',
      photos: [sampleEvidence.switchRack],
      remarks: [
        {
          action: 'Technician Dispatched',
          priority: 'High',
          note: 'IT infrastructure team ping test scheduled during class break.',
          admin: 'Facilities Admin',
          date: 'Sep 29, 2026 • 11:10 AM'
        }
      ]
    },
    {
      id: '#TIP-2026-0512',
      status: 'Dismissed',
      priority: 'Low',
      date: 'Sep 24, 2026 • 04:30 PM',
      reporterName: 'Mark Bautista',
      reporterEmail: 'mbautista.a@tip.edu.ph',
      campus: 'Arlegui Building — Main Lobby',
      rawCampus: 'Arlegui Campus',
      room: 'Main Lobby',
      category: 'Furniture & Fixtures',
      description: 'Study table moved to corner blocking entrance hallway.',
      photos: [],
      remarks: [
        {
          action: 'Dismissed - Duplicate',
          priority: 'Low',
          note: 'Table placement authorized by Student Affairs for campus student council exhibit.',
          admin: 'Facilities Admin',
          date: 'Sep 24, 2026 • 05:00 PM'
        }
      ]
    },
    {
      id: '#TIP-2026-2192',
      status: 'Pending',
      priority: 'Medium',
      date: 'Oct 3, 2026 • 08:30 AM',
      reporterName: 'John Doe',
      reporterEmail: 'jdoe.m@tip.edu.ph',
      campus: 'Arlegui Building — Gymnasium Restroom',
      rawCampus: 'Arlegui Campus',
      room: 'Gymnasium Restroom',
      category: 'Water & Sanitation',
      description: 'Water dispenser leakage forming slip hazard at the court entrance.',
      photos: [sampleEvidence.plumbingValve],
      remarks: []
    },
    {
      id: '#TIP-2026-7574',
      status: 'Pending',
      priority: 'High',
      date: 'Oct 3, 2026 • 09:10 AM',
      reporterName: 'Elena Ramos',
      reporterEmail: 'eramos.t@tip.edu.ph',
      campus: 'Casal Building — CAD Lab 302',
      rawCampus: 'Casal Campus',
      room: 'CAD Lab 302',
      category: 'Electrical & Power',
      description: 'Power sockets on row 3 sparks when plugging workstation laptop chargers.',
      photos: [sampleEvidence.ballast],
      remarks: []
    }
  ];

  // ── Data Management & Storage Sync ──
  function getMasterReports() {
    let userReports = [];
    try {
      userReports = JSON.parse(localStorage.getItem('tipped_user_reports') || '[]');
    } catch (e) {
      console.warn('Storage read error', e);
    }

    const baselineIds = new Set(baselineAdminReports.map((b) => b.id));
    const mergedMap = new Map();

    baselineAdminReports.forEach((item) => mergedMap.set(item.id, { ...item }));

    userReports.forEach((item) => {
      const existing = mergedMap.get(item.id);
      if (existing) {
        mergedMap.set(item.id, { ...existing, ...item });
      } else {
        mergedMap.set(item.id, {
          id: item.id || '#TIP-2026-9999',
          status: item.status || 'Pending',
          priority: item.priority || 'Medium',
          date: item.date || 'Oct 3, 2026 • 08:00 AM',
          reporterName: item.reporterName || 'Institutional User',
          reporterEmail: item.reporterEmail || 'student@tip.edu.ph',
          campus: item.campus || 'Arlegui Campus',
          rawCampus: item.rawCampus || (item.campus && item.campus.includes('Casal') ? 'Casal Campus' : 'Arlegui Campus'),
          room: item.room || '',
          category: item.category || 'General Concern / Other',
          description: item.description || 'Maintenance incident reported via portal.',
          photos: Array.isArray(item.photos) ? item.photos : [],
          remarks: Array.isArray(item.remarks) ? item.remarks : (item.adminRemark ? [{
            action: item.adminRemark.action || 'Note Logged',
            priority: 'Medium',
            note: item.adminRemark.text || '',
            admin: item.adminRemark.admin || 'Facilities Admin',
            date: 'Oct 3, 2026 • 09:00 AM'
          }] : [])
        });
      }
    });

    return Array.from(mergedMap.values());
  }

  function saveMasterReports(reports) {
    try {
      localStorage.setItem('tipped_user_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }

  // ── State ──
  let allTickets = getMasterReports();
  let currentCampus = 'all';
  let currentCategory = 'all';
  let currentStatus = 'all';
  let searchQuery = '';
  let activeRemarkTicketId = null;

  // ── Elements ──
  const themeToggle = $('#theme-toggle');
  const logoutBtn   = $('#logout-btn');
  const tableBody   = $('#admin-table-body');
  const countBadge  = $('#admin-table-count');

  // Metrics elements
  const metricTotal    = $('#metric-total');
  const metricPending  = $('#metric-pending');
  const metricProgress = $('#metric-progress');
  const metricResolved = $('#metric-resolved');

  // Controls (Dropdowns & Search)
  const statusSelect   = $('#admin-status-filter');
  const campusSelect   = $('#admin-campus-filter');
  const categorySelect = $('#admin-category-filter');
  const searchInput    = $('#admin-search-input');

  // Modal elements
  const modalBackdrop = $('#admin-remark-modal');
  const modalCloseBtn = $('#admin-modal-close');
  const modalTitle = $('#admin-modal-title');
  const modalSubtitle = $('#admin-modal-subtitle');
  const modalPreset = $('#admin-remark-action');
  const modalPriority = $('#admin-remark-priority');
  const modalTextarea = $('#admin-remark-note');
  const modalForm = $('#admin-modal-form');
  const modalHistoryWrap = $('#admin-remark-history-wrap');
  const modalHistoryBox = $('#admin-remark-history-box');

  // Lightbox
  const lightbox = $('#admin-lightbox');
  const lightboxImg = $('#admin-lightbox-img');
  const lightboxCaption = $('#admin-lightbox-caption');
  const lightboxClose = $('#admin-lightbox-close');

  // Toast
  const toast = $('#admin-toast');
  const toastText = $('#admin-toast-text');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('admin-toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('admin-toast--visible');
    }, 3200);
  }

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
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
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
  //  LOGOUT CONTROL
  // ═══════════════════════════════════════════════
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = '/login';
    });
  }

  // ═══════════════════════════════════════════════
  //  METRICS CALCULATION
  // ═══════════════════════════════════════════════
  function updateMetrics() {
    const totalCount = allTickets.length;
    const pendingCount = allTickets.filter((t) => t.status === 'Pending').length;
    const progressCount = allTickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = allTickets.filter((t) => t.status === 'Resolved').length;

    // Use baseline dynamic floor as specified (e.g. 48, 12, 18, 15) if ticket count is smaller
    if (metricTotal) metricTotal.textContent = Math.max(48, totalCount);
    if (metricPending) metricPending.textContent = Math.max(12, pendingCount);
    if (metricProgress) metricProgress.textContent = Math.max(18, progressCount);
    if (metricResolved) metricResolved.textContent = Math.max(15, resolvedCount);
  }

  // ═══════════════════════════════════════════════
  //  FILTERING & SEARCH
  // ═══════════════════════════════════════════════
  function getFilteredTickets() {
    return allTickets.filter((item) => {
      // Campus filter
      if (currentCampus !== 'all') {
        const itemCampus = (item.rawCampus || item.campus || '').toLowerCase();
        if (currentCampus === 'arlegui' && !itemCampus.includes('arlegui')) return false;
        if (currentCampus === 'casal' && !itemCampus.includes('casal')) return false;
      }

      // Category filter
      if (currentCategory !== 'all') {
        if ((item.category || '').toLowerCase() !== currentCategory.toLowerCase()) return false;
      }

      // Status filter
      if (currentStatus !== 'all') {
        if ((item.status || '').toLowerCase() !== currentStatus.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = (item.id || '').toLowerCase().includes(q);
        const matchesReporter = (item.reporterName || '').toLowerCase().includes(q);
        const matchesEmail = (item.reporterEmail || '').toLowerCase().includes(q);
        const matchesRoom = (item.room || item.campus || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchesId && !matchesReporter && !matchesEmail && !matchesRoom && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }

  // ═══════════════════════════════════════════════
  //  TABLE RENDERING
  // ═══════════════════════════════════════════════
  function getStatusClass(status) {
    switch (status) {
      case 'Pending': return 'admin-inline-status--pending';
      case 'Under Review': return 'admin-inline-status--underreview';
      case 'In Progress': return 'admin-inline-status--inprogress';
      case 'Resolved': return 'admin-inline-status--resolved';
      case 'Dismissed': return 'admin-inline-status--dismissed';
      default: return 'admin-inline-status--pending';
    }
  }

  function getCategoryIcon(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('hvac') || c.includes('cooling')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
    }
    if (c.includes('elect') || c.includes('power')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    }
    if (c.includes('water') || c.includes('sanitation')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    }
    if (c.includes('digital') || c.includes('it')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    }
    if (c.includes('furniture') || c.includes('fixture')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
    }
    if (c.includes('safety') || c.includes('hazard')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
    if (c.includes('faculty') || c.includes('acad')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }

  function renderTable() {
    const filtered = getFilteredTickets();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} of ${allTickets.length} tickets`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 3rem 1rem; color: #94A3B8;">
            <p style="font-size:0.85rem; font-weight:700; color:var(--color-text-primary); margin-bottom:0.25rem;">No incident reports matched your filters.</p>
            <p style="font-size:0.72rem; color:var(--color-text-secondary);">Try clearing search keywords or switching filter tabs.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((ticket) => {
      const photos = Array.isArray(ticket.photos) ? ticket.photos : [];
      const photoHtml = photos.length > 0 ? `
        <div class="admin-evidence-strip">
          ${photos.slice(0, 3).map((p, idx) => `
            <div class="admin-evidence-thumb" data-photo="${encodeURIComponent(p)}" data-caption="${ticket.id} Evidence #${idx + 1}" title="Click to view evidence">
              <img src="${p}" alt="Evidence thumbnail" loading="lazy" />
            </div>
          `).join('')}
          ${photos.length > 3 ? `<span style="font-size:0.6rem; color:#94A3B8; font-weight:700;">+${photos.length - 3}</span>` : ''}
        </div>
      ` : '';

      return `
        <tr data-ticket-id="${ticket.id}">
          <!-- 1. Ticket ID & Date -->
          <td>
            <div class="admin-ticket-id">${ticket.id}</div>
            <div class="admin-date-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="admin-ticket-date">${ticket.date || 'Oct 3, 2026'}</span>
            </div>
          </td>

          <!-- 2. Reporter Details -->
          <td>
            <div class="admin-reporter-wrap">
              <div class="admin-avatar-icon" title="Reporter: ${ticket.reporterName || 'Student'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div class="admin-reporter-name">${ticket.reporterName || 'Institutional User'}</div>
                <div class="admin-reporter-email">${ticket.reporterEmail || 'student@tip.edu.ph'}</div>
              </div>
            </div>
          </td>

          <!-- 3. Location & Category -->
          <td>
            <div class="admin-location-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="admin-location-title">${ticket.campus || 'Arlegui Campus'}</span>
            </div>
            <span class="admin-category-badge">
              ${getCategoryIcon(ticket.category)}
              <span>${ticket.category || 'General Concern / Other'}</span>
            </span>
          </td>

          <!-- 4. Description & Evidence -->
          <td>
            <div class="admin-desc-snippet" title="${ticket.description}">${ticket.description || 'No description provided.'}</div>
            ${photoHtml}
          </td>

          <!-- 5. Inline Status Selector -->
          <td>
            <div class="admin-inline-status-wrap">
              <select class="admin-inline-status ${getStatusClass(ticket.status)}" data-id="${ticket.id}" aria-label="Change ticket status">
                <option value="Pending" ${ticket.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Under Review" ${ticket.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                <option value="Dismissed" ${ticket.status === 'Dismissed' ? 'selected' : ''}>Dismissed</option>
              </select>
              <svg class="admin-inline-chevron" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </td>

          <!-- 6. Admin Action -->
          <td>
            <button class="admin-remark-btn" data-id="${ticket.id}" title="Log maintenance remark">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Remark</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach event listeners for inline status change
    $$('.admin-inline-status').forEach((select) => {
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const ticketId = e.target.dataset.id;
        handleStatusChange(ticketId, newStatus, e.target);
      });
    });

    // Attach event listeners for remark button
    $$('.admin-remark-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ticketId = btn.dataset.id;
        openRemarkModal(ticketId);
      });
    });

    // Attach event listeners for lightbox thumbnails
    $$('.admin-evidence-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const imgSrc = decodeURIComponent(thumb.dataset.photo);
        const caption = thumb.dataset.caption;
        openLightbox(imgSrc, caption);
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  STATUS CHANGE HANDLER
  // ═══════════════════════════════════════════════
  function handleStatusChange(ticketId, newStatus, selectElement) {
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    ticket.status = newStatus;

    // Add remark entry if status changed
    if (!ticket.remarks) ticket.remarks = [];
    ticket.remarks.unshift({
      action: `Status updated to ${newStatus}`,
      priority: ticket.priority || 'Medium',
      note: `Inline status changed by Facilities Admin to ${newStatus}.`,
      admin: 'Facilities Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    // Update class on select
    selectElement.className = `admin-inline-status ${getStatusClass(newStatus)}`;

    saveMasterReports(allTickets);
    updateMetrics();
    showToast(`Status updated to ${newStatus} for ${ticketId}`);
  }

  // ═══════════════════════════════════════════════
  //  REMARKS MODAL
  // ═══════════════════════════════════════════════
  function openRemarkModal(ticketId) {
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    activeRemarkTicketId = ticketId;
    modalTitle.textContent = `LOG MAINTENANCE REMARK — ${ticket.id}`;
    modalSubtitle.textContent = `${ticket.campus} • ${ticket.category}`;
    modalTextarea.value = '';
    modalPreset.selectedIndex = 0;
    modalPriority.value = ticket.priority || 'Medium';

    // Render remarks history
    const remarks = Array.isArray(ticket.remarks) ? ticket.remarks : [];
    if (remarks.length > 0) {
      modalHistoryWrap.style.display = 'block';
      modalHistoryBox.innerHTML = remarks.map((r) => `
        <div style="margin-bottom:0.45rem; padding-bottom:0.45rem; border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-weight:700; color:#F1F5F9; font-size:0.72rem;">${r.action || 'Remark'}: ${r.note || ''}</div>
          <div class="admin-remark-history-meta">
            <span>${r.admin || 'Facilities Admin'}</span>
            <span>${r.date || ''}</span>
          </div>
        </div>
      `).join('');
    } else {
      modalHistoryWrap.style.display = 'none';
    }

    modalBackdrop.classList.remove('admin-modal-backdrop--hidden');
    modalTextarea.focus();
  }

  function closeRemarkModal() {
    activeRemarkTicketId = null;
    modalBackdrop.classList.add('admin-modal-backdrop--hidden');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeRemarkModal);
  }

  // Robust capture-phase handler for all modal and lightbox close buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('#admin-modal-close') || e.target.closest('.admin-modal-close')) {
      e.preventDefault();
      e.stopPropagation();
      closeRemarkModal();
      return;
    }
    if (e.target.closest('#admin-lightbox-close') || e.target.closest('.lightbox-close-btn')) {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
      return;
    }
  }, true);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeRemarkModal();
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeRemarkTicketId) return;

      const ticket = allTickets.find((t) => t.id === activeRemarkTicketId);
      if (!ticket) return;

      const action = modalPreset.value;
      const priority = modalPriority.value;
      const note = modalTextarea.value.trim() || `${action} filed for facilities review.`;

      ticket.priority = priority;

      // Automatically update status based on certain actions
      if (action === 'Technician Dispatched' || action === 'Inspection Scheduled') {
        ticket.status = 'In Progress';
      } else if (action === 'Resolved On-Site') {
        ticket.status = 'Resolved';
      } else if (action === 'Dismissed - Duplicate') {
        ticket.status = 'Dismissed';
      }

      if (!ticket.remarks) ticket.remarks = [];
      ticket.remarks.unshift({
        action,
        priority,
        note,
        admin: 'Facilities Admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });

      saveMasterReports(allTickets);
      updateMetrics();
      renderTable();
      closeRemarkModal();
      showToast(`Remark saved & reporter notified for ${ticket.id}`);
    });
  }

  // ═══════════════════════════════════════════════
  //  LIGHTBOX
  // ═══════════════════════════════════════════════
  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'Photo Evidence';
    lightbox.classList.remove('modal--hidden');
    lightbox.classList.remove('lightbox-modal--hidden');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('modal--hidden');
    lightbox.classList.add('lightbox-modal--hidden');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  CONTROLS INTERACTION (DROPDOWNS & SEARCH)
  // ═══════════════════════════════════════════════
  // Status dropdown filter
  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      currentStatus = statusSelect.value;
      renderTable();
    });
  }

  // Campus dropdown filter
  if (campusSelect) {
    campusSelect.addEventListener('change', () => {
      currentCampus = campusSelect.value;
      renderTable();
    });
  }

  // Category dropdown filter
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      currentCategory = categorySelect.value;
      renderTable();
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderTable();
    });
  }

  // Keyboard shortcut ESC to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRemarkModal();
      closeLightbox();
    }
  });

  // Initial load
  updateMetrics();
  renderTable();

})();
