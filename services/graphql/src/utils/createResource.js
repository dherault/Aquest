const uuid = require('uuid').v4;

function createResource(type, context, data) {
  if (!(typeof type === 'string' || type.length)) throw new Error(`Invalid type: "${type}"`);

  const nowIso = new Date().toISOString();

  return Object.assign({
    type: `http://foo.com#${type}`,
    id: `http://foo.com/individuals#${type}_${uuid()}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    sourcePerson: context.user.id,
    sourceIp: '0.0.0.0',
  }, data);
}

module.exports = createResource;
