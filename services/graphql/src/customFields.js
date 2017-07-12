// const { connectionFromArray } = require('graphql-relay');
// const data = require('./data');
const _ = require('./graph');

_['http://www.w3.org/2000/01/rdf-schema#label'].isGraphqlList = false;

_['http://foo.com#skills'].isRelayConnection = true;
_['http://foo.com#commits'].isRelayConnection = true;
