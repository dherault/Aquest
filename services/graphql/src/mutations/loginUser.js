const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');
const { createToken } = require('../auth');

module.exports = mutationWithClientMutationId({
  name: 'LoginUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: ({ user }) => user,
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
  },
  mutateAndGetPayload({ email, password }) {
    return run(db.createQuery('http://foo.com#Person').filter('email', email))
    .then(results => {
      if (!results.length) throw new Error('Email not found');

      const user = results[0];

      return bcrypt.compare(password, user.passwordHash).then(isPasswordValid => {
        if (!isPasswordValid) throw new Error('Invalid password');

        return { user, token: createToken(user.id) };
      });
    });
  },
});
