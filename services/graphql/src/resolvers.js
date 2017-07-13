const { getLocalName } = require('semantic-toolkit');
const db = require('./db');
const { run } = require('./db/queries');

const sortCreatedAt = (a, b) => a.createdAt > b.createdAt ? 1 : -1;

module.exports = {
  resolveSourceId(source) {
    return source.id;
  },
  resolveSourcePropertyValue(source, iri) {
    return source[getLocalName(iri)];
  },
  resolveSourceTypes(source) {
    return `http://foo.com#${source.type}`;
  },
  resolveResource(id) {
    return db.readResourceById(id);
  },
  resolveResources(ids) {
    return db.readResourcesById(ids);
  },
  resolveResourcesByPredicate(types, iri, value) {
    const localName = getLocalName(iri);
    const queries = types.map(type => run(db.createQuery(type).filter(localName, value)));

    console.log('resolvePredicate', types.map(getLocalName), localName, value);

    return Promise.all(queries).then(payloads => payloads.reduce((a, b) => a.concat(b), []).sort(sortCreatedAt));
  },
};
