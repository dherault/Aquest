const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const createResource = require('../utils/createResource');
const ensureAuth = require('../utils/ensureAuth');
const base64 = require('../utils/base64');
const db = require('../db');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateCommit',
  inputFields: {
    skillId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    commitEdge: {
      type: _.getEdgeType('http://foo.com#Commit'),
      resolve: ({ commit }) => ({
        cursor: base64('arrayconnection:0'), // HACK, new commit is always first in connection
        node: commit,
      }),
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: (payload, args, { user }) => user,
    },
  },
  mutateAndGetPayload: ensureAuth(({ skillId, label }, context) => {
    const commit = createResource('Commit', context, {
      skill: skillId,
      label,
    });

    return db.upsertResource(commit).then(() => ({ commit }));
  }),
});
