import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';

const mutation = graphql`
  mutation CreateVocationMutation($input: CreateVocationInput!) {
    createVocation(input: $input) {
      vocationEdge {
        __typename
        cursor
        node {
          id
          label
        }
      }
    }
  }
`;

function sharedUpdater(store, individuals, newEdge) {
  // console.log('individuals', individuals);
  const individualsProxy = store.get(individuals.id);
  const conn = ConnectionHandler.getConnection(individualsProxy, 'individuals_vocations');
  // console.log('individualsProxy', individualsProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempId = 0;

const createVocation = (label, individuals) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      label,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const payload = store.getRootField('createVocation');

    if (!payload) return console.log('No payload');

    const newEdge = payload.getLinkedRecord('vocationEdge');

    sharedUpdater(store, individuals, newEdge);
  },
  optimisticUpdater(store) {
    const id = 'client:newVocation:' + tempId++;
    const node = store.create(id, 'Vocation');
    node.setValue(label, 'label');
    node.setValue(id, 'id');

    const newEdge = store.create('client:newEdge:' + tempId++, 'VocationEdge');

    newEdge.setLinkedRecord(node, 'node');

    sharedUpdater(store, individuals, newEdge);
  },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createVocation;
