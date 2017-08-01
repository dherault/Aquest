const { GraphQLString, GraphQLBoolean } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const validator = require('validator');

const _ = require('../graph');
const { query } = require('../db');
const ensureAuth = require('../utils/ensureAuth');
const ValidationError = require('../utils/ValidationError');

module.exports = mutationWithClientMutationId({
  name: 'UpdateViewer',
  inputFields: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    pseudo: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    hasPrivateProfile: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: ({ viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ email, password, pseudo, description, hasPrivateProfile }, { viewer }) => {
    let emailCheck;
    let pseudoCheck;
    let passwordHashing;

    let normalizedEmail;

    if (typeof email === 'string') {
      if (!validator.isEmail(email)) throw new ValidationError('Invalid email');

      normalizedEmail = validator.normalizeEmail(email);

      if (normalizedEmail !== viewer.email) {
        emailCheck = query(db => db.collection('User').findOne({ email: normalizedEmail }));
      }
    }

    if (typeof pseudo === 'string' && pseudo !== viewer.pseudo) {
      if (pseudo.length < 3) throw new ValidationError('Pseudo too short');

      pseudoCheck = query(db => db.collection('User').findOne({ pseudo }));
    }

    if (typeof password === 'string') {
      if (password.length < 6) throw new ValidationError('Invalid password');

      passwordHashing = bcrypt.hash(password, 10);
    }

    return Promise.all([
      emailCheck,
      pseudoCheck,
      passwordHashing,
    ])
    .then(([userWithEmail, userWithPseudo, passwordHash]) => {

      if (userWithEmail) throw new ValidationError('Email already exists');
      if (userWithPseudo) throw new ValidationError('Pseudo already exists');

      const $set = {};

      if (normalizedEmail && normalizedEmail !== viewer.email) $set.email = normalizedEmail;
      if (pseudo && pseudo !== viewer.pseudo) $set.pseudo = pseudo;
      if (passwordHash) $set.passwordHash = passwordHash;
      if (typeof description === 'string' && description !== viewer.description) $set.description = description;
      if (typeof hasPrivateProfile === 'boolean' && hasPrivateProfile !== viewer.hasPrivateProfile) $set.hasPrivateProfile = hasPrivateProfile;

      if (!Object.keys($set).length) return { viewer };

      return query(db => db
        .collection('User')
        .updateOne({ id: viewer.id }, { $set })
      )
      .then(() => ({ viewer: Object.assign({}, viewer, $set) }));
    });
  }),
});
