const { checkAccess, PERMISSIONS } = require('./accessControl');
const { ForbiddenError } = require('apollo-server-express');

// Helper function to check if token is expired
const isTokenExpired = (tokenPayload) => {
  if (!tokenPayload || !tokenPayload.exp) {
    throw new ForbiddenError("Token does not contain 'exp' field");
  }

  const now = Math.floor(Date.now() / 1000);
  return tokenPayload.exp <= now;
};

// Helper function to check user authentication and permissions
const authenticateAndAuthorize = async (user, action, resource) => {
  if (!user) {
    throw new ForbiddenError("Authentication Token Required");
  }

  if (isTokenExpired(user)) {
    throw new ForbiddenError("Authentication Token Expired");
  }

  const actionAllowed = await checkAccess(user, action, resource);
  if (!actionAllowed) {
    throw new ForbiddenError(`Unauthorized: You don't have permission to ${action} ${resource}.`);
  }
};

module.exports = { authenticateAndAuthorize, isTokenExpired };