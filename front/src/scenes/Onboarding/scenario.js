import React from 'react';

export default [
  {
    fin: 1000,
    fout: 1000,
    duration: 5000,
    className: 'y8',
    children: [
      {
        always: true,
        node: () => <h1>Aquest Technologies presents</h1>,
      },
      {
        fin: 1000,
        delay: 2000,
        node: () => <div>(We do not have any sound yes so please sing epic intro music out loud)</div>,
      },
    ],
  },
  {
    delay: 500,
    fin: 1000,
    fout: 1000,
    duration: 4000,
    // always: true,
    className: 'y8',
    node: () => <h1>Aquest</h1>,
  },
];
