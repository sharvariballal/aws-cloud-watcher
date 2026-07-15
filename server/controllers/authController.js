/**
 * Authentication Controller (authController.js)
 * ============================================================================
 * 
 * WHY CONTROLLERS EXIST:
 * In modern web development, controllers act as the "brain" or the coordinator.
 * When a user makes an HTTP request (like POST /api/auth/register):
 * 1. The Route file forwards the request here.
 * 2. This Controller extracts parameters from the request body (`req.body`).
 * 3. It runs initial validation (e.g., checks if email exists).
 * 4. It delegates heavy lifting to our Models (Mongoose) or Services (Cognito).
 * 5. Finally, it sends back a clean, structured HTTP response (like 200 OK or 400 Bad Request).
 * 
 * By separating controllers from route mappings, we avoid messy files and keep our
 * logic modular and testable!
 */

const jwt = require('jsonwebtoken');
const { signUpCognitoUser, loginCognitoUser } = require('../services/cognitoService');

// We simulate local credentials and user records if MongoDB is not active yet.
// This allows developers to test routes instantly in a sandbox.
const mockUsersDatabase = [];

/**
 * Registers a new User.
 * Handles inputs like name, email, password, and phoneNumber.
 * 
 * ROUTE: POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    console.log(`[Auth Controller]: Register request received for email: ${email}`);

    // Basic Validation Check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists in our mock database
    const userExists = mockUsersDatabase.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Delegate creation to AWS Cognito Service
    const cognitoResult = await signUpCognitoUser(name, email, password, phoneNumber);

    // Prepare simulated database object
    const newUser = {
      id: `mock-id-${Date.now()}`,
      name,
      email,
      phoneNumber: phoneNumber || '',
      budget: 0,
      awsRegion: 'us-east-1',
      awsAccessKey: '',
      awsSecretKey: '',
      createdAt: new Date()
    };

    // Save in memory for local sandbox testing
    mockUsersDatabase.push(newUser);

    // Sign a mock JWT for the session
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    // Return structured response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      cognito: cognitoResult,
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        budget: newUser.budget,
        awsRegion: newUser.awsRegion
      }
    });

  } catch (error) {
    // Pass errors down to the global error middleware
    next(error);
  }
};

/**
 * Logins and Authenticates User.
 * Checks password credentials and generates access token.
 * 
 * ROUTE: POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`[Auth Controller]: Login request received for email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Call Cognito Login Service to mock credential checking
    const cognitoSession = await loginCognitoUser(email, password);

    // Find user in our simulated database, or create a quick fallback profile so the
    // login ALWAYS works for beginner-level testing without needing setup!
    let user = mockUsersDatabase.find(u => u.email === email);
    if (!user) {
      user = {
        id: `mock-id-guest`,
        name: "Demo Admin",
        email: email,
        phoneNumber: "+1234567890",
        budget: 1500,
        awsRegion: 'us-east-1',
        awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
        awsSecretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        createdAt: new Date()
      };
      mockUsersDatabase.push(user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      cognitoSession: cognitoSession,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        budget: user.budget,
        awsRegion: user.awsRegion
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
