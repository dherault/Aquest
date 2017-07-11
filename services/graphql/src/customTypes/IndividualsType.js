const { GraphQLObjectType } = require('graphql');
const { globalIdField, connectionArgs, connectionFromArray } = require('graphql-relay');
const data = require('../data');
const _ = require('../graph');

const IndividualsType = new GraphQLObjectType({
  name: 'Individuals',
  interfaces: [_.nodeInterface],
  fields: {
    id: globalIdField('Individuals', () => 'individuals'),
    skills: {
      type: _.getConnectionType('http://foo.com#Skill'),
      args: connectionArgs,
      resolve: (source, args) => connectionFromArray(data.filter(n => n.type === 'Skill'), args),
    },
  },
});

IndividualsType.field = {
  type: IndividualsType,
  resolve: () => ({}),
};

module.exports = IndividualsType;
