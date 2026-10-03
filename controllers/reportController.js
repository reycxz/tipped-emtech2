/**
 * TIPPED — Incident & Facility Report Controller
 * File: controllers/reportController.js
 */

const { Report } = require('../models/tipped-mongoose-models');

/**
 * @route   POST /api/reports
 * @desc    Submit a new incident or facility report
 * @access  Private (Registered Users)
 */
exports.createReport = async (req, res) => {
  try {
    const { category, campus, floorLevel, roomArea, landmark, description, imageUrls, priorityLevel } = req.body;

    // Validate campus constraint
    if (!['Arlegui', 'Casal'].includes(campus)) {
      return res.status(400).json({ success: false, message: 'Campus location must be either Arlegui or Casal.' });
    }

    // Validate photo evidence constraint (1 to 5 photos required)
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length < 1 || imageUrls.length > 5) {
      return res.status(400).json({ success: false, message: 'Report requires between 1 and 5 photo evidence URLs.' });
    }

    const report = await Report.create({
      reporterId: req.user.userId,
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
  } catch (error) {
    console.error('Create Report Error:', error);
    res.status(500).json({ success: false, message: 'Failed to file incident report.', error: error.message });
  }
};

/**
 * @route   GET /api/reports
 * @desc    Get all reports with query filters (campus, status, category, reporterId)
 * @access  Private
 */
exports.getReports = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving reports.', error: error.message });
  }
};

/**
 * @route   GET /api/reports/stats
 * @desc    Get dashboard metrics & counters for Bento Grid tiles
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
  try {
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

    stats.forEach(item => {
      formattedStats.total += item.count;
      if (item._id === 'Pending') formattedStats.pending = item.count;
      if (item._id === 'Under Review') formattedStats.underReview = item.count;
      if (item._id === 'In Progress') formattedStats.inProgress = item.count;
      if (item._id === 'Resolved') formattedStats.resolved = item.count;
      if (item._id === 'Dismissed') formattedStats.dismissed = item.count;
    });

    res.status(200).json({ success: true, stats: formattedStats });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate stats.', error: error.message });
  }
};

/**
 * @route   PATCH /api/reports/:id/status
 * @desc    Update report status (Admin action)
 * @access  Private (Admin / Superadmin)
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Dismissed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Incident report not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}.`,
      report
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update report status.', error: error.message });
  }
};

/**
 * @route   POST /api/reports/:id/remarks
 * @desc    Append an official facilities admin remark/note
 * @access  Private (Admin / Superadmin)
 */
exports.addAdminRemark = async (req, res) => {
  try {
    const { noteText, actionTaken } = req.body;

    if (!noteText) {
      return res.status(400).json({ success: false, message: 'Remark text cannot be empty.' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Incident report not found.' });
    }

    report.adminRemarks.push({
      adminId: req.user.userId,
      noteText,
      actionTaken: actionTaken || 'General Note'
    });

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Admin remark logged successfully.',
      report
    });
  } catch (error) {
    console.error('Add Remark Error:', error);
    res.status(500).json({ success: false, message: 'Failed to append admin remark.', error: error.message });
  }
};
