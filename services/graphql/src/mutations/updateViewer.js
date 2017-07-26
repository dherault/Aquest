const { GraphQLString, GraphQLBoolean } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { query } = require('../db');
const _ = require('../graph');

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
    wantsToBeShowcased: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: ({ viewer }) => viewer,
    },
  },
  mutateAndGetPayload({ email, password, pseudo, description, hasPrivateProfile, wantsToBeShowcased }, { viewer }) {
    let emailCheck;
    let pseudoCheck;
    let passwordHashing;

    let normalizedEmail;

    if (email !== null) {
      if (!validator.isEmail(email)) throw new Error('Invalid email');

      normalizedEmail = validator.normalizeEmail(email);

      if (normalizedEmail !== viewer.email) {
        emailCheck = query(db => db.collection('User').findOne({ email: normalizedEmail }));
      }
    }

    if (pseudo !== null && pseudo !== viewer.pseudo) {
      if (pseudo.length < 3) throw new Error('Pseudo too short');

      pseudoCheck = query(db => db.collection('User').findOne({ pseudo }));
    }

    if (password !== null) {
      if (password.length < 6) throw new Error('Invalid password');

      passwordHashing = bcrypt.hash(password, 10);
    }

    return Promise.all([
      emailCheck,
      pseudoCheck,
      passwordHashing,
    ])
    .then(([userWithEmail, userWithPseudo, passwordHash]) => {

      if (userWithEmail) throw new Error('Email already exists');
      if (userWithPseudo) throw new Error('Pseudo already exists');

      const $set = {};

      if (normalizedEmail && normalizedEmail !== viewer.email) $set.email = normalizedEmail;
      if (pseudo && pseudo !== viewer.pseudo) $set.pseudo = pseudo;
      if (passwordHash) $set.passwordHash = passwordHash;
      if (description !== null && description !== viewer.description) $set.description = description;
      if (hasPrivateProfile !== null && hasPrivateProfile !== viewer.hasPrivateProfile) $set.hasPrivateProfile = hasPrivateProfile;
      if (wantsToBeShowcased !== null && wantsToBeShowcased !== viewer.wantsToBeShowcased) $set.wantsToBeShowcased = wantsToBeShowcased;

      if (!Object.keys($set).length) return { viewer };

      return query(db => db
        .collection('User')
        .updateOne({ id: viewer.id }, { $set })
      )
      .then(() => ({ viewer: Object.assign({}, viewer, $set) }));
    });
  },
});
