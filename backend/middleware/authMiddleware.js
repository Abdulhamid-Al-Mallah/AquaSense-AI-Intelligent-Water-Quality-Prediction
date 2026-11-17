const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware that validates the JSON Web Token (JWT) sent in the Authorization header.
 * Attaches the authenticated user object to the request.
 */
const protect = async (request, response, next) => {
  let bearerToken;

  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.split(' ')[1];
  }

  if (!bearerToken) {
    return response.status(401).json({
      success: false,
      error: 'Access denied. Please provide a valid Bearer token.'
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'aquasense_jwt_secret_dev_key_2026_seng491';
    const decodedTokenData = jwt.verify(bearerToken, secretKey);

    const authenticatedUser = await User.findById(decodedTokenData.id).select('-password');
    if (!authenticatedUser) {
      return response.status(401).json({
        success: false,
        error: 'The user linked to this token no longer exists.'
      });
    }

    request.user = authenticatedUser;
    next();
  } catch (tokenVerificationError) {
    console.error('[Authentication Guard]:', tokenVerificationError.message);
    return response.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please log in again.'
    });
  }
};

module.exports = {
  protect
};
