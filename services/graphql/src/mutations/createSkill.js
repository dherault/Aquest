const { GraphQLNonNull, GraphQLString } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const IndividualsType = require('../customTypes/IndividualsType');
const createResource = require('../utils/createResource');
const ensureAuth = require('../utils/ensureAuth');
const db = require('../db');
const { run, skillsQuery } = require('../db/queries');
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
      resolve: ({ skill: { id } }) => run(skillsQuery).then(skills => {
        const skill = skills.find(s => s.id === id);

        return {
          cursor: cursorForObjectInConnection(skills, skill),
          node: skill,
        };
      }),
    },
    individuals: IndividualsType.field,
  },
  mutateAndGetPayload: ensureAuth(({ label }, context) => {
    const skill = createResource('Skill', context, { label });

    return db.upsertResource(skill).then(() => ({ skill }));
  }),
});
