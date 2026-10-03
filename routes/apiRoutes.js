/**
 * TIPPED — API Express Routes
 * File: routes/apiRoutes.js
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middleware/authGuard');

// Public Authentication Routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);

// Protected Incident Report Routes (Requires valid session token)
router.post('/reports', requireAuth, reportController.createReport);
router.get('/reports', requireAuth, reportController.getReports);
router.get('/reports/stats', requireAuth, reportController.getDashboardStats);

// Protected Admin Control Routes (Requires Admin role)
router.patch('/reports/:id/status', requireAuth, requireRole('Admin', 'Superadmin', 'Staff'), reportController.updateReportStatus);
router.post('/reports/:id/remarks', requireAuth, requireRole('Admin', 'Superadmin', 'Staff'), reportController.addAdminRemark);

module.exports = router;

