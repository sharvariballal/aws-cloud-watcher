/**
 * Global Error Handler Middleware (errorHandler.js)
 * ============================================================================
 * 
 * WHY MIDDLEWARE IS USED:
 * When an error occurs somewhere inside our Express application (e.g. database query fails, 
 * invalid input schemas, unexpected runtime bugs), we should avoid crashing the server.
 * Express provides an elegant, centralized mechanism to catch errors:
 * Any middleware signature that contains 4 arguments `(err, req, res, next)` is designated
 * by Express as the "Global Error Handler".
 * 
 * BENEFIT OF CENTRALIZED ERROR HANDLING:
 * 1. Consistent JSON response formats for all errors (avoiding broken HTML stacktraces).
 * 2. Hiding deep system errors from public API clients in production (security).
 * 3. Keeps controllers tidy. Instead of writing heavy try/catch blocks that format error
 *    responses everywhere, we can simply pass errors along to `next(error)`.
 */

const errorHandler = (err, req, res, next) => {
  // If no status code was set prior to throwing, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error Handler Caught]: ${err.stack || err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // We only expose stack traces when in development environment for safety
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
