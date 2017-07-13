require('./customFields');

const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const IndividualsType = require('./customTypes/IndividualsType');
const _ = require('./graph');

const createCommit = require('./mutations/CreateCommit');
const createSkill = require('./mutations/CreateSkill');
const toggleSkill = require('./mutations/ToggleSkill');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: _.nodeField,
      user: {
        type: _.getObjectType('http://foo.com#Person'),
        resolve: (source, args, { user }) => user,
      },
      individuals: IndividualsType.field,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createCommit,
      createSkill,
      toggleSkill,
    },
  }),
});
