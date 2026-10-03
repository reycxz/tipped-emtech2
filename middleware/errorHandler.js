/**
 * TIPPED — Global Error Handler Middleware
 * File: middleware/errorHandler.js
 * Standardizes API error responses across the backend:
 * { success: false, status: <number>, message: <string>, ... }
 */
const asyncHandler = require('./asyncHandler');

// Custom Operational Application Error Class
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific database and JWT parsing errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = `Validation failed: ${errors.join(', ')}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate key error: An account or record with that ${fields || 'value'} already exists.`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please sign in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please sign in again.';
  }

  // Server error diagnostics
  if (statusCode >= 500) {
    console.error('❌ [SERVER ERROR]:', err);
  } else {
    console.warn(`⚠️ [API WARN ${statusCode}]:`, message);
  }

  const response = {
    success: false,
    status: statusCode,
    message: message
  };

  if (err.details) {
    response.details = err.details;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError
};
