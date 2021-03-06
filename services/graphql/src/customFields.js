const { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } = require('graphql');
const { connectionFromPromisedArray } = require('graphql-relay');
const { query } = require('./db');
const _ = require('./graph');

_['http://www.w3.org/2000/01/rdf-schema#label'].isGraphqlList = false;

// Add a debug "IRI" field because those Relay ids are not helping
_.addFieldOnObjectType('http://foo.com#Thing', 'iri', {
  type: GraphQLString,
  resolve: source => source.id,
});

// Add user's stories count
_.addFieldOnObjectType('http://foo.com#User', 'storyCount', {
  type: GraphQLInt,
  resolve: ({ id }) => query(db => db
    .collection('Story')
    .count({ sourceUser: id })
  ),
});

// Add user's milestone instance quick access
_.addFieldOnObjectType('http://foo.com#User', 'hasReachedMilestone', {
  type: GraphQLBoolean,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The Milestone\'s local name',
    },
  },
  resolve: ({ id }, { name }) => query(db => db
    .collection('MilestoneInstance')
    .findOne({ sourceUser: id, milestone: `http://foo.com/static_individuals#${name}` })
    .then(milestoneInstance => !!milestoneInstance)
  ),
});

// Manage connections
_['http://foo.com#vocationInstances'].isRelayConnection = true;
_['http://foo.com#stories'].isRelayConnection = true;

// Edit stories resolver to sort them newest to oldest
_['http://foo.com#stories'].graphqlFieldConfigExtension = {
  resolve: (source, args, { viewer }) => connectionFromPromisedArray(
    query(db => db
      .collection('Story')
      .find({ sourceUser: viewer.id })
      .sort({ createdAt: -1 })
      .toArray()
    ),
    args
  ),
};
