import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Creates a signed JSON Web Token (JWT) valid for 30 days.
 * 
 * @param {string} userId - Database ID of the user
 * @returns {string} Signed JWT token
 */
export function createAuthenticationToken(userId) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey || secretKey.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return jwt.sign({ id: userId }, secretKey, { expiresIn: '30d' });
}

/**
 * Register a new user account.
 * Route: POST /api/auth/register
 */
export const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    response.status(400);
    throw new Error('Please provide full name, email address, and password.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    response.status(400);
    throw new Error('An account with this email address already exists.');
  }

  const newUser = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: 'analyst'
  });

  const authToken = createAuthenticationToken(newUser._id);

  response.status(201).json({
    success: true,
    token: authToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

/**
 * Log in an existing user with email and password.
 * Route: POST /api/auth/login
 */
export const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400);
    throw new Error('Please enter both your email address and password.');
  }

  // Lookup user and explicitly include password for bcrypt comparison
  const userRecord = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!userRecord) {
    response.status(401);
    throw new Error('Invalid email address or password.');
  }

  const isPasswordCorrect = await userRecord.matchPassword(password);
  if (!isPasswordCorrect) {
    response.status(401);
    throw new Error('Invalid email address or password.');
  }

  const authToken = createAuthenticationToken(userRecord._id);

  response.status(200).json({
    success: true,
    token: authToken,
    user: {
      _id: userRecord._id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role
    }
  });
});

/**
 * Returns current logged-in user profile from verified token.
 * Route: GET /api/auth/me
 */
export const getMe = asyncHandler(async (request, response) => {
  const currentUser = await User.findById(request.user._id);
  response.status(200).json({
    success: true,
    user: currentUser
  });
});
