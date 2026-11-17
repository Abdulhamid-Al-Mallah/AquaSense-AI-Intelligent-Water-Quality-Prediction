const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Creates a signed JSON Web Token (JWT) valid for 30 days.
 * 
 * @param {string} userId - Database ID of the user
 * @returns {string} Signed JWT token
 */
function createAuthenticationToken(userId) {
  const secretKey = process.env.JWT_SECRET || 'aquasense_jwt_secret_dev_key_2026_seng491';
  return jwt.sign({ id: userId }, secretKey, { expiresIn: '30d' });
}

/**
 * Register a new user account.
 * Route: POST /api/auth/register
 */
const registerUser = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        success: false,
        error: 'Please provide full name, email address, and password.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'analyst'
    });

    const authToken = createAuthenticationToken(newUser._id);

    return response.status(201).json({
      success: true,
      token: authToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in an existing user with email and password.
 * Route: POST /api/auth/login
 */
const loginUser = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        error: 'Please enter both your email address and password.'
      });
    }

    // Lookup user and explicitly include password for bcrypt comparison
    const userRecord = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!userRecord) {
      return response.status(401).json({
        success: false,
        error: 'Invalid email address or password.'
      });
    }

    const isPasswordCorrect = await userRecord.matchPassword(password);
    if (!isPasswordCorrect) {
      return response.status(401).json({
        success: false,
        error: 'Invalid email address or password.'
      });
    }

    const authToken = createAuthenticationToken(userRecord._id);

    return response.status(200).json({
      success: true,
      token: authToken,
      user: {
        _id: userRecord._id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns current logged-in user profile from verified token.
 * Route: GET /api/auth/me
 */
const getMe = async (request, response, next) => {
  try {
    const currentUser = await User.findById(request.user._id);
    return response.status(200).json({
      success: true,
      user: currentUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function that automatically creates a default test account if none exists.
 * Run automatically on server startup.
 */
const seedAdmin = async () => {
  try {
    const defaultEmail = 'admin@aquasense.ai';
    const alreadyExists = await User.findOne({ email: defaultEmail });
    if (!alreadyExists) {
      await User.create({
        name: 'AquaSense Admin',
        email: defaultEmail,
        password: 'AdminPassword123!',
        role: 'analyst'
      });
      console.log(`[AquaSense AI] Default demo account ready: ${defaultEmail} / AdminPassword123!`);
    }
  } catch (seedError) {
    console.warn(`[AquaSense AI] Demo account setup notice: ${seedError.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  seedAdmin
};
