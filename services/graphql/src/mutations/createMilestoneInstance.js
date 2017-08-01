const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');

const _ = require('../graph');
const { query, createResource } = require('../db');
const ensureAuth = require('../utils/ensureAuth');
const createResourceObject = require('../utils/createResourceObject');

module.exports = mutationWithClientMutationId({
  name: 'CreateMilestoneInstance',
  inputFields: {
    milestoneId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    milestoneInstanceEdge: {
      type: _.getEdgeType('http://foo.com#MilestoneInstance'),
      resolve: ({ milestoneInstance: { id } }, args, { viewer }) => query(db => db
        .collection('MilestoneInstance')
        .find({ sourceUser: viewer.id })
        .toArray()
      ).then(milestoneInstances => {
        const milestoneInstance = milestoneInstances.find(s => s.id === id);

        return {
          cursor: cursorForObjectInConnection(milestoneInstances, milestoneInstance),
          node: milestoneInstance,
        };
      }),
    },
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ milestoneId }, context) => {
    const milestoneInstance = createResourceObject('MilestoneInstance', context, {
      milestone: milestoneId,
    });

    return createResource(milestoneInstance).then(() => ({ milestoneInstance }));
  }),
});
