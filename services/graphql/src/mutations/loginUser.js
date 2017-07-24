const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const db = require('../db');
const { query } = require('../db');
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
      type: _.getObjectType('http://foo.com#User'),
      resolve: ({ user }) => user,
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
  },
  mutateAndGetPayload({ email, password }, context) {
    return query(db => db.collection('User').findOne({ email }))
    .then(user => {
      if (!user) throw new Error('Email not found');

      return bcrypt.compare(password, user.passwordHash).then(isPasswordValid => {
        if (!isPasswordValid) throw new Error('Invalid password');

        context.viewer = user;

        return { user, token: createToken(user.id) };
      });
    });
  },
});
