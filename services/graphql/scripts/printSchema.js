#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { printSchema } = require('graphql/utilities');
const schema = require('../src/schema');

const out = path.join(__dirname, '../../../dist/schema.graphql');

// Save user readable type system shorthand of schema
fs.writeFileSync(out, printSchema(schema));

console.log('GraphQL schema saved on disk.');
