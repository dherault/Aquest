require('./customFields');

const fs = require('fs');
const path = require('path');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const IndividualsType = require('./customTypes/IndividualsType');
const _ = require('./graph');

const mutationFields = {};
const mutationDir = path.join(__dirname, './mutations/');

fs.readdirSync(mutationDir).forEach(fileName => {
  mutationFields[fileName.split('.js')[0]] = require(mutationDir + fileName);
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: _.nodeField,
      individuals: IndividualsType.field,
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
