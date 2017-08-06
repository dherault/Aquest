// import React from 'react';

const wait = duration => () => new Promise(_ => setTimeout(_, duration));

const sequence = promisers => {
  if (!promisers.length) return Promise.resolve();

  const firstPromiser = promisers.shift();

  return firstPromiser().then(() => sequence(promisers));
};

const scenario = {
  start(actors, state, next) {

    sequence([
      actors.aquestPresents.mount,
      wait(100),
      () => actors.aquestPresents.setStyle({ opacity: 1 }),
    ]);
  },
};

export default scenario;
