/**
 * TIPPED — Async Handler Wrapper
 * File: middleware/asyncHandler.js
 * Automatically catches unhandled promise rejections in controller actions
 * and forwards them to the global Express error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
