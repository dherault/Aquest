const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const createResource = require('../utils/createResource');
const ensureAuth = require('../utils/ensureAuth');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');

module.exports = mutationWithClientMutationId({
  name: 'CreateSkillInstance',
  inputFields: {
    skillId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    skillInstanceEdge: {
      type: _.getEdgeType('http://foo.com#SkillInstance'),
      resolve: ({ skillInstance: { id } }, args, { user }) => {
        const query = db.createQuery('http://foo.com#SkillInstance').filter('sourcePerson', user.id);

        return run(query).then(skillInstances => {
          const skillInstance = skillInstances.find(s => s.id === id);

          return {
            cursor: cursorForObjectInConnection(skillInstances, skillInstance),
            node: skillInstance,
          };
        });
      },
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: (payload, args, { user }) => user,
    },
  },
  mutateAndGetPayload: ensureAuth(({ skillId }, context) => {
    const skillInstance = createResource('SkillInstance', context, {
      skill: skillId,
      level: 1,
    });

    return db.upsertResource(skillInstance).then(() => ({ skillInstance }));
  }),
});
