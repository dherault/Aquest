const db = require('@google-cloud/datastore')({ projectId: 'aquest-project' });
const { getLocalName } = require('semantic-toolkit');

db.keyForResource = resource => db.key([resource.type, resource.id]);

db.upsertResource = resource => new Promise((resolve, reject) => {
  if (!resource.id && resource.type) throw new Error(`Invalid resource: ${JSON.stringify(resource)}`);

  const key = db.keyForResource(resource);

  db.save({
    key,
    data: resource,
    method: 'upsert',
  }, err => err ? reject(err) : resolve(resource));
});

db.readResourceById = id => new Promise((resolve, reject) => {
  console.log('readResourceById', id);

  if (!(typeof id === 'string' && id.length)) {
    console.error(`Warning - invalid readResourceById arg: ${id}`);

    return resolve(null);
  }

  const resourceTypeIri = `http://foo.com#${getLocalName(id).split('_')[0]}`;
  const key = db.key([resourceTypeIri, id]);

  db.get(key, (err, entity) => err ? reject(err) : resolve(entity));
});

db.readResourcesById = ids => new Promise((resolve, reject) => {
  console.log('readResourcesById', ids);

  if (!Array.isArray(ids)) {
    console.error(`Warning - invalid readResourcesById arg: ${ids}`);

    return resolve([]);
  }

  if (!ids.length) return resolve([]);

  const keys = ids.map(id => {
    const resourceTypeIri = `http://foo.com#${getLocalName(id).split('_')[0]}`;

    return db.key([resourceTypeIri, id]);
  });

  db.get(keys, (err, entities) => err ? reject(err) : resolve(entities));
});

/* --- */

// Script in code u_u TODO: remove
// const firstUserResource = {
//   id: 'http://foo.com/individuals#User_firstUser',
//   type: 'http://foo.com#User',
//   firstName: 'Andy',
//   lastName: 'Tryhard',
//   intro: 'And harder',
// };
//
// const firstUserKey = db.keyForResource(firstUserResource);
//
// db.firstUserKey = firstUserKey;
//
// db.get(firstUserKey, (err, entity) => {
//   if (err) return console.error(err);
//
//   if (!entity) {
//     db.save({ data: firstUserResource, key: firstUserKey }, err => {
//       if (err) return console.log(err);
//
//       console.log('First user created');
//     });
//   }
//   else {
//     console.log('First user already present');
//   }
// });

// db.delete(firstUserKey);

module.exports = db;
