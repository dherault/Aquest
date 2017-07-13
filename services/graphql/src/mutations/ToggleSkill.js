const { GraphQLNonNull, GraphQLID, GraphQLBoolean } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const db = require('../db');
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
      resolve: ({ skillId, toggled }, args, { user }) => {
        if (!toggled) return null;

        return db.readResourcesById(user.skills).then(skills => {
          const skill = skills.find(s => s.id === skillId);

          return {
            cursor: cursorForObjectInConnection(skills, skill),
            node: skill,
          };
        });
      },
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: (payload, args, { user }) => user,
    },
  },
  mutateAndGetPayload({ skillId }, { user }) {
    const userSkillIds = new Set(user.skills);
    const prevToggled = userSkillIds.has(skillId);

    if (prevToggled) userSkillIds.delete(skillId);
    else userSkillIds.add(skillId);

    user.skills = [...userSkillIds];
    user.updatedAt = new Date().toISOString();

    return db.upsertResource(user).then(() => ({ skillId, toggled: !prevToggled }));
  },
});
