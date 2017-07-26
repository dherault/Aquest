const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'NotSoSecret';

// NOTE: tokens are not stored in cookies (but in localStorage) and not renewed
// NOTE: auth sucks for now
function createToken(userId) {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 min
  };

  return jwt.sign(payload, jwtSecret);
}

module.exports = { jwtSecret, createToken };
