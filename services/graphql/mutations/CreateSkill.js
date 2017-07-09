const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const IndividualsType = require('../customTypes/IndividualsType');
const data = require('../data');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateSkill',
  inputFields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    skillEdge: {
      type: _.getEdgeType('http://foo.com#Skill'),
      resolve: ({ skill }) => ({
        cursor: cursorForObjectInConnection(data.filter(x => x.type === 'Skill'), skill),
        node: skill,
      }),
    },
    individuals: IndividualsType.field,
  },
  mutateAndGetPayload({ label }) {
    const skill = {
      label,
      type: 'Skill',
      id: Math.random(),
    };

    data.push(skill);

    return { skill };
  },
});
