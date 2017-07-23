const { GraphQLObjectType } = require('graphql');
const { globalIdField, connectionArgs, connectionFromPromisedArray } = require('graphql-relay');
const { run, vocationsQuery } = require('../db/queries');
const _ = require('../graph');

const IndividualsType = new GraphQLObjectType({
  name: 'Individuals',
  interfaces: [_.nodeInterface],
  fields: {
    id: globalIdField('Individuals', () => 'individuals'),
    vocations: {
      type: _.getConnectionType('http://foo.com#Vocation'),
      args: connectionArgs,
      resolve: (source, args) => connectionFromPromisedArray(run(vocationsQuery), args),
    },
  },
});

IndividualsType.field = {
  type: IndividualsType,
  resolve: () => ({}),
};

module.exports = IndividualsType;
