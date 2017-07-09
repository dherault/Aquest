const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const IndividualsType = require('./customTypes/IndividualsType');
const data = require('./data');
const _ = require('./graph');

const createSkill = require('./mutations/CreateSkill');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: _.nodeField,
      user: {
        type: _.getObjectType('http://foo.com#Person'),
        resolve: () => data[0],
      },
      individuals: IndividualsType.field,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createSkill,
    },
  }),
});
