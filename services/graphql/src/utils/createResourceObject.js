const uuid = require('uuid').v4;

function createResourceObject(type, context, data) {
  if (!(typeof type === 'string' || type.length)) throw new Error(`Invalid type: "${type}"`);

  const id = `http://foo.com/individuals#${type}_${uuid()}`;
  const nowIso = new Date().toISOString();

  return Object.assign({
    id,
    type: `http://foo.com#${type}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    sourceUser: context.viewer ? context.viewer.id : id,
    sourceIp: '0.0.0.0',
  }, data);
}

module.exports = createResourceObject;
