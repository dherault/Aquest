const { GraphQLObjectType } = require('graphql');
const { globalIdField, connectionArgs, connectionFromPromisedArray } = require('graphql-relay');
const { query } = require('../db');
const _ = require('../graph');

const IndividualsType = new GraphQLObjectType({
  name: 'Individuals',
  interfaces: [_.nodeInterface],
  fields: {
    id: globalIdField('Individuals', () => 'individuals'),
    vocations: {
      type: _.getConnectionType('http://foo.com#Vocation'),
      args: connectionArgs,
      resolve: (source, args) => {
        const queryPromise = query(db => db
          .collection('Vocation')
          .find()
          .sort({ createdAt: 1 })
          .toArray()
          // todo: use connectionArgs
        );

        return connectionFromPromisedArray(queryPromise, args);
      },
    },
  },
});

IndividualsType.field = {
  type: IndividualsType,
  resolve: () => ({}),
};

module.exports = IndividualsType;
