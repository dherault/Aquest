const { GraphQLSchema, GraphQLObjectType, GraphQLList } = require('graphql');
const data = require('./data');
const _ = require('./graph');

const createSkill = require('./mutations/createSkill');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: _.nodeField,
      user: {
        type: _.getObjectType('http://foo.com#Person'),
        resolve: () => data[0],
      },
      skills: {
        type: new GraphQLList(_.getObjectType('http://foo.com#Skill')),
        resolve: () => data.filter(n => n.type === 'Skill'),
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
