/**
 * Authentication Middleware (authMiddleware.js)
 * ============================================================================
 * 
 * WHY MIDDLEWARE IS USED:
 * Think of Express middleware as a security guard at the gate of a private club.
 * Instead of copying security checks inside every single route handler (dashboard, billing, settings),
 * we write the security check ONCE as a middleware function.
 * If the request does not provide a valid pass (JWT token), the middleware stops the request
 * immediately and sends a 401 Unauthorized response, preventing the route from executing.
 * If the pass is valid, the middleware attaches the verified user info to the `req` object,
 * and calls `next()`, passing control smoothly to the route controller.
 * 
 * HOW JWT AUTHENTICATION WORKS:
 * 1. The client logs in and receives a JSON Web Token (JWT).
 * 2. For protected requests, the client attaches this JWT to the HTTP "Authorization" header:
 *    Authorization: Bearer <your_jwt_token>
 * 3. This middleware parses the header, verifies the signature using `JWT_SECRET`,
 *    and extracts the payload (usually User ID).
 */

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if the Authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the raw token string (removing "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token signature using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // 3. Attach the decoded user payload (e.g. { id: 'user_mongodb_id' }) to the request object.
      // This is super useful because any downstream controller can now access "req.user.id" instantly.
      req.user = decoded;

      // 4. Everything is good! Continue to the actual controller.
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  // If no token was found in the headers
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided in request header',
    });
  }
};

module.exports = {
  protect
};
