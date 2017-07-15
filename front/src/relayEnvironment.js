import { Environment, Network } from 'relay-runtime';
import store from './relayStore';

// Define a function that fetches the results of an operation (query/mutation/etc)
function fetchQuery(operation, variables/* , cacheConfig, uploadables */) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');

  if (token) headers.authorization = `Bearer ${token}`;

  return fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  })
  .then(response => response.json());
}

const network = Network.create(fetchQuery);

const environment = new Environment({
  network,
  store,
});

export default environment;
