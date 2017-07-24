const { MongoClient } = require('mongodb');
const { getLocalName } = require('semantic-toolkit');

const url = 'mongodb://localhost:27017/aquest';

let client;

const getDatabaseClient = () => client ? Promise.resolve(client) : (client = MongoClient.connect(url));

const query = fn => getDatabaseClient().then(fn);

const getTypeOfIndividual = id => getLocalName(id).split('_')[0];

const findResource = id => query(db => db.collection(getTypeOfIndividual(id)).findOne({ id }));

const findResources = ids => Promise.all(ids.map(findResource));

const createResource = obj => query(db => db.collection(getTypeOfIndividual(obj.id)).insertOne(obj));

module.exports = {
  getDatabaseClient,
  query,
  findResource,
  findResources,
  createResource,
};
