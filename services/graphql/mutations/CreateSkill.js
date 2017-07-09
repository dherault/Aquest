const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId } = require('graphql-relay');
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
    skill: {
      type: _.getObjectType('http://foo.com#Skill'),
      resolve: payload => payload.skill,
    },
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
