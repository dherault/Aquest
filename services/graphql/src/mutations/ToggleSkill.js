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
        cursor: cursorForObjectInConnection(user.skills.map(id => data.find(x => x.id === id)), skill),
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
    if (!user.skills) user.skills = [];

    const userSkillIds = new Set(user.skills);
    const prevToggled = userSkillIds.has(skillId);

    if (prevToggled) userSkillIds.delete(skillId);
    else userSkillIds.add(skillId);

    user.skills = [...userSkillIds];
    user.updatedAt = new Date().toISOString();

    return { user, skill, toggled: !prevToggled };
  },
});
