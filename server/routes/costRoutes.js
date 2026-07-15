/**
 * AWS Cost Query Routes (costRoutes.js)
 * ============================================================================
 * 
 * WHY ROUTE FILES ARE SEPARATE:
 * Isolates billing analytics endpoints.
 * 
 * SECURITY:
 * Users should only be able to view AWS billing configurations and cost results
 * for their own authorized user accounts. Therefore, we mount the `protect`
 * middleware before delegating to the `getCosts` controller.
 */

const express = require('express');
const router = express.Router();
const { getCosts } = require('../controllers/costController');
const { protect } = require('../middleware/authMiddleware');

// Mount protect middleware so that only authenticated sessions can query costs
router.get('/', protect, getCosts);

module.exports = router;
