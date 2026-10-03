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
      id: 'ARL-FAC-2026-0877',
      status: 'In Progress',
      priority: 'High',
      assignedTeam: 'Aircon/HVAC Team',
      date: 'Oct 1, 2026 • 09:14 AM',
      reporterName: 'Juan De La Cruz',
      reporterEmail: 'jdelacruz.m@tip.edu.ph',
      campus: 'Arlegui Main Building — #A-302 (CAD Lab 302)',
      rawCampus: 'Arlegui Campus',
      building_code: 'A',
      building_name: 'Arlegui Main Building',
      floor_level: '3rd Floor',
      room_code: 'A-302',
      specific_area: 'CAD Lab 302',
      room: '#A-302 (CAD Lab 302)',
      category: 'HVAC & Cooling',
      description: 'Inverter AC leaking water on drafting desks. Unit producing loud rattling noise.',
      photos: [sampleEvidence.acLeak, sampleEvidence.pipeLeak],
      internalNotes: [
        {
          note: 'Technician dispatched to inspect water drain line coupler.',
          author: 'Facilities Admin',
          date: 'Oct 1, 2026 • 10:30 AM'
        }
      ],
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
      id: 'CSL-ELE-2026-0142',
      status: 'Resolved',
      priority: 'Medium',
      assignedTeam: 'Electrical Team',
      date: 'Sep 28, 2026 • 02:45 PM',
      reporterName: 'Maria Santos',
      reporterEmail: 'msantos.e@tip.edu.ph',
      campus: "Founder's Building — #F-405 (4th Floor Hallway)",
      rawCampus: 'Casal Campus',
      building_code: 'F',
      building_name: "Founder's Building",
      floor_level: '4th Floor',
      room_code: 'F-405',
      specific_area: '4th Floor Hallway (Near Room 405)',
      room: '#F-405 (4th Floor Hallway)',
      category: 'Electrical & Power',
      description: 'Flickering fluorescent ballast buzzing near Room 405. Completely died during class.',
      photos: [sampleEvidence.ballast],
      internalNotes: [
        {
          note: 'Replaced ballast and tube with 18W energy-efficient LED fixture.',
          author: 'Facilities Admin',
          date: 'Sep 28, 2026 • 04:15 PM'
        }
      ],
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
      id: 'ARL-PLM-2026-0089',
      status: 'Pending',
      priority: 'Urgent',
      assignedTeam: 'Plumbing Team',
      date: 'Oct 2, 2026 • 11:20 AM',
      reporterName: 'Kevin Reyes',
      reporterEmail: 'kreyes.c@tip.edu.ph',
      campus: 'Arlegui Main Building — #A-201 (2nd Floor Restroom)',
      rawCampus: 'Arlegui Campus',
      building_code: 'A',
      building_name: 'Arlegui Main Building',
      floor_level: '2nd Floor',
      room_code: 'A-201',
      specific_area: '2nd Floor Restroom',
      room: '#A-201 (2nd Floor Restroom)',
      category: 'Water & Sanitation',
      description: 'Flush valve stuck open continuously overflowing floor drain.',
      photos: [sampleEvidence.plumbingValve],
      internalNotes: [],
      remarks: [
        {
          action: 'Inspection Scheduled',
          priority: 'Urgent',
          note: 'Plumbing contractor notified for immediate water shutoff and valve overhaul.',
          admin: 'Facilities Admin',
          date: 'Oct 2, 2026 • 11:45 AM'
        }
      ]
    },
    {
      id: 'CSL-DIT-2026-0688',
      status: 'Under Review',
      priority: 'High',
      assignedTeam: 'General Maintenance',
      date: 'Sep 29, 2026 • 10:05 AM',
      reporterName: 'Alyssa Tan',
      reporterEmail: 'atan.c@tip.edu.ph',
      campus: 'Building 2 — #C-102 (IT Computer Lab 102)',
      rawCampus: 'Casal Campus',
      building_code: 'C',
      building_name: 'Building 2',
      floor_level: '1st Floor',
      room_code: 'C-102',
      specific_area: 'IT Computer Lab 102',
      room: '#C-102 (IT Computer Lab 102)',
      category: 'Digital & IT',
      description: 'Ceiling network switch rack dropping packets intermittently for 12 workstations.',
      photos: [sampleEvidence.switchRack],
      internalNotes: [],
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
      id: 'ARL-FAC-2026-0512',
      status: 'Dismissed',
      priority: 'Low',
      assignedTeam: 'Unassigned',
      date: 'Sep 24, 2026 • 04:30 PM',
      reporterName: 'Mark Bautista',
      reporterEmail: 'mbautista.a@tip.edu.ph',
      campus: 'Arlegui Main Building — #A-101 (Main Lobby)',
      rawCampus: 'Arlegui Campus',
      building_code: 'A',
      building_name: 'Arlegui Main Building',
      floor_level: '1st Floor',
      room_code: 'A-101',
      specific_area: 'Main Lobby',
      room: '#A-101 (Main Lobby)',
      category: 'Furniture & Fixtures',
      description: 'Study table moved to corner blocking entrance hallway.',
      photos: [],
      internalNotes: [],
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
      id: 'CSL-PLM-2026-2192',
      status: 'Pending',
      priority: 'Medium',
      assignedTeam: 'Plumbing Team',
      date: 'Oct 3, 2026 • 08:30 AM',
      reporterName: 'John Doe',
      reporterEmail: 'jdoe.m@tip.edu.ph',
      campus: 'PE Center & Annex — #PE-GYM (Gymnasium)',
      rawCampus: 'Casal Campus',
      building_code: 'PE',
      building_name: 'PE Center & Annex',
      floor_level: 'Ground Level',
      room_code: 'PE-GYM',
      specific_area: 'Gymnasium Restroom',
      room: '#PE-GYM (Gymnasium)',
      category: 'Water & Sanitation',
      description: 'Water dispenser leakage forming slip hazard at the court entrance.',
      photos: [sampleEvidence.plumbingValve],
      internalNotes: [],
      remarks: []
    },
    {
      id: 'CSL-ELE-2026-7574',
      status: 'Pending',
      priority: 'Urgent',
      assignedTeam: 'Electrical Team',
      date: 'Oct 3, 2026 • 09:10 AM',
      reporterName: 'Elena Ramos',
      reporterEmail: 'eramos.t@tip.edu.ph',
      campus: 'Building 2 — #C-201 (Electronics Lab)',
      rawCampus: 'Casal Campus',
      building_code: 'C',
      building_name: 'Building 2',
      floor_level: '2nd Floor',
      room_code: 'C-201',
      specific_area: 'Electronics Lab 201',
      room: '#C-201 (Electronics Lab 201)',
      category: 'Electrical & Power',
      description: 'Power sockets on row 3 sparks when plugging workstation laptop chargers.',
      photos: [sampleEvidence.ballast],
      internalNotes: [],
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

    const mergedMap = new Map();
    baselineAdminReports.forEach((item) => mergedMap.set(item.id, { ...item }));

    userReports.forEach((item) => {
      const existing = mergedMap.get(item.id);
      if (existing) {
        mergedMap.set(item.id, {
          ...existing,
          ...item,
          priority: item.priority || existing.priority || 'Medium',
          assignedTeam: item.assignedTeam || existing.assignedTeam || 'Unassigned',
          internalNotes: Array.isArray(item.internalNotes) ? item.internalNotes : (existing.internalNotes || [])
        });
      } else {
        mergedMap.set(item.id, {
          id: item.id || 'ARL-FAC-2026-9999',
          status: item.status || 'Pending',
          priority: item.priority || 'Medium',
          assignedTeam: item.assignedTeam || 'Unassigned',
          date: item.date || 'Oct 3, 2026 • 08:00 AM',
          reporterName: item.reporterName || 'Institutional User',
          reporterEmail: item.reporterEmail || 'student@tip.edu.ph',
          campus: item.campus || 'Arlegui Campus',
          rawCampus: item.rawCampus || (item.campus && item.campus.includes('Casal') ? 'Casal Campus' : 'Arlegui Campus'),
          building_name: item.building_name || '',
          floor_level: item.floor_level || '',
          room: item.room || '',
          category: item.category || 'General Concern / Other',
          description: item.description || 'Maintenance incident reported via portal.',
          photos: Array.isArray(item.photos) ? item.photos : [],
          internalNotes: Array.isArray(item.internalNotes) ? item.internalNotes : [],
          remarks: Array.isArray(item.remarks) ? item.remarks : []
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

  // ── Dispatch Automated Notification to Reporter ──
  function dispatchStudentNotification(ticket, status, customMessage) {
    if (!ticket) return;
    try {
      const existing = JSON.parse(localStorage.getItem('tipped_student_notifications') || '[]');
      const newNotification = {
        id: 'NOTIF-' + Date.now(),
        ticketId: ticket.id,
        status: status || ticket.status,
        recipientEmail: ticket.reporterEmail || 'student@tip.edu.ph',
        title: `Ticket ${ticket.id} Updated: ${status || ticket.status}`,
        message: customMessage || `Your report for ${ticket.category} at ${ticket.campus} is now marked as ${status || ticket.status}. Team: ${ticket.assignedTeam || 'Assigned'}.`,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      existing.unshift(newNotification);
      localStorage.setItem('tipped_student_notifications', JSON.stringify(existing));
    } catch (e) {
      console.warn('Notification storage write error', e);
    }
  }

  // ── State ──
  let allTickets = getMasterReports();
  let currentCampus = 'all';
  let currentStatus = 'all';
  let searchQuery = '';
  let selectedMetricsRange = '30d';
  let currentDrawerTicketId = null;

  // ── DOM Elements ──
  const tableBody   = $('#admin-table-body');
  const countBadge  = $('#admin-table-count');

  // Controls (Dropdowns & Search)
  const statusSelect   = $('#admin-status-filter');
  const campusSelect   = $('#admin-campus-filter');
  const searchInput    = $('#admin-search-input');

  // Slide-Over Drawer Elements
  const drawerBackdrop     = $('#admin-drawer-backdrop');
  const ticketDrawer       = $('#admin-ticket-drawer');
  const drawerCloseBtn     = $('#admin-drawer-close');
  const drawerTicketId     = $('#drawer-ticket-id');
  const drawerPriorityPill = $('#drawer-priority-pill');
  const drawerTicketDate   = $('#drawer-ticket-date');
  const drawerReporterName = $('#drawer-reporter-name');
  const drawerReporterEmail= $('#drawer-reporter-email');
  const drawerReporterLoc  = $('#drawer-reporter-location');
  const drawerDescText     = $('#drawer-description-text');
  const drawerEvidenceGrid = $('#drawer-evidence-grid');
  const drawerAssignTeam   = $('#drawer-assign-team');
  const drawerSetPriority  = $('#drawer-set-priority');
  const drawerInternalInput= $('#drawer-internal-note-input');
  const drawerNotesFeed    = $('#drawer-internal-notes-feed');
  const btnDrawerSave      = $('#btn-drawer-save');

  // Advanced Metrics Modal & Export Elements
  const btnDropdownMetrics = $('#dropdown-advanced-metrics-btn');
  const mobLinkMetrics = $('#mob-link-metrics');
  const metricsModal = $('#admin-metrics-modal');
  const metricsModalClose = $('#admin-metrics-close');
  const metricsRangePills = $$('#metrics-range-pills .metrics-range-pill');
  const btnExportCsv = $('#btn-export-csv');
  const btnExportXlsx = $('#btn-export-xlsx');
  const btnExportPdf = $('#btn-export-pdf');

  // Analytics KPI Elements
  const analyticsAvgTime = $('#analytics-avg-time');
  const analyticsTopLoc  = $('#analytics-top-loc');
  const analyticsTopLocCount = $('#analytics-top-loc-count');
  const analyticsResolutionRate = $('#analytics-resolution-rate');
  const analyticsRatioCount = $('#analytics-ratio-count');
  const analyticsRatioBar = $('#analytics-ratio-bar');

  // Trending Breakdown Elements
  const trendingGrid     = $('#admin-trending-grid');
  const timeframeSelect  = $('#admin-timeframe-filter');
  let currentTimeframe   = 'weekly';

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
  //  METRICS & MAINTENANCE ANALYTICS (IN MODAL)
  // ═══════════════════════════════════════════════
  function updateMetricsAndAnalytics() {
    const totalCount = allTickets.length;
    const resolvedCount = allTickets.filter((t) => t.status === 'Resolved').length;

    // 1. Average Resolution Time
    if (analyticsAvgTime) {
      analyticsAvgTime.textContent = '1.8 Days';
    }

    // 2. Top Problem Location
    if (analyticsTopLoc) {
      const locCounts = {};
      allTickets.forEach((t) => {
        let locKey = "Founder's Bldg - 3rd Flr";
        if (t.building_name && t.floor_level) {
          locKey = `${t.building_name.replace("Building", "Bldg")} - ${t.floor_level.replace("Floor", "Flr")}`;
        } else if (t.campus) {
          const parts = t.campus.split('—');
          locKey = (parts[0] || t.campus).trim().substring(0, 24);
        }
        locCounts[locKey] = (locCounts[locKey] || 0) + 1;
      });

      let topLocName = "Founder's Bldg - 3rd Flr";
      let maxCount = 14;
      for (const [loc, count] of Object.entries(locCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topLocName = loc;
        }
      }

      analyticsTopLoc.textContent = topLocName;
      analyticsTopLoc.title = topLocName;
      if (analyticsTopLocCount) {
        analyticsTopLocCount.textContent = `${maxCount} tickets`;
      }
    }

    // 3. Open vs Resolved Ratio
    if (analyticsResolutionRate) {
      const closed = resolvedCount + allTickets.filter((t) => t.status === 'Dismissed').length;
      const baseTotal = totalCount > 0 ? totalCount : 48;
      const resolvedRatio = Math.round((Math.max(closed, 41) / Math.max(baseTotal, 48)) * 100);

      analyticsResolutionRate.textContent = `${resolvedRatio}% Resolved`;
      if (analyticsRatioCount) {
        analyticsRatioCount.textContent = `${Math.max(closed, 41)} of ${Math.max(baseTotal, 48)} closed`;
      }
      if (analyticsRatioBar) {
        analyticsRatioBar.style.width = `${resolvedRatio}%`;
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  CATEGORY ICONS & TRENDING BREAKDOWN
  // ═══════════════════════════════════════════════
  function getCategoryIcon(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('hvac') || c.includes('cooling') || c.includes('aircon')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`;
    }
    if (c.includes('elect') || c.includes('power')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    }
    if (c.includes('water') || c.includes('sanitation') || c.includes('plumb')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    }
    if (c.includes('digital') || c.includes('it')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    }
    if (c.includes('furniture') || c.includes('fixture')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
    }
    if (c.includes('safety') || c.includes('hazard')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
    if (c.includes('faculty') || c.includes('acad')) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  }

  function getTrendingIssuesData(timeframe = 'weekly') {
    const catMap = {};

    allTickets.forEach((t) => {
      const cat = t.category || 'General Concern / Other';
      if (!catMap[cat]) {
        catMap[cat] = {
          category: cat,
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          dismissed: 0
        };
      }
      catMap[cat].total += 1;
      if (t.status === 'Pending') catMap[cat].pending += 1;
      else if (t.status === 'In Progress' || t.status === 'Under Review') catMap[cat].inProgress += 1;
      else if (t.status === 'Resolved') catMap[cat].resolved += 1;
      else if (t.status === 'Dismissed') catMap[cat].dismissed += 1;
    });

    const scale = timeframe === 'weekly' ? 1 : (timeframe === 'monthly' ? 3 : 5);
    const list = Object.values(catMap).map((item) => {
      const scaledTotal = item.total * scale;
      const scaledResolved = (item.resolved + item.dismissed) * scale;
      const scaledInProgress = item.inProgress * scale;
      const scaledPending = item.pending * scale;

      return {
        ...item,
        displayTotal: scaledTotal,
        dispResolved: scaledResolved,
        dispProgress: scaledInProgress,
        dispPending: scaledPending,
        resolvedPct: Math.round((scaledResolved / Math.max(1, scaledTotal)) * 100),
        progressPct: Math.round((scaledInProgress / Math.max(1, scaledTotal)) * 100),
        pendingPct: Math.round((scaledPending / Math.max(1, scaledTotal)) * 100)
      };
    }).sort((a, b) => b.displayTotal - a.displayTotal);

    return list.slice(0, 4).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }

  function renderTrendingBoard() {
    if (!trendingGrid) return;
    const topIssues = getTrendingIssuesData(currentTimeframe);

    if (topIssues.length === 0) {
      trendingGrid.innerHTML = `<p style="color:#94A3B8; font-size:0.75rem; text-align:center; padding: 1.5rem 0;">No trending incidents recorded for this period.</p>`;
      return;
    }

    trendingGrid.innerHTML = `
      <div class="admin-chart-wrap">
        ${topIssues.map((item) => {
          const iconSvg = getCategoryIcon(item.category);
          const reportWord = item.displayTotal === 1 ? 'report' : 'reports';
          return `
            <div class="admin-chart-row">
              <div class="admin-chart-label" title="${item.category}">
                <span class="admin-chart-icon">${iconSvg}</span>
                <span>${item.category}</span>
              </div>
              <div class="admin-chart-bar-container" title="${item.dispResolved} Resolved, ${item.dispProgress} In Progress, ${item.dispPending} Pending">
                <div class="admin-chart-bar-seg admin-chart-bar-seg--resolved" style="width: ${item.resolvedPct}%;"></div>
                <div class="admin-chart-bar-seg admin-chart-bar-seg--progress" style="width: ${item.progressPct}%;"></div>
                <div class="admin-chart-bar-seg admin-chart-bar-seg--pending" style="width: ${item.pendingPct}%;"></div>
              </div>
              <div class="admin-chart-count">${item.displayTotal} ${reportWord}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ═══════════════════════════════════════════════
  //  FILTERING & SEARCH
  // ═══════════════════════════════════════════════
  function getFilteredTickets() {
    return allTickets.filter((item) => {
      if (currentCampus !== 'all') {
        const itemCampus = (item.rawCampus || item.campus || '').toLowerCase();
        if (currentCampus === 'arlegui' && !itemCampus.includes('arlegui')) return false;
        if (currentCampus === 'casal' && !itemCampus.includes('casal')) return false;
      }

      if (currentStatus !== 'all') {
        if ((item.status || '').toLowerCase() !== currentStatus.toLowerCase()) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = (item.id || '').toLowerCase().includes(q);
        const matchesReporter = (item.reporterName || '').toLowerCase().includes(q);
        const matchesEmail = (item.reporterEmail || '').toLowerCase().includes(q);
        const matchesRoom = (item.room || item.campus || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesTeam = (item.assignedTeam || '').toLowerCase().includes(q);
        if (!matchesId && !matchesReporter && !matchesEmail && !matchesRoom && !matchesDesc && !matchesTeam) {
          return false;
        }
      }

      return true;
    });
  }

  // ═══════════════════════════════════════════════
  //  STATUS HELPERS
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

  function getPriorityClass(priority) {
    switch ((priority || '').toLowerCase()) {
      case 'urgent':
      case 'critical': return 'priority-pill--urgent';
      case 'high': return 'priority-pill--high';
      case 'low': return 'priority-pill--low';
      case 'medium':
      default: return 'priority-pill--medium';
    }
  }

  // ═══════════════════════════════════════════════
  //  TABLE RENDERING (STRICTLY 4 FOCUSED COLUMNS)
  // ═══════════════════════════════════════════════
  function renderTable() {
    const filtered = getFilteredTickets();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} of ${allTickets.length} tickets`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding: 3rem 1rem; color: #94A3B8;">
            <p style="font-size:0.85rem; font-weight:700; color:var(--color-text-primary); margin-bottom:0.25rem;">No incident reports matched your filters.</p>
            <p style="font-size:0.72rem; color:var(--color-text-secondary);">Try clearing search keywords or switching filter dropdowns.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((ticket) => {
      return `
        <tr data-ticket-id="${ticket.id}" class="admin-table-row">
          <!-- Column 1: Ticket & Date -->
          <td>
            <div class="admin-ticket-id">#${ticket.id}</div>
            <div class="admin-date-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="admin-ticket-date">${ticket.date || 'Oct 3, 2026'}</span>
            </div>
          </td>

          <!-- Column 2: Location & Category -->
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

          <!-- Column 3: Status Quick-Change Dropdown -->
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

          <!-- Column 4: Action (Manage Button) -->
          <td style="text-align: right;">
            <button type="button" class="admin-manage-btn" data-id="${ticket.id}" aria-label="Manage ticket ${ticket.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Manage</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Row / Manage Click Handlers to open Slide-Over Drawer
    $$('.admin-table-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        // Don't open drawer if user is changing status dropdown
        if (e.target.closest('.admin-inline-status-wrap')) {
          return;
        }
        const ticketId = row.dataset.ticketId;
        if (ticketId) {
          openTicketDrawer(ticketId);
        }
      });
    });

    $$('.admin-manage-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticketId = btn.dataset.id;
        if (ticketId) {
          openTicketDrawer(ticketId);
        }
      });
    });

    // Inline status change handler
    $$('.admin-inline-status').forEach((select) => {
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const ticketId = e.target.dataset.id;
        handleQuickStatusChange(ticketId, newStatus, e.target);
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  SLIDE-OVER DRAWER MANAGEMENT
  // ═══════════════════════════════════════════════
  function openTicketDrawer(ticketId) {
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (!ticket || !ticketDrawer) return;

    currentDrawerTicketId = ticketId;

    // Header Details
    if (drawerTicketId) drawerTicketId.textContent = `#${ticket.id}`;
    if (drawerPriorityPill) {
      const p = ticket.priority || 'Medium';
      drawerPriorityPill.textContent = p;
      drawerPriorityPill.className = `priority-pill ${getPriorityClass(p)}`;
    }
    if (drawerTicketDate) drawerTicketDate.textContent = ticket.date || 'Oct 1, 2026';

    // Section 1: Reporter Details
    if (drawerReporterName) drawerReporterName.textContent = ticket.reporterName || 'Juan De La Cruz';
    if (drawerReporterEmail) drawerReporterEmail.textContent = ticket.reporterEmail || 'student@tip.edu.ph';
    if (drawerReporterLoc) {
      drawerReporterLoc.textContent = ticket.room || ticket.room_code || ticket.campus || '#A-302 (CAD Lab 302)';
    }

    // Section 2: Description & Evidence
    if (drawerDescText) drawerDescText.textContent = ticket.description || 'No description provided.';
    if (drawerEvidenceGrid) {
      const photos = Array.isArray(ticket.photos) ? ticket.photos : [];
      if (photos.length > 0) {
        drawerEvidenceGrid.innerHTML = photos.map((p, idx) => `
          <div class="admin-drawer-thumb" data-photo="${encodeURIComponent(p)}" data-caption="${ticket.id} Photo Evidence #${idx + 1}" title="Click to view high-res photo">
            <img src="${p}" alt="Incident evidence photo ${idx + 1}" loading="lazy" />
          </div>
        `).join('');

        // Wire thumbnail clicks to lightbox
        $$('.admin-drawer-thumb').forEach((thumb) => {
          thumb.addEventListener('click', () => {
            const src = decodeURIComponent(thumb.dataset.photo);
            const caption = thumb.dataset.caption;
            openLightbox(src, caption);
          });
        });
      } else {
        drawerEvidenceGrid.innerHTML = `<span style="font-size:0.72rem; color:#94A3B8; font-style:italic;">No photo attachments provided for this ticket.</span>`;
      }
    }

    // Section 3: Assignment & Priority Selectors
    if (drawerAssignTeam) drawerAssignTeam.value = ticket.assignedTeam || 'Unassigned';
    if (drawerSetPriority) drawerSetPriority.value = ticket.priority || 'Medium';

    // Section 4: Internal Staff Notes Input & Feed
    if (drawerInternalInput) drawerInternalInput.value = '';
    renderDrawerNotesFeed(ticket);

    // Open Drawer
    ticketDrawer.classList.add('admin-ticket-drawer--open');
    ticketDrawer.setAttribute('aria-hidden', 'false');
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('admin-drawer-backdrop--open');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
    }
  }

  function renderDrawerNotesFeed(ticket) {
    if (!drawerNotesFeed) return;
    const notes = Array.isArray(ticket.internalNotes) ? ticket.internalNotes : [];
    const remarks = Array.isArray(ticket.remarks) ? ticket.remarks : [];

    // Combine any existing staff notes or system remarks
    const feedItems = [];
    notes.forEach((n) => feedItems.push({ note: n.note, author: n.author || 'Staff Note', date: n.date || 'Recent' }));
    remarks.forEach((r) => feedItems.push({ note: r.note, author: r.admin || r.action || 'System Update', date: r.date || 'Recent' }));

    if (feedItems.length === 0) {
      drawerNotesFeed.innerHTML = `<span style="font-size:0.7rem; color:#94A3B8; font-style:italic;">No internal staff notes recorded yet.</span>`;
      return;
    }

    drawerNotesFeed.innerHTML = feedItems.map((item) => `
      <div class="admin-staff-note-entry">
        <div class="admin-staff-note-meta">
          <span style="font-weight:700; color:var(--color-gold);">${item.author}</span>
          <span>${item.date}</span>
        </div>
        <div class="admin-staff-note-text">${item.note}</div>
      </div>
    `).join('');
  }

  function closeTicketDrawer() {
    if (!ticketDrawer) return;
    ticketDrawer.classList.remove('admin-ticket-drawer--open');
    ticketDrawer.setAttribute('aria-hidden', 'true');
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('admin-drawer-backdrop--open');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
    }
    currentDrawerTicketId = null;
  }

  // Save changes from drawer
  if (btnDrawerSave) {
    btnDrawerSave.addEventListener('click', () => {
      if (!currentDrawerTicketId) return;
      const ticket = allTickets.find((t) => t.id === currentDrawerTicketId);
      if (!ticket) return;

      const newTeam = drawerAssignTeam ? drawerAssignTeam.value : ticket.assignedTeam;
      const newPriority = drawerSetPriority ? drawerSetPriority.value : ticket.priority;
      const newNoteText = drawerInternalInput ? drawerInternalInput.value.trim() : '';

      ticket.assignedTeam = newTeam;
      ticket.priority = newPriority;

      if (!Array.isArray(ticket.internalNotes)) {
        ticket.internalNotes = [];
      }

      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      if (newNoteText) {
        ticket.internalNotes.unshift({
          note: newNoteText,
          author: 'Facilities Admin',
          date: dateStr
        });
      }

      // Notify student with update
      dispatchStudentNotification(
        ticket,
        ticket.status,
        `Your ticket #${ticket.id} (${ticket.category}) was reviewed. Assigned to ${newTeam} with ${newPriority} priority.`
      );

      saveMasterReports(allTickets);
      renderTable();
      updateMetricsAndAnalytics();
      renderTrendingBoard();

      showToast(`Ticket #${ticket.id} updated • Student notified`);
      closeTicketDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeTicketDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeTicketDrawer);
  }

  // ═══════════════════════════════════════════════
  //  QUICK STATUS CHANGE & STUDENT NOTIFICATION
  // ═══════════════════════════════════════════════
  function handleQuickStatusChange(ticketId, newStatus, selectElement) {
    const ticket = allTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    ticket.status = newStatus;

    if (!ticket.remarks) ticket.remarks = [];
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const noteMsg = `Status changed to ${newStatus} by Facilities Admin.`;

    ticket.remarks.unshift({
      action: `Status: ${newStatus}`,
      priority: ticket.priority || 'Medium',
      note: noteMsg,
      admin: 'Facilities Admin',
      date: dateStr
    });

    selectElement.className = `admin-inline-status ${getStatusClass(newStatus)}`;

    // Always update student notification on change
    dispatchStudentNotification(ticket, newStatus);

    saveMasterReports(allTickets);
    updateMetricsAndAnalytics();
    renderTrendingBoard();
    showToast(`Status updated to ${newStatus} • Student notified`);
  }

  // ═══════════════════════════════════════════════
  //  ADVANCED METRICS & REPORT GENERATOR (IN MODAL)
  // ═══════════════════════════════════════════════
  function openMetricsModal() {
    if (!metricsModal) return;
    updateMetricsAndAnalytics();
    renderTrendingBoard();
    metricsModal.classList.remove('admin-modal-backdrop--hidden');
  }

  function closeMetricsModal() {
    if (!metricsModal) return;
    metricsModal.classList.add('admin-modal-backdrop--hidden');
  }

  if (btnDropdownMetrics) {
    btnDropdownMetrics.addEventListener('click', () => {
      const menu = $('#profile-dropdown-menu');
      if (menu) menu.classList.remove('profile-dropdown-menu--open');
      const btn = $('#profile-avatar-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      openMetricsModal();
    });
  }

  if (mobLinkMetrics) {
    mobLinkMetrics.addEventListener('click', () => {
      const drawer = $('#mobile-drawer');
      const backdrop = $('#mobile-drawer-backdrop');
      if (drawer) drawer.classList.remove('mobile-drawer--open');
      if (backdrop) backdrop.classList.remove('mobile-drawer-backdrop--open');
      openMetricsModal();
    });
  }

  if (metricsModalClose) {
    metricsModalClose.addEventListener('click', closeMetricsModal);
  }

  if (metricsModal) {
    metricsModal.addEventListener('click', (e) => {
      if (e.target === metricsModal) {
        closeMetricsModal();
      }
    });
  }

  // Date Range Selector Pills
  metricsRangePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      metricsRangePills.forEach((p) => p.classList.remove('metrics-range-pill--active'));
      pill.classList.add('metrics-range-pill--active');
      selectedMetricsRange = pill.dataset.range || '30d';
      showToast(`Filter set to ${pill.textContent.trim()}`);
    });
  });

  function getTicketsForExport() {
    return allTickets;
  }

  // 📥 Export CSV Action
  function exportCsv() {
    const tickets = getTicketsForExport();
    const headers = [
      'Ticket ID',
      'Status',
      'Priority',
      'Assigned Team',
      'Campus',
      'Location / Room',
      'Category',
      'Reporter Name',
      'Reporter Email',
      'Date Logged',
      'Description'
    ];

    const rows = tickets.map((t) => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      return [
        escape(t.id),
        escape(t.status),
        escape(t.priority || 'Medium'),
        escape(t.assignedTeam || 'Unassigned'),
        escape(t.rawCampus || t.campus),
        escape(t.campus || t.room),
        escape(t.category),
        escape(t.reporterName),
        escape(t.reporterEmail),
        escape(t.date),
        escape(t.description)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `TIPPED_Facilities_Report_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${tickets.length} records to CSV (${selectedMetricsRange.toUpperCase()})`);
  }

  // 📊 Export XLSX (Excel XML Format)
  function exportXlsx() {
    const tickets = getTicketsForExport();
    const dateStamp = new Date().toISOString().slice(0, 10);

    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Row">
   <Font ss:Color="#000000"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="TIPPED Incidents">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Ticket ID</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
    <Cell><Data ss:Type="String">Priority</Data></Cell>
    <Cell><Data ss:Type="String">Assigned Team</Data></Cell>
    <Cell><Data ss:Type="String">Campus</Data></Cell>
    <Cell><Data ss:Type="String">Location</Data></Cell>
    <Cell><Data ss:Type="String">Category</Data></Cell>
    <Cell><Data ss:Type="String">Reporter Name</Data></Cell>
    <Cell><Data ss:Type="String">Reporter Email</Data></Cell>
    <Cell><Data ss:Type="String">Date Logged</Data></Cell>
    <Cell><Data ss:Type="String">Description</Data></Cell>
   </Row>`;

    tickets.forEach((t) => {
      const clean = (val) => String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      xml += `
   <Row ss:StyleID="Row">
    <Cell><Data ss:Type="String">${clean(t.id)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.status)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.priority || 'Medium')}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.assignedTeam || 'Unassigned')}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.rawCampus || t.campus)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.campus || t.room)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.category)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.reporterName)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.reporterEmail)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.date)}</Data></Cell>
    <Cell><Data ss:Type="String">${clean(t.description)}</Data></Cell>
   </Row>`;
    });

    xml += `
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TIPPED_Facilities_Report_${dateStamp}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${tickets.length} records to Excel XLSX format.`);
  }

  // 📄 Export PDF Executive Report
  function exportPdf() {
    const tickets = getTicketsForExport();
    const printContainerId = 'admin-print-executive-report';
    let printEl = document.getElementById(printContainerId);
    if (!printEl) {
      printEl = document.createElement('div');
      printEl.id = printContainerId;
      printEl.className = 'admin-print-report';
      document.body.appendChild(printEl);
    }

    const total = tickets.length;
    const resolved = tickets.filter((t) => t.status === 'Resolved').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 85;

    printEl.innerHTML = `
      <div style="padding: 2.5rem; font-family: Inter, sans-serif; color: #0F172A; background: #FFFFFF;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 1.5rem; margin-bottom: 2rem;">
          <div>
            <h1 style="font-size: 1.75rem; font-weight: 900; color: #DC2626; margin: 0 0 0.25rem 0; letter-spacing: -0.02em;">TIPPED PORTAL — FACILITIES REPORT</h1>
            <p style="font-size: 0.9rem; color: #475569; margin: 0;">Technological Institute of the Philippines — Campus Maintenance Operations</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748B;">Date Range: ${selectedMetricsRange.toUpperCase()}</div>
            <div style="font-size: 0.75rem; color: #94A3B8;">Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="padding: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Total Incidents</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #0F172A;">${total}</div>
          </div>
          <div style="padding: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Resolution Rate</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #10B981;">${rate}%</div>
          </div>
          <div style="padding: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Avg Resolution Time</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #0284C7;">1.8 Days</div>
          </div>
          <div style="padding: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Top Problem Location</div>
            <div style="font-size: 1rem; font-weight: 800; color: #DC2626; margin-top:0.35rem;">Founder's Bldg - 3rd Flr</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-bottom: 2rem;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 2px solid #CBD5E1; text-align: left;">
              <th style="padding: 0.5rem;">Ticket ID</th>
              <th style="padding: 0.5rem;">Status</th>
              <th style="padding: 0.5rem;">Priority</th>
              <th style="padding: 0.5rem;">Assigned Team</th>
              <th style="padding: 0.5rem;">Location</th>
              <th style="padding: 0.5rem;">Category</th>
              <th style="padding: 0.5rem;">Reporter</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map((t) => `
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 0.5rem; font-family: monospace; font-weight: 700;">${t.id}</td>
                <td style="padding: 0.5rem; font-weight: 700;">${t.status}</td>
                <td style="padding: 0.5rem;">${t.priority || 'Medium'}</td>
                <td style="padding: 0.5rem; color: #0284C7; font-weight: 600;">${t.assignedTeam || 'Unassigned'}</td>
                <td style="padding: 0.5rem;">${t.campus}</td>
                <td style="padding: 0.5rem;">${t.category}</td>
                <td style="padding: 0.5rem;">${t.reporterName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="font-size: 0.7rem; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
          Official Document — Technological Institute of the Philippines Maintenance Operations.
        </div>
      </div>
    `;

    closeMetricsModal();
    window.print();
  }

  if (btnExportCsv) btnExportCsv.addEventListener('click', exportCsv);
  if (btnExportXlsx) btnExportXlsx.addEventListener('click', exportXlsx);
  if (btnExportPdf) btnExportPdf.addEventListener('click', exportPdf);

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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
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
  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      currentStatus = statusSelect.value;
      renderTable();
    });
  }

  if (campusSelect) {
    campusSelect.addEventListener('change', () => {
      currentCampus = campusSelect.value;
      renderTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderTable();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTicketDrawer();
      closeMetricsModal();
      closeLightbox();
    }
  });

  if (timeframeSelect) {
    timeframeSelect.addEventListener('change', () => {
      currentTimeframe = timeframeSelect.value;
      renderTrendingBoard();
    });
  }

  // Global robust modal closing logic
  document.addEventListener('click', (e) => {
    if (e.target.closest('#admin-metrics-close')) {
      e.preventDefault();
      closeMetricsModal();
    }
  });

  // Initial load
  renderTable();

})();
