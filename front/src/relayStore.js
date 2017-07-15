import { RecordSource, Store } from 'relay-runtime';

const source = new RecordSource();
const store = new Store(source);

export default store;
