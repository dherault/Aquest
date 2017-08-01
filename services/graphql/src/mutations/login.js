const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const validator = require('validator');

const _ = require('../graph');
const { query } = require('../db');
const { createToken } = require('../auth');
const ValidationError = require('../utils/ValidationError');

module.exports = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: ({ user }) => user,
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
  },
  mutateAndGetPayload({ email, password }, context) {
    if (!validator.isEmail(email)) throw new ValidationError('Invalid email');

    return query(db => db
      .collection('User')
      .findOne({ email: validator.normalizeEmail(email) })
    )
    .then(user => {
      if (!user) throw new ValidationError('Email not found');

      return bcrypt.compare(password, user.passwordHash).then(isPasswordCorrect => {
        if (!isPasswordCorrect) throw new ValidationError('Incorrect password');

        context.viewer = user; // eslint-disable-line no-param-reassign

        return { user, token: createToken(user.id) };
      });
    });
  },
});
