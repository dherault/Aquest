// A custom Error class to tell the front it is the user's fault
class ValidationError extends Error {
  constructor(message, code) {
    super(message);

    this.type = 'ValidationError';
    this.code = code;
  }
}

module.exports = ValidationError;
