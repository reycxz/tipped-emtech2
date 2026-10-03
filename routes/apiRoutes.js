/**
 * TIPPED — API Express Routes
 * File: routes/apiRoutes.js
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const { requireAuth, requireStaffOrAdmin } = require('../middleware/authGuard');

/* ═══════════════════════════════════════════════════════════
   1. PUBLIC AUTHENTICATION ROUTES
   ═══════════════════════════════════════════════════════════ */
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);

/* ═══════════════════════════════════════════════════════════
   2. PROTECTED INCIDENT REPORTING ROUTES (Students / Faculty / Staff)
   ═══════════════════════════════════════════════════════════ */
router.post('/reports', requireAuth, reportController.createReport);
router.get('/reports', requireAuth, reportController.getReports);
router.post('/incidents', requireAuth, reportController.createReport);
router.get('/incidents', requireAuth, reportController.getReports);
router.get('/reports/stats', requireAuth, reportController.getDashboardStats);

/* ═══════════════════════════════════════════════════════════
   3. PROTECTED ADMIN & TRIAGE ROUTES (Requires Staff or Admin)
   ═══════════════════════════════════════════════════════════ */
router.get('/admin/reports', requireStaffOrAdmin, reportController.getReports);
router.get('/admin/incidents', requireStaffOrAdmin, reportController.getReports);
router.patch('/admin/reports/:id/status', requireStaffOrAdmin, reportController.updateReportStatus);
router.patch('/admin/reports/:id/assign', requireStaffOrAdmin, reportController.assignTeamOrPriority);
router.post('/admin/reports/:id/notes', requireStaffOrAdmin, reportController.addAdminRemark);

// Aliases for admin actions on reports
router.patch('/reports/:id/status', requireStaffOrAdmin, reportController.updateReportStatus);
router.post('/reports/:id/remarks', requireStaffOrAdmin, reportController.addAdminRemark);

/* ═══════════════════════════════════════════════════════════
   4. PROTECTED ANALYTICS & BENCHMARK ROUTES (Requires Staff or Admin)
   ═══════════════════════════════════════════════════════════ */
router.get('/analytics/metrics', requireStaffOrAdmin, reportController.getDashboardStats);
router.get('/analytics/overview', requireStaffOrAdmin, reportController.getDashboardStats);

module.exports = router;
