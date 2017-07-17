const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const createResource = require('../utils/createResource');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');
const { createToken } = require('../auth');

module.exports = mutationWithClientMutationId({
  name: 'CreatePerson',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    person: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: ({ person }) => person,
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
  },
  mutateAndGetPayload({ email, password }, context) {
    if (password.length < 6) throw new Error('Invalid password');

    const emailCheck = run(db.createQuery('http://foo.com#Person').filter('email', email));

    return emailCheck.then(results => {
      if (results.length) throw new Error('Email already in use');

      return bcrypt.hash(password, 10).then(passwordHash => {
        const person = createResource('Person', context, { email, passwordHash });

        return db.upsertResource(person).then(() => ({ person, token: createToken(person.id) }));
      });
    });
  },
});
