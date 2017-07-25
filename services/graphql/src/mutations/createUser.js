const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const createResourceObject = require('../utils/createResourceObject');
const { query, createResource } = require('../db');
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

    const emailCheck = query(db => db.collection('User').findOne({ email }));

    return emailCheck.then(result => {
      if (result) throw new Error('Email already in use');

      return bcrypt.hash(password, 10).then(passwordHash => {
        const user = createResourceObject('User', context, {
          email,
          passwordHash,
          pseudo: pseudo || 'Everyday life hero' + Math.random().toString().slice(2, 5),
          description: 'This ain\'t no place for no hero',
          profileImageUrl: '/images/profile1.jpg',
          backgroundImageUrl: '/images/background1.jpg',
        });

        return createResource(user).then(() => ({ user, token: createToken(user.id) }));
      });
    });
  },
});
