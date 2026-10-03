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
  const { campus, status, category, team, search, reporterId, myReports } = req.query;
  let query = {};

  // If filtered for user's own reports (Student view)
  if (reporterId) {
    query.$or = [{ reporter: reporterId }, { reporterId: reporterId }];
  } else if (myReports === 'true' && req.user) {
    const uId = req.user.userId || req.user.id;
    query.$or = [{ reporter: uId }, { reporterId: uId }];
  }

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

    query.assignedTeam = scopedTeam;
  }

  if (campus && campus !== 'All') {
    query.campus = campus;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (team && team !== 'All') {
    query.assignedTeam = team;
  }

  if (search) {
    query.$or = [
      { ticketId: { $regex: search, $options: 'i' } },
      { roomCode: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const incidents = await Incident.find(query)
    .populate('reporter', 'fullName email tipEmail department')
    .populate('reporterId', 'fullName email tipEmail department')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: incidents.length,
    reports: incidents,
    incidents
  });
});

/**
 * @route   GET /api/reports/stats / GET /api/analytics/metrics
 * @desc    Get dashboard metrics & counters for Bento Grid and Analytics
 * @access  Private
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const { campus } = req.query;
  let matchQuery = {};
  if (campus && campus !== 'All') {
    matchQuery.campus = campus;
  }

  const statusStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const categoryStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  const teamStats = await Incident.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$assignedTeam', count: { $sum: 1 } } }
  ]);

  const formattedStats = {
    pending: 0,
    inProgress: 0,
    resolved: 0,
    underReview: 0,
    total: 0,
    categories: {},
    teams: {}
  };

  statusStats.forEach((item) => {
    formattedStats.total += item.count;
    if (item._id === 'Pending') formattedStats.pending = item.count;
    if (item._id === 'In Progress') formattedStats.inProgress = item.count;
    if (item._id === 'Resolved') formattedStats.resolved = item.count;
    if (item._id === 'Under Review') formattedStats.underReview = item.count;
  });

  categoryStats.forEach((item) => {
    formattedStats.categories[item._id] = item.count;
  });

  teamStats.forEach((item) => {
    formattedStats.teams[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
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
