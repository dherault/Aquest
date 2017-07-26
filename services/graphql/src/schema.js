const fs = require('fs');
const path = require('path');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');

// Apply custom fields before anything else
require('./customFields');

const _ = require('./graph');
const IndividualsType = require('./customTypes/IndividualsType');

// Build mutations from directory
const mutationFields = {};
const mutationDir = path.join(__dirname, './mutations/');

fs.readdirSync(mutationDir).forEach(fileName => {
  mutationFields[fileName.split('.js')[0]] = require(mutationDir + fileName);
});

// Build schema
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Relay's favorite
      node: _.nodeField,
      // Helpers for common app resources
      individuals: IndividualsType.field,
      // Viewer's data entry point
      viewer: {
        type: _.getObjectType('http://foo.com#User'),
        resolve: (source, args, { viewer }) => viewer,
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutationFields,
  }),
});
