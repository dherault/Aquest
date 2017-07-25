const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');
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
      resolve: (source, args) => connectionFromPromisedArray(
        query(db => db
          .collection('Vocation')
          .find()
          .sort({ createdAt: 1 })
          .toArray()
          // todo: use connectionArgs
        ),
        args
      ),
    },

    user: {
      type: _.getObjectType('http://foo.com#User'),
      args: {
        pseudo: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (source, { pseudo }) => query(db => db
        .collection('User')
        .findOne({ pseudo })
      ),
    },
  },
});

IndividualsType.field = {
  type: IndividualsType,
  resolve: () => ({}),
};

module.exports = IndividualsType;
