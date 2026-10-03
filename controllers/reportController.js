const { Report } = require('../models/tipped-mongoose-models');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * @route   POST /api/reports
 * @desc    Submit a new incident or facility report
 * @access  Private (Registered Users)
 */
exports.createReport = asyncHandler(async (req, res, next) => {
  const { category, campus, floorLevel, roomArea, landmark, description, imageUrls, priorityLevel } = req.body;

  // Validate campus constraint
  if (!['Arlegui', 'Casal'].includes(campus)) {
    return next(new AppError('Campus location must be either Arlegui or Casal.', 400));
  }

  // Validate photo evidence constraint (1 to 5 photos required)
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length < 1 || imageUrls.length > 5) {
    return next(new AppError('Report requires between 1 and 5 photo evidence URLs.', 400));
  }

  const report = await Report.create({
    reporterId: req.user ? req.user.userId : null,
    category,
    location: { campus, floorLevel, roomArea, landmark: landmark || '' },
    description,
    imageUrls,
    priorityLevel: priorityLevel || 'Medium',
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    message: 'Incident report filed successfully.',
    report
  });
});

/**
 * @route   GET /api/reports
 * @desc    Get all reports with query filters (campus, status, category, reporterId)
 * @access  Private
 */
exports.getReports = asyncHandler(async (req, res, next) => {
  const { campus, status, category, search, reporterId } = req.query;
  let query = {};

  // Filter by Reporter ID (for "My Reports" view)
  if (reporterId) {
    query.reporterId = reporterId;
  }

  // Campus Filter (Arlegui vs Casal)
  if (campus && campus !== 'All') {
    query['location.campus'] = campus;
  }

  // Status Filter (Pending, Under Review, In Progress, Resolved, Dismissed)
  if (status && status !== 'All') {
    query.status = status;
  }

  // Category Filter
  if (category && category !== 'All') {
    query.category = category;
  }

  // Keyword Search (Room or Description)
  if (search) {
    query.$or = [
      { 'location.roomArea': { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const reports = await Report.find(query)
    .populate('reporterId', 'fullName tipEmail department')
    .populate('adminRemarks.adminId', 'fullName tipEmail')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    reports
  });
});

/**
 * @route   GET /api/reports/stats
 * @desc    Get dashboard metrics & counters for Bento Grid tiles
 * @access  Private
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const { campus } = req.query;
  let matchQuery = {};
  if (campus && campus !== 'All') {
    matchQuery['location.campus'] = campus;
  }

  const stats = await Report.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const formattedStats = {
    pending: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    dismissed: 0,
    total: 0
  };

  stats.forEach((item) => {
    formattedStats.total += item.count;
    if (item._id === 'Pending') formattedStats.pending = item.count;
    if (item._id === 'Under Review') formattedStats.underReview = item.count;
    if (item._id === 'In Progress') formattedStats.inProgress = item.count;
    if (item._id === 'Resolved') formattedStats.resolved = item.count;
    if (item._id === 'Dismissed') formattedStats.dismissed = item.count;
  });

  res.status(200).json({ success: true, stats: formattedStats });
});

/**
 * @route   PATCH /api/reports/:id/status
 * @desc    Update report status (Admin action)
 * @access  Private (Admin / Superadmin)
 */
exports.updateReportStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Dismissed'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value.', 400));
  }

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!report) {
    return next(new AppError('Incident report not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: `Report status updated to ${status}.`,
    report
  });
});

/**
 * @route   POST /api/reports/:id/remarks
 * @desc    Append an official facilities admin remark/note
 * @access  Private (Admin / Superadmin)
 */
exports.addAdminRemark = asyncHandler(async (req, res, next) => {
  const { noteText, actionTaken } = req.body;

  if (!noteText) {
    return next(new AppError('Remark text cannot be empty.', 400));
  }

  const report = await Report.findById(req.params.id);
  if (!report) {
    return next(new AppError('Incident report not found.', 404));
  }

  report.adminRemarks.push({
    adminId: req.user ? req.user.userId : null,
    noteText,
    actionTaken: actionTaken || 'General Note'
  });

  await report.save();

  res.status(200).json({
    success: true,
    message: 'Admin remark logged successfully.',
    report
  });
});

