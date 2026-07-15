/**
 * Authentication Routes (authRoutes.js)
 * ============================================================================
 * 
 * WHY ROUTE FILES ARE SEPARATE:
 * In complex architectures, routing must be decoupled from controller logic.
 * This file's ONLY job is to register HTTP URL pathways (e.g. POST /register) and 
 * bind them to specific controller functions.
 * Keeping routes separate means you can glance at this file and instantly see
 * all available endpoints for a category without getting distracted by database
 * queries or heavy business logic.
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Map: POST /api/auth/register -> Controller: register
router.post('/register', register);

// Map: POST /api/auth/login -> Controller: login
router.post('/login', login);

module.exports = router;
