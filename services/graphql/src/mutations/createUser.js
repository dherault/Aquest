const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const validator = require('validator');

const _ = require('../graph');
const { createToken } = require('../auth');
const { query, createResource } = require('../db');
const ValidationError = require('../utils/ValidationError');
const createResourceObject = require('../utils/createResourceObject');

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
    description: {
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
  mutateAndGetPayload({ email, password, pseudo, description }, context) {
    if (password.length < 6) throw new ValidationError('Invalid password');
    if (!validator.isEmail(email)) throw new ValidationError('Invalid email');
    if (typeof pseudo === 'string' && pseudo.length < 3) throw new ValidationError('Pseudo too short');

    const normalizedEmail = validator.normalizeEmail(email);

    return query(db => db
      .collection('User')
      .findOne({ email: normalizedEmail })
    )
    .then(result => {
      if (result) throw new ValidationError('Email already in use');

      return bcrypt.hash(password, 10).then(passwordHash => {
        const user = createResourceObject('User', context, {
          passwordHash,
          email: normalizedEmail,
          pseudo: pseudo || 'Everyday life hero' + Math.random().toString().slice(2, 5),
          description: description || 'This ain\'t no place for no hero',
          profileImageUrl: '/images/profile1.jpg',
          backgroundImageUrl: '/images/background1.jpg',
          hasPrivateProfile: false,
          wantsToBeShowcased: false,
        });

        return createResource(user).then(() => ({ user, token: createToken(user.id) }));
      });
    });
  },
});
