const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const createResource = require('../utils/createResource');
const ensureAuth = require('../utils/ensureAuth');
const db = require('../db');
const { run } = require('../db/queries');
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
      resolve: ({ vocationInstance: { id } }, args, { viewer }) => {
        const query = db.createQuery('http://foo.com#VocationInstance').filter('sourceUser', viewer.id);

        return run(query).then(vocationInstances => {
          const vocationInstance = vocationInstances.find(s => s.id === id);

          return {
            cursor: cursorForObjectInConnection(vocationInstances, vocationInstance),
            node: vocationInstance,
          };
        });
      },
    },
    viewer: {
      type: _.getObjectType('http://foo.com#User'),
      resolve: (payload, args, { viewer }) => viewer,
    },
  },
  mutateAndGetPayload: ensureAuth(({ vocationId }, context) => {
    const vocationInstance = createResource('VocationInstance', context, {
      vocation: vocationId,
      level: 1,
    });

    return db.upsertResource(vocationInstance).then(() => ({ vocationInstance }));
  }),
});
