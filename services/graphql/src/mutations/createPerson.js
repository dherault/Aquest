const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const bcrypt = require('bcrypt');
const createResource = require('../utils/createResource');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreatePerson',
  inputFields: {
    pseudo: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
  },
  mutateAndGetPayload({ pseudo, email, password }, context) {
    if (password.length < 6) throw new Error('Invalid password');

    const emailCheck = run(db.createQuery('http://foo.com#Person').filter('email', email));
    const pseudoCheck = run(db.createQuery('http://foo.com#Person').filter('pseudo', pseudo));

    return Promise.all([emailCheck, pseudoCheck]).then(results => {
      if (results[0].length) throw new Error('Email already in use');
      if (results[1].length) throw new Error('Pseudo already in use');

      return bcrypt.hash(password, 10).then(passwordHash => {
        const person = createResource('Person', context, { pseudo, email, passwordHash });

        return db.upsertResource(person).then(() => ({ person }));
      });
    });
  },
});
