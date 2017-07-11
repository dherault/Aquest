const fs = require('fs');
const path = require('path');
const SemanticGraph = require('semantic-graphql');

const resolvers = require('./resolvers');

const inputDir = path.join(__dirname, '../../../ontology');

const _ = new SemanticGraph(resolvers, { relay: true });

fs.readdirSync(inputDir).forEach(name => name.endsWith('.ttl') && _.parseFile(path.join(inputDir, name)));

console.log(`graph created: ${_}`);

module.exports = _;
