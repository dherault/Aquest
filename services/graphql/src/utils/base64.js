// Converts an utf8 string to base64
function base64(x) {
  return new Buffer(x, 'utf8').toString('base64');
}

module.exports = base64;
