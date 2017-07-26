const uuid = require('uuid').v4;

// Create a POJO representing a Thing in our model
function createResourceObject(type, context, data) {
  if (!(typeof type === 'string' && type.length)) throw new Error(`Invalid type: "${type}"`);

  // ids contain the type for easy type extracting and debuging
  // without it, fetching a resource by id using mongodb would be hard
  // we wouldn't know what collection to look into
  // (we choose to assign a collection for each type)
  const id = `http://foo.com/individuals#${type}_${uuid()}`;
  const nowIso = new Date().toISOString();

  return Object.assign({
    id,
    type: `http://foo.com#${type}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    sourceIp: '0.0.0.0',
    // The only time we allow anonymous resource creation is to create a new user
    sourceUser: context.viewer ? context.viewer.id : id,
  }, data);
}

module.exports = createResourceObject;
