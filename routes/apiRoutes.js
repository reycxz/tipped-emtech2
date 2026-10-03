/**
 * TIPPED — API Express Routes
 * File: routes/apiRoutes.js
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');

// Authentication Routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);

// Incident Report Routes
router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getReports);
router.get('/reports/stats', reportController.getDashboardStats);

// Admin Control Routes
router.patch('/reports/:id/status', reportController.updateReportStatus);
router.post('/reports/:id/remarks', reportController.addAdminRemark);

module.exports = router;
