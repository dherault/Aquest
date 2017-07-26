const { GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const { query } = require('../db');
// const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'DeleteViewer',
  inputFields: {
    dummyField: {
      type: GraphQLString,
    },
  },
  outputFields: {
    dummyField: {
      type: GraphQLString,
      resolve: () => 'ok',
    },
  },
  mutateAndGetPayload(args, { viewer }) {
    const filter = { sourcePerson: viewer.id };

    return Promise.all([
      query(db => db.collection('User').deleteOne(filter)),
      query(db => db.collection('VocationInstance').deleteMany(filter)),
      query(db => db.collection('Story').deleteMany(filter)),
    ]);
  },
});
