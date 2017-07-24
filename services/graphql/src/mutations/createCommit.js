const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const createResourceObject = require('../utils/createResourceObject');
const ensureAuth = require('../utils/ensureAuth');
const base64 = require('../utils/base64');
const { createResource } = require('../db');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateCommit',
  inputFields: {
    vocationId: {
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
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ vocationId, label }, context) => {
    const commit = createResourceObject('Commit', context, {
      vocation: vocationId,
      label,
    });

    return createResource(commit).then(() => ({ commit }));
  }),
});
