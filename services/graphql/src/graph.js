const fs = require('fs');
const path = require('path');
const SemanticGraph = require('semantic-graphql');

/*
Creating and maintaining a js-based GraphQL schema can be tedious
especially while developing blindly without a plan, not knowing
what the app will look like, what the naming conventions will be.
So we use semantic-graphql to ease the pain by creating universal
(non-performent) resolving functions and maintaining a RDF schema.
Modifying the RDF schema modifies our GraphQL schema without the
need for writing new resolvers and whatnot.
More info at https://github.com/dherault/semantic-graphql
*/

const resolvers = require('./resolvers');

const _ = new SemanticGraph(resolvers, { relay: true });

const inputDir = path.join(__dirname, '../../../ontology');

fs.readdirSync(inputDir).forEach(name => name.endsWith('.ttl') && _.parseFile(path.join(inputDir, name)));

console.log(`graph created: ${_}`);

module.exports = _;
