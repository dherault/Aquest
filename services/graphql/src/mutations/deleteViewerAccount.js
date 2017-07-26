const { GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const ensureAuth = require('../utils/ensureAuth');
const { query } = require('../db');

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

    return Promise.all([
      query(db => db.collection('User').deleteOne(filter)),
      query(db => db.collection('VocationInstance').deleteMany(filter)),
      query(db => db.collection('Story').deleteMany(filter)),
    ]);
  }),
});
