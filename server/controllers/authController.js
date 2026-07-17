const jwt = require("jsonwebtoken");
const {
  signUpCognitoUser,
  loginCognitoUser,
} = require("../services/cognitoService");

// ==========================
// REGISTER
// ==========================
const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cognitoUser = await signUpCognitoUser(
      name,
      email,
      password,
      phoneNumber
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: cognitoUser.UserSub,
        name,
        email,
        phoneNumber: phoneNumber || "",
        budget: 0,
        awsRegion: "us-east-1",
      },

      cognito: cognitoUser,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// LOGIN
// ==========================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Authenticate with Cognito
    await loginCognitoUser(email, password);

    // Create OUR OWN JWT for Express
    const token = jwt.sign(
      {
        id: email,
        email,
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: email,
        email,
        name: email.split("@")[0],
        budget: 0,
        awsRegion: "us-east-1",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};