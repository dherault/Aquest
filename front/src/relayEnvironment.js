import { Environment, Network, RecordSource, Store } from 'relay-runtime'

// Define a function that fetches the results of an operation (query/mutation/etc)
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  return fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  })
  .then(response => response.json());
}

const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);

const environment = new Environment({
  network,
  store,
});

export default environment;
