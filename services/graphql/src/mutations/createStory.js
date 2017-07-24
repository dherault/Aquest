const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const createResourceObject = require('../utils/createResourceObject');
const ensureAuth = require('../utils/ensureAuth');
const base64 = require('../utils/base64');
const { createResource } = require('../db');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateStory',
  inputFields: {
    vocationId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    storyEdge: {
      type: _.getEdgeType('http://foo.com#Story'),
      resolve: ({ story }) => ({
        cursor: base64('arrayconnection:0'), // HACK, new story is always first in connection
        node: story,
      }),
    },
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ vocationId, label }, context) => {
    const story = createResourceObject('Story', context, {
      vocation: vocationId,
      label,
    });

    return createResource(story).then(() => ({ story }));
  }),
});
