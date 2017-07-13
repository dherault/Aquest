const { GraphQLObjectType } = require('graphql');
const { globalIdField, connectionArgs, connectionFromPromisedArray } = require('graphql-relay');
const { run, skillsQuery } = require('../db/queries');
const _ = require('../graph');

const IndividualsType = new GraphQLObjectType({
  name: 'Individuals',
  interfaces: [_.nodeInterface],
  fields: {
    id: globalIdField('Individuals', () => 'individuals'),
    skills: {
      type: _.getConnectionType('http://foo.com#Skill'),
      args: connectionArgs,
      resolve: (source, args) => connectionFromPromisedArray(run(skillsQuery), args),
    },
  },
});

IndividualsType.field = {
  type: IndividualsType,
  resolve: () => ({}),
};

module.exports = IndividualsType;
