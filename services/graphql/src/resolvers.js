const { getLocalName } = require('semantic-toolkit');
const data = require('./data');

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
    console.log('resolveResource', id);
    // console.log('typeof id:', typeof id);

    return data.find(n => n.id === id);
  },
  resolveResources(ids) {
    console.log('resolveResources', ids);

    return data.filter(n => ids.includes(n.id));
  },
  resolveResourcesByPredicate(types, iri, value) {
    const typesLocalNames = types.map(getLocalName);
    const localName = getLocalName(iri);

    console.log('resolvePredicate', typesLocalNames, localName, value);

    return data.filter(n => typesLocalNames.includes(n.type) && n[localName] === value);
  },
};
