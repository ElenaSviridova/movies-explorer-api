const { NO_AUTHORIZATION_ERROR } = require('../constants');

class NoAuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_AUTHORIZATION_ERROR;
  }
}

module.exports = NoAuthorizationError;
