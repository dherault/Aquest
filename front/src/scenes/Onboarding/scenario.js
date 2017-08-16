import { P1 } from './casting';

export default {
  start(_) {
    _.wait(0);
    _.show(P1);
    _.wait(2000);
    _.hide(P1);
  },
};
