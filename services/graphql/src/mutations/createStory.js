const { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
const createResourceObject = require('../utils/createResourceObject');
const ensureAuth = require('../utils/ensureAuth');
const base64 = require('../utils/base64');
const { createResource, query } = require('../db');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateStory',
  inputFields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
    hasLeveledUp: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    vocationId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    vocationInstanceId: {
      type: new GraphQLNonNull(GraphQLID),
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
    vocationInstance: {
      type: _.getObjectType('http://foo.com#VocationInstance'),
      resolve: ({ vocationInstance }) => vocationInstance,
    },
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ label, hasLeveledUp, vocationId, vocationInstanceId }, context) => {
    const story = createResourceObject('Story', context, {
      label,
      hasLeveledUp,
      vocation: vocationId,
      vocationInstance: vocationInstanceId,
    });

    return createResource(story).then(() => {
      if (!hasLeveledUp) return { story };

      return query(db => db
        .collection('VocationInstance')
        .findOne({ id: vocationInstanceId })
      )
      .then(vocationInstance => {
        if (!vocationInstance || vocationInstance.sourceUser !== context.viewer.id) throw new Error('!');

        return query(db => db
          .collection('VocationInstance')
          .updateOne({ id: vocationInstanceId }, { $set: { level: vocationInstance.level + 1 } })
        )
        .then(() => {
          console.log('vocationInstance:', vocationInstance);
          // mongo's "findOneAndUpdate" performs a write lock, so we use "findOne" instead
          // and modify the local resource
          vocationInstance.level += 1;

          return { story, vocationInstance };
        });
      });
    });
  }),
});
