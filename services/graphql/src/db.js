const { MongoClient } = require('mongodb');
const { getLocalName } = require('semantic-toolkit');

const url = 'mongodb://localhost:27017';
const dbName = 'aquest';

let db;

const getDatabaseInstance = () => db ? Promise.resolve(db) : MongoClient.connect(url).then(dbClient => db = dbClient.db(dbName));

const query = fn => getDatabaseInstance().then(fn);

const getTypeOfIndividual = id => getLocalName(id).split('_')[0];

const findResource = id => query(db => db.collection(getTypeOfIndividual(id)).findOne({ id }));

const findResources = ids => Promise.all(ids.map(findResource));

const createResource = obj => query(db => db.collection(getTypeOfIndividual(obj.id)).insertOne(obj));

module.exports = {
  // getDatabaseInstance,
  query,
  findResource,
  findResources,
  createResource,
};
