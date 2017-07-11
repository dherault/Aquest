const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const data = require('../data');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'AquireSkill',
  inputFields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    skillEdge: {
      type: _.getEdgeType('http://foo.com#Skill'),
      resolve: ({ user, skill }) => ({
        cursor: cursorForObjectInConnection(user.acquiredSkills.map(id => data.find(x => x.id === id)), skill),
        node: skill,
      }),
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: ({ user }) => user,
    },
  },
  mutateAndGetPayload({ skillId }, { userId }) {
    const user = data.find(x => x.id === userId);
    const skill = data.find(x => x.id === skillId);

    if (!skill) throw new Error('Skill not found');
    if (!user.acquiredSkills) user.acquiredSkills = [];
    if (!user.acquiredSkills.includes(skillId)) {
      user.acquiredSkills.push(skillId);
      user.updatedAt = new Date().toISOString();
    }

    return { user, skill };
  },
});
