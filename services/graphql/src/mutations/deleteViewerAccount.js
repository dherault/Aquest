const { GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');

const { query } = require('../db');
const ensureAuth = require('../utils/ensureAuth');

module.exports = mutationWithClientMutationId({
  name: 'DeleteViewerAccount',
  outputFields: {
    dummyField: {
      type: GraphQLString,
      resolve: () => 'ok',
    },
  },
  mutateAndGetPayload: ensureAuth((args, { viewer }) => {
    const filter = { sourceUser: viewer.id };

    // Game over
    return Promise.all([
      query(db => db.collection('User').deleteOne(filter)),
      query(db => db.collection('VocationInstance').deleteMany(filter)),
      query(db => db.collection('Story').deleteMany(filter)),
    ]);
  }),
});
