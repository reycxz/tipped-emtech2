/**
 * TIPPED — Authentication & Role Guards Middleware
 * File: middleware/authGuard.js
 */
const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'tipped_tip_manila_secret_key_2026';

/**
 * Verify JWT token from Authorization header
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'Authentication required. Missing or malformed token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'Invalid or expired authentication token.'
    });
  }
};

/**
 * RBAC: Require Staff or Admin role
 * Returns 403 Forbidden { message: "Access denied" } if unauthorized
 */
const requireStaffOrAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'Authentication required. Missing or malformed token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const role = (decoded.role || '').toLowerCase();
    
    if (role === 'staff' || role === 'admin' || role === 'superadmin') {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      status: 403,
      message: 'Access denied'
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'Invalid or expired authentication token.'
    });
  }
};

/**
 * Generic role checker middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Authentication required.'
      });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole);
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Access denied'
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireStaffOrAdmin,
  requireRole
};
