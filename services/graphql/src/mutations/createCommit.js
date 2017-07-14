const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const createResource = require('../utils/createResource');
const db = require('../db');
const { run } = require('../db/queries');
const _ = require('../graph');

const creatQuery = userId => db.createQuery('http://foo.com#Commit').filter('sourcePerson', userId).order('createdAt');

module.exports = mutationWithClientMutationId({
  name: 'CreateCommit',
  inputFields: {
    skillId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    commitEdge: {
      type: _.getEdgeType('http://foo.com#Commit'),
      resolve: ({ commit: { id } }, args, { user }) => run(creatQuery(user.id)).then(commits => {
        const commit = commits.find(c => c.id === id);

        return {
          cursor: cursorForObjectInConnection(commits, commit),
          node: commit,
        };
      }),
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: (payload, args, { user }) => user,
    },
  },
  mutateAndGetPayload({ skillId, label }, context) {
    const commit = createResource('Commit', context, {
      skill: skillId,
      label,
    });

    return db.upsertResource(commit).then(() => ({ commit }));
    // console.log(JSON.stringify(data, null, 2));

    // return new Promise(resolve => setTimeout(() => resolve({ commit }), 2000));
    // return { commit, user };
  },
});
