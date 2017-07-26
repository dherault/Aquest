// Retrieve a resource's real id from a Relay id
function toClearId(globalId) {
  const fullId = atob(globalId);

  return fullId.substring(fullId.indexOf(':') + 1);
}

export default toClearId;
