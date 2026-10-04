/**
 * TIPPED — Incident & Report Controller
 * File: controllers/reportController.js
 */

const { Incident, Report } = require('../models/tipped-mongoose-models');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const OFFICIAL_TEAMS = ['ITSO', 'Maintenance', 'SOHAS', 'Canteen Staff', 'OSA', 'Guidance', 'Unassigned'];

/**
 * Helper to generate random/sequential Ticket ID
 */
const generateTicketId = (campus) => {
  const prefix = campus === 'Casal' ? 'CAS-FAC' : 'ARL-FAC';
  const year = new Date().getFullYear();
  const randNum = String(Math.floor(100 + Math.random() * 900));
  return `#${prefix}-${year}-${randNum}`;
};

/**
 * Helper for Automatic Ticket Routing on Creation
 * Digital & IT -> ITSO
 * Electrical & Power | HVAC & Cooling | Water & Sanitation -> Maintenance
 * Safety & Security | Life Safety & Hazards -> SOHAS
 * Canteen | Canteen Area -> Canteen Staff
 * Default -> Unassigned
 */
const getAutoAssignedTeam = (category = '') => {
  const cat = (category || '').trim();

  if (cat === 'Digital & IT') {
    return 'ITSO';
  }
  if (cat === 'Electrical & Power' || cat === 'HVAC & Cooling' || cat === 'Water & Sanitation' || cat === 'Facilities' || cat === 'Furniture & Fixtures') {
    return 'Maintenance';
  }
  if (cat === 'Safety & Security' || cat === 'Life Safety & Hazards') {
    return 'SOHAS';
  }
  if (cat === 'Canteen' || cat === 'Canteen Area') {
    return 'Canteen Staff';
  }
  return 'Unassigned';
};

/**
 * @route   POST /api/reports / POST /api/incidents
 * @desc    Submit a new incident or facility report with automatic ticket routing
 * @access  Private (Registered Users)
 */
exports.createReport = asyncHandler(async (req, res, next) => {
  const {
    category,
    campus,
    roomCode,
    floorLevel,
    roomArea,
    landmark,
    description,
    imageUrls,
    evidencePhotos,
    priority,
    priorityLevel
  } = req.body;

  // Validate campus constraint
  if (!campus || !['Arlegui', 'Casal'].includes(campus)) {
    return next(new AppError('Campus location must be either Arlegui or Casal.', 400));
  }

  const room = (roomCode || roomArea || '').trim();
  if (!room) {
    return next(new AppError('Room code or location is required.', 400));
  }

  if (!description || !description.trim()) {
    return next(new AppError('Problem description is required.', 400));
  }

  const photos = Array.isArray(evidencePhotos) ? evidencePhotos : (Array.isArray(imageUrls) ? imageUrls : []);

  const ticketId = generateTicketId(campus);
  const reporterId = req.user ? (req.user.userId || req.user.id) : null;

  // Automatic ticket routing on creation
  const determinedTeam = req.body.assignedTeam && OFFICIAL_TEAMS.includes(req.body.assignedTeam)
    ? req.body.assignedTeam
    : getAutoAssignedTeam(category);

  const incident = await Incident.create({
    ticketId,
    reporter: reporterId,
    reporterId: reporterId,
    campus,
    roomCode: room,
    category: category || 'Facilities',
    status: 'Pending',
    priority: priority || priorityLevel || 'Medium',
    assignedTeam: determinedTeam,
    description: description.trim(),
    evidencePhotos: photos,
    imageUrls: photos,
    location: {
      campus,
      floorLevel: floorLevel || '',
      roomArea: room,
      landmark: landmark || ''
    }
  });

  res.status(201).json({
    success: true,
    message: 'Incident report filed successfully.',
    report: incident,
    incident
  });
});

/**
 * @route   GET /api/reports / GET /api/admin/reports
 * @desc    Get reports with department scoping (Staff: scoped to their dept, Admin: all tickets)
 * @access  Private
 */
exports.getReports = asyncHandler(async (req, res, next) => {
  const department = req.user?.department || 'ALL';
  const role = (req.user?.role || 'staff').toLowerCase();

  let filter = {};

  // If filtered for user's own reports (Student view)
  const { campus, status, category, team, search, reporterId, myReports } = req.query;
  if (reporterId) {
    filter.$or = [{ reporter: reporterId }, { reporterId: reporterId }];
  } else if (myReports === 'true' && req.user) {
    const uId = req.user.userId || req.user.id;
    filter.$or = [{ reporter: uId }, { reporterId: uId }];
  } else if (role !== 'admin' && department !== 'ALL') {
    let scopedTeam = 'ITSO';
    if (department.includes('IT') || department.includes('ITSO')) scopedTeam = 'ITSO';
    else if (department.includes('Maintenance') || department.includes('Facilities')) scopedTeam = 'Maintenance';
    else if (department.includes('SOHAS') || department.includes('Security') || department.includes('Health')) scopedTeam = 'SOHAS';
    else if (department.includes('Canteen')) scopedTeam = 'Canteen Staff';
    else if (department.includes('OSA') || department.includes('Student Affairs')) scopedTeam = 'OSA';
    else if (department.includes('Guidance')) scopedTeam = 'Guidance';
    else scopedTeam = department;

    filter.assignedTeam = scopedTeam;
  }

  if (campus && campus !== 'All' && campus !== 'all') {
    filter.campus = campus === 'arlegui' ? 'Arlegui' : (campus === 'casal' ? 'Casal' : campus);
  }

  if (status && status !== 'All' && status !== 'all') {
    filter.status = status;
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (team && team !== 'All') {
    filter.assignedTeam = team;
  }

  if (search) {
    const searchFilter = [
      { ticketId: { $regex: search, $options: 'i' } },
      { roomCode: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
      delete filter.$or;
    } else {
      filter.$or = searchFilter;
    }
  }

  const tickets = (await Incident.find(filter)
    .populate('reporter', 'fullName email tipEmail department')
    .populate('reporterId', 'fullName email tipEmail department')
    .sort({ createdAt: -1 })) || [];

  return res.status(200).json(tickets);
});

/**
 * @route   GET /api/reports/stats / GET /api/analytics/metrics
 * @desc    Get dashboard metrics & analytics with role and department scoping
 * @access  Private (Staff / Admin)
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const { campus } = req.query;
  let matchQuery = {};

  // Department Scoping for Staff vs Admin
  if (req.user && (req.user.role || '').toLowerCase() === 'staff') {
    const staffDept = req.user.department || '';
    let scopedTeam = 'ITSO';
    if (staffDept.includes('IT') || staffDept.includes('ITSO')) scopedTeam = 'ITSO';
    else if (staffDept.includes('Maintenance') || staffDept.includes('Facilities')) scopedTeam = 'Maintenance';
    else if (staffDept.includes('SOHAS') || staffDept.includes('Security') || staffDept.includes('Health')) scopedTeam = 'SOHAS';
    else if (staffDept.includes('Canteen')) scopedTeam = 'Canteen Staff';
    else if (staffDept.includes('OSA') || staffDept.includes('Student Affairs')) scopedTeam = 'OSA';
    else if (staffDept.includes('Guidance')) scopedTeam = 'Guidance';
    else scopedTeam = staffDept;

    matchQuery.assignedTeam = scopedTeam;
  }

  if (campus && campus !== 'All') {
    matchQuery.campus = campus;
  }

  const totalTickets = await Incident.countDocuments(matchQuery);

  const scopeLabel = req.user && (req.user.role || '').toLowerCase() === 'staff' 
    ? `${req.user.department || 'Department'} Scope` 
    : 'System-Wide Admin Scope';

  if (totalTickets === 0) {
    const zeroStats = {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      underReview: 0,
      total: 0,
      totalTickets: 0,
      closedTickets: 0,
      categories: {},
      topLocation: { room: 'None', count: 0 },
      topLocationName: 'None',
      topLocationCount: 0,
      avgResolutionTime: 0,
      avgResolutionTimeFormatted: '0.0 Days',
      resolvedPercentage: 0,
      resolutionRate: '0%',
      teams: {}
    };

    return res.status(200).json({
      success: true,
      scope: scopeLabel,
      avgResolutionTime: 0,
      topLocation: 'None',
      topLocationCount: 0,
      resolvedPercentage: 0,
      totalTickets: 0,
      closedTickets: 0,
      stats: zeroStats,
      metrics: zeroStats
    });
  }

  // 1. Status Aggregation (Open vs Resolved)
  const statusStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // 2. Category Breakdown Bar Chart
  const categoryStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // 3. Top Problem Location Aggregation
  const locationStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$roomCode', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  // 4. Team Aggregation
  const teamStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$assignedTeam', count: { $sum: 1 } } }
  ]);

  const formattedStats = {
    pending: 0,
    inProgress: 0,
    resolved: 0,
    underReview: 0,
    total: totalTickets,
    totalTickets: totalTickets,
    closedTickets: 0,
    categories: {},
    topLocation: locationStats.length > 0 ? { room: locationStats[0]._id || 'None', count: locationStats[0].count } : { room: 'None', count: 0 },
    topLocationName: locationStats.length > 0 ? (locationStats[0]._id || 'None') : 'None',
    topLocationCount: locationStats.length > 0 ? locationStats[0].count : 0,
    avgResolutionTime: 0,
    avgResolutionTimeFormatted: '0.0 Days',
    resolutionRate: '0%',
    resolvedPercentage: 0,
    teams: {}
  };

  statusStats.forEach((item) => {
    if (item._id === 'Pending') formattedStats.pending = item.count;
    if (item._id === 'In Progress') formattedStats.inProgress = item.count;
    if (item._id === 'Resolved') formattedStats.resolved = item.count;
    if (item._id === 'Under Review') formattedStats.underReview = item.count;
  });

  // Calculate dynamic average resolution time from resolved timestamps
  if (formattedStats.resolved > 0) {
    const resolvedItems = await Incident.find({ ...matchQuery, status: 'Resolved' }).select('createdAt updatedAt');
    if (resolvedItems.length > 0) {
      const totalMs = resolvedItems.reduce((acc, cur) => {
        const diff = (cur.updatedAt || new Date()) - (cur.createdAt || new Date());
        return acc + Math.max(diff, 0);
      }, 0);
      const avgDays = parseFloat(((totalMs / resolvedItems.length) / (1000 * 60 * 60 * 24)).toFixed(1));
      formattedStats.avgResolutionTime = avgDays;
      formattedStats.avgResolutionTimeFormatted = avgDays > 0 ? `${avgDays} Days` : '0.0 Days';
    }
  }

  const closed = formattedStats.resolved + (formattedStats.dismissed || 0);
  formattedStats.closedTickets = closed;
  if (formattedStats.total > 0) {
    const rate = Math.round((closed / formattedStats.total) * 100);
    formattedStats.resolvedPercentage = rate;
    formattedStats.resolutionRate = `${rate}%`;
  }

  categoryStats.forEach((item) => {
    formattedStats.categories[item._id] = item.count;
  });

  teamStats.forEach((item) => {
    formattedStats.teams[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    scope: scopeLabel,
    avgResolutionTime: formattedStats.avgResolutionTime,
    topLocation: formattedStats.topLocationName,
    topLocationCount: formattedStats.topLocationCount,
    resolvedPercentage: formattedStats.resolvedPercentage,
    totalTickets: formattedStats.totalTickets,
    closedTickets: formattedStats.closedTickets,
    stats: formattedStats,
    metrics: formattedStats
  });
});

/**
 * @route   PATCH /api/admin/reports/:id/status / PATCH /api/reports/:id/status
 * @desc    Update report status (Staff/Admin action)
 * @access  Private (Staff / Admin)
 */
exports.updateReportStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Under Review', 'Dismissed'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value.', 400));
  }

  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!incident) {
    return next(new AppError('Incident ticket not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: `Ticket status updated to ${status}.`,
    incident,
    report: incident
  });
});

/**
 * @route   PATCH /api/admin/reports/:id/assign
 * @desc    Assign official TIP Manila department / technician team or update priority
 * @access  Private (Staff / Admin)
 */
exports.assignTeamOrPriority = asyncHandler(async (req, res, next) => {
  const { assignedTeam, priority } = req.body;
  let updateData = {};

  if (assignedTeam) {
    if (!OFFICIAL_TEAMS.includes(assignedTeam)) {
      return next(new AppError(`Invalid team. Allowed departments: ${OFFICIAL_TEAMS.join(', ')}`, 400));
    }
    updateData.assignedTeam = assignedTeam;
  }

  if (priority) {
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent', 'Critical'];
    if (!validPriorities.includes(priority)) {
      return next(new AppError('Invalid priority level.', 400));
    }
    updateData.priority = priority;
  }

  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!incident) {
    return next(new AppError('Incident ticket not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Department assignment & priority updated successfully.',
    incident,
    report: incident
  });
});

/**
 * @route   POST /api/admin/reports/:id/notes / POST /api/reports/:id/remarks
 * @desc    Append a staff note or admin remark
 * @access  Private (Staff / Admin)
 */
exports.addAdminRemark = asyncHandler(async (req, res, next) => {
  const { note, noteText, staffName, actionTaken } = req.body;
  const content = (note || noteText || '').trim();

  if (!content) {
    return next(new AppError('Note text cannot be empty.', 400));
  }

  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return next(new AppError('Incident ticket not found.', 404));
  }

  const authorName = staffName || (req.user ? req.user.fullName || req.user.email : 'Campus IT / Facilities');

  incident.staffNotes.push({
    note: content,
    staffName: authorName,
    staffId: req.user ? (req.user.userId || req.user.id) : null,
    createdAt: new Date()
  });

  incident.adminRemarks.push({
    adminId: req.user ? (req.user.userId || req.user.id) : null,
    noteText: content,
    actionTaken: actionTaken || 'General Note'
  });

  await incident.save();

  res.status(200).json({
    success: true,
    message: 'Staff note recorded successfully.',
    incident,
    report: incident
  });
});
