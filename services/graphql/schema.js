const { GraphQLSchema, GraphQLObjectType, GraphQLList } = require('graphql');
const { connectionArgs, connectionFromArray } = require('graphql-relay');
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
      individuals: {
        type: new GraphQLObjectType({
          name: 'Individuals',
          fields: {
            skills: {
              type: _.getConnectionType('http://foo.com#Skill'),
              args: connectionArgs,
              resolve: (source, args) => connectionFromArray(data.filter(n => n.type === 'Skill'), args),
            },
          },
        }),
        resolve: () => ({}),
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createSkill,
    },
  }),
});
