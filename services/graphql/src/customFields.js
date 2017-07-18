const { GraphQLString } = require('graphql');
// const data = require('./data');
const _ = require('./graph');

// Add a debug "IRI" field because those Relay ids are not helping
_.addFieldOnObjectType('http://foo.com#Thing', 'iri', {
  type: GraphQLString,
  resolve: source => source.id,
});

_['http://www.w3.org/2000/01/rdf-schema#label'].isGraphqlList = false;

_['http://foo.com#skillInstances'].isRelayConnection = true;
_['http://foo.com#commits'].isRelayConnection = true;
