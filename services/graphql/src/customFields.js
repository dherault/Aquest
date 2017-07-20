const { GraphQLString } = require('graphql');
const { connectionFromPromisedArray } = require('graphql-relay');
const _ = require('./graph');
const db = require('./db');

// Add a debug "IRI" field because those Relay ids are not helping
_.addFieldOnObjectType('http://foo.com#Thing', 'iri', {
  type: GraphQLString,
  resolve: source => source.id,
});

_['http://www.w3.org/2000/01/rdf-schema#label'].isGraphqlList = false;

_['http://foo.com#skillInstances'].isRelayConnection = true;
_['http://foo.com#commits'].isRelayConnection = true;

_['http://foo.com#commits'].graphqlFieldConfigExtension = {
  resolve: (source, args, { viewer }) => connectionFromPromisedArray(
    db.createQuery('http://foo.com#Commit')
      .filter('sourceUser', viewer.id)
      .order('createdAt', { descending: true })
      .run()
      .then(([results]) => results),
    args
  ),
};
