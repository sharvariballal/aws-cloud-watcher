/**
 * Amazon SNS Communication Routes (snsRoutes.js)
 * ============================================================================
 * 
 * WHY ROUTE FILES ARE SEPARATE:
 * Dedicated route layer for AWS SNS communications.
 * 
 * DESIGN DETAILS:
 * This mapping handles requests to dispatch custom threshold alerts or warnings.
 * Since sending SNS notifications incurs charges and contacts live devices,
 * this endpoint is guarded by our authentication middleware.
 */

const express = require('express');
const router = express.Router();
const { triggerAlert } = require('../controllers/snsController');
const { protect } = require('../middleware/authMiddleware');

// Map: POST /api/sns/send-alert -> Controller: triggerAlert
router.post('/send-alert', protect, triggerAlert);

module.exports = router;
