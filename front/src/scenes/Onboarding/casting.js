import React from 'react';
import { Casting } from 'menestrel';

export const casting = new Casting();

export const P1 = casting.add(() => (
  <div className="y8">
    <h1>Aquest Technologies</h1>
    <div>presents</div>
  </div>
), {
  topLevel: true,
  visible: false,
});
