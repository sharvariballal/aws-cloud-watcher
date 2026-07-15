/**
 * Budget Management Routes (budgetRoutes.js)
 * ============================================================================
 * 
 * WHY ROUTE FILES ARE SEPARATE:
 * This file is responsible for mapping budget-related requests.
 * 
 * PROTECTED ROUTES:
 * Notice that we import the `protect` middleware from authMiddleware.js.
 * By passing `protect` as the second argument in:
 * `router.get('/', protect, getBudget)`
 * we guarantee that ONLY authenticated users carrying a valid JWT can access this endpoint.
 * This is an elegant way to secure select endpoints without cluttering the controller logic.
 */

const express = require('express');
const router = express.Router();
const { getBudget, createBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// All budget operations require a valid user session.
// We can apply the "protect" middleware to every route in this router:
router.use(protect);

// Map: GET /api/budget -> Controller: getBudget
router.get('/', getBudget);

// Map: POST /api/budget -> Controller: createBudget
router.post('/', createBudget);

// Map: PUT /api/budget -> Controller: updateBudget
router.put('/', updateBudget);

module.exports = router;
