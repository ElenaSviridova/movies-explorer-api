const { FORBIDDEN_ERROR } = require('../constants');

class NoAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = NoAccessError;
