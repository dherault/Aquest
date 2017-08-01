function profileLocationFor(user) {
  return `/~${window.encodeURIComponent(user.pseudo)}`;
}

export default profileLocationFor;
