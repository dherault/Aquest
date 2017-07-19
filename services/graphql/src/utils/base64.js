function base64(x) {
  return new Buffer(x, 'utf8').toString('base64');
}

module.exports = base64;
