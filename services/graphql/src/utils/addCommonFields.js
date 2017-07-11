function addCommonFields(context, newResource) {
  const nowIso = new Date().toISOString();

  return Object.assign(newResource, {
    createdAt: nowIso,
    updatedAt: nowIso,
    sourcePerson: context.userId,
    sourceIp: '0.0.0.0',
  });
}

module.exports = addCommonFields;
