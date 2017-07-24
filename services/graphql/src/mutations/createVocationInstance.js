const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const createResourceObject = require('../utils/createResourceObject');
const ensureAuth = require('../utils/ensureAuth');
const { query, createResource } = require('../db');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateVocationInstance',
  inputFields: {
    vocationId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    vocationInstanceEdge: {
      type: _.getEdgeType('http://foo.com#VocationInstance'),
      resolve: ({ vocationInstance: { id } }, args, { viewer }) => query(db => db
        .collection('VocationInstance')
        .find({ sourceUser: viewer.id })
        .toArray()
      ).then(vocationInstances => {
        const vocationInstance = vocationInstances.find(s => s.id === id);

        return {
          cursor: cursorForObjectInConnection(vocationInstances, vocationInstance),
          node: vocationInstance,
        };
      }),
    },
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ vocationId }, context) => {
    const vocationInstance = createResourceObject('VocationInstance', context, {
      vocation: vocationId,
      level: 1,
    });

    return createResource(vocationInstance).then(() => ({ vocationInstance }));
  }),
});
