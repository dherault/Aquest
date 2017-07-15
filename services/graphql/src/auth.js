const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = process.env.JWT_SECRET || 'NotSoSecret';

function createToken(userId) {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 1), // 1 min
  };

  return jwt.sign(payload, jwtSecret);
}

function verifyToken(token) {
  let payload = null;
  let verified = true;
  let expired = false;

  try {
    payload = jwt.verify(token, jwtSecret);
  }
  catch (err) {
    if (err.name === 'TokenExpiredError') expired = true;
    else verified = false;
  }

  return { payload, verified, expired };
}

module.exports = { jwtSecret, createToken, verifyToken };
