// Mutation resolver wrapper to reject anonymous users
function ensureAuth(fn) {
  return (payload, context, info) => {
    if (!context.viewer) throw new Error('User not authenticated');

    return fn(payload, context, info);
  };
}

module.exports = ensureAuth;
