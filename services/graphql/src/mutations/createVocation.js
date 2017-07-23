const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const IndividualsType = require('../customTypes/IndividualsType');
const createResource = require('../utils/createResource');
const ensureAuth = require('../utils/ensureAuth');
const db = require('../db');
const { run, vocationsQuery } = require('../db/queries');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateVocation',
  inputFields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    vocationEdge: {
      type: _.getEdgeType('http://foo.com#Vocation'),
      resolve: ({ vocation: { id } }) => run(vocationsQuery).then(vocations => {
        const vocation = vocations.find(s => s.id === id);

        return {
          cursor: cursorForObjectInConnection(vocations, vocation),
          node: vocation,
        };
      }),
    },
    individuals: IndividualsType.field,
  },
  mutateAndGetPayload: ensureAuth(({ label }, context) => {
    const vocation = createResource('Vocation', context, { label });

    return db.upsertResource(vocation).then(() => ({ vocation }));
  }),
});
