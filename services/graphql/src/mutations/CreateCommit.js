const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { mutationWithClientMutationId, cursorForObjectInConnection } = require('graphql-relay');
const IndividualsType = require('../customTypes/IndividualsType');
const addCommonFields = require('../utils/addCommonFields');
const data = require('../data');
const _ = require('../graph');

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
      resolve: ({ commit, user }) => ({
        cursor: cursorForObjectInConnection(data.filter(x => x.type === 'Commit' && x.sourcePerson === user.id), commit),
        node: commit,
      }),
    },
    user: {
      type: _.getObjectType('http://foo.com#Person'),
      resolve: ({ user }) => user,
    },
  },
  mutateAndGetPayload({ skillId, label }, context) {
    const user = data.find(x => x.id === context.userId);

    if (!data.find(x => x.id === skillId)) throw new Error('Skill not found');

    const commit = addCommonFields(context, {
      skill: skillId,
      label,
      type: 'Commit',
      id: Math.random().toString().slice(2),
    });

    data.push(commit);

    // console.log(JSON.stringify(data, null, 2));

    // return new Promise(resolve => setTimeout(() => resolve({ commit }), 2000));
    return { commit, user };
  },
});
