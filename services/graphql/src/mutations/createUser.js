const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const createResource = require('../utils/createResource');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');
const { createToken } = require('../auth');

module.exports = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    pseudo: {
      type: GraphQLString,
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
  mutateAndGetPayload({ email, password, pseudo }, context) {
    if (password.length < 6) throw new Error('Invalid password');

    const emailCheck = run(db.createQuery('http://foo.com#User').filter('email', email));

    return emailCheck.then(results => {
      if (results.length) throw new Error('Email already in use');

      return bcrypt.hash(password, 10).then(passwordHash => {
        const user = createResource('User', context, {
          email,
          passwordHash,
          pseudo: pseudo || 'Everyday life hero',
          profileImageUrl: '/images/profile1.jpg',
          backgroundImageUrl: '/images/profile2.jpg',
        });

        return db.upsertResource(user).then(() => ({ user, token: createToken(user.id) }));
      });
    });
  },
});
