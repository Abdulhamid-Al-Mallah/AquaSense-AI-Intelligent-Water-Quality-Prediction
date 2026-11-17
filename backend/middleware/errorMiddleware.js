/**
 * Centralized error-handling middleware for Express.
 * Formats database and validation errors into friendly JSON messages.
 */
const errorHandler = (encounteredError, request, response, next) => {
  let errorResponse = { ...encounteredError };
  errorResponse.message = encounteredError.message;

  console.error('[Application Error]:', encounteredError.message);

  // Handle invalid MongoDB ObjectId format
  if (encounteredError.name === 'CastError') {
    return response.status(404).json({
      success: false,
      error: `Resource not found with ID: ${encounteredError.value}`
    });
  }

  // Handle duplicate unique keys (e.g., email already registered)
  if (encounteredError.code === 11000) {
    const duplicateFieldName = Object.keys(encounteredError.keyValue)[0];
    return response.status(400).json({
      success: false,
      error: `An entry with this ${duplicateFieldName} already exists. Please use a different value.`
    });
  }

  // Handle Mongoose schema validation failures
  if (encounteredError.name === 'ValidationError') {
    const validationErrorMessages = Object.values(encounteredError.errors).map(
      (fieldError) => fieldError.message
    );
    return response.status(400).json({
      success: false,
      error: validationErrorMessages.join(', ')
    });
  }

  // Handle malformed JSON body from client
  if (encounteredError instanceof SyntaxError && encounteredError.status === 400 && 'body' in encounteredError) {
    return response.status(400).json({
      success: false,
      error: 'Malformed JSON payload. Please verify your request data syntax.'
    });
  }

  const statusCode = response.statusCode === 200 ? 500 : (response.statusCode || errorResponse.statusCode || 500);
  const failureMessage = errorResponse.message || 'An unexpected server error occurred.';

  return response.status(statusCode).json({
    success: false,
    error: failureMessage
  });
};

export default errorHandler;
