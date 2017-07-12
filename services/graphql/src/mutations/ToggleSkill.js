const { GraphQLNonNull, GraphQLID, GraphQLBoolean } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const data = require('../data');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'ToggleSkill',
  inputFields: {
    skillId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    toggled: {
      type: GraphQLBoolean,
      resolve: ({ toggled }) => toggled,
    },
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

    console.log('data', data.filter(t => t.type === 'Skill').map(t => t.id));
    if (!skill) throw new Error('Skill not found');
    if (!user.acquiredSkills) user.acquiredSkills = [];

    const acquiredSkillIds = new Set(user.acquiredSkills);
    const prevToggled = acquiredSkillIds.has(skillId);

    if (prevToggled) acquiredSkillIds.delete(skillId);
    else acquiredSkillIds.add(skillId);

    user.acquiredSkills = [...acquiredSkillIds];
    user.updatedAt = new Date().toISOString();

    return { user, skill, toggled: !prevToggled };
  },
});
