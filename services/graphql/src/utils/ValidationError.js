class ValidationError extends Error {
  constructor(message, code) {
    super(message);

    this.type = 'ValidationError';
    this.code = code;
  }
}

module.exports = ValidationError;
