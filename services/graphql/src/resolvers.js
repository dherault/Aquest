const { getLocalName } = require('semantic-toolkit');
const { query, findResource, findResources } = require('./db');

const sortCreatedAt = (a, b) => a.createdAt > b.createdAt ? 1 : -1;

module.exports = {
  resolveSourceId(source) {
    return source.id;
  },
  resolveSourcePropertyValue(source, iri) {
    return source[getLocalName(iri)];
  },
  resolveSourceTypes(source) {
    return source.type;
  },
  resolveResource(id) {
    return findResource(id);
  },
  resolveResources(ids) {
    return findResources(ids);
  },
  resolveResourcesByPredicate(types, iri, value) {
    const localName = getLocalName(iri);
    // console.log('resolveResourcesByPredicate', types, localName, value);

    return query(db => {
      const queries = types.map(type => db
        .collection(getLocalName(type))
        .find({ [localName]: value })
        .toArray()
      );

      return Promise.all(queries).then(payloads => payloads.reduce((a, b) => a.concat(b), []).sort(sortCreatedAt));
    });
  },
};
