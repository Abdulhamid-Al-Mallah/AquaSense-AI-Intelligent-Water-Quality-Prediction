import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Middleware that validates the JSON Web Token (JWT) sent in the Authorization header.
 * Uses express-async-handler for clean error forwarding.
 */
export const protect = asyncHandler(async (request, response, next) => {
  let bearerToken;

  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.split(' ')[1];
  }

  if (!bearerToken) {
    response.status(401);
    throw new Error('Access denied. Please provide a valid Bearer token.');
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey || secretKey.length < 32) {
      return response.status(500).json({ success: false, message: 'Authentication is not configured.' });
    }
    const decodedTokenData = jwt.verify(bearerToken, secretKey);

    const authenticatedUser = await User.findById(decodedTokenData.id).select('-password');
    if (!authenticatedUser) {
      response.status(401);
      throw new Error('The user linked to this token no longer exists.');
    }

    request.user = authenticatedUser;
    next();
  } catch (tokenVerificationError) {
    console.error('[Authentication Guard]:', tokenVerificationError.message);
    response.status(401);
    throw new Error('Invalid or expired session token. Please log in again.');
  }
});
