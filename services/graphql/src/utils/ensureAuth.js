function ensureAuth(fn) {
  return (payload, context, info) => {
    if (!context.user) throw new Error('User not authenticated');

    return fn(payload, context, info);
  }
}

module.exports = ensureAuth;
