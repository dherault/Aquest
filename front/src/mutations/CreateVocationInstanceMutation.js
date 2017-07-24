import { storyMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation CreateVocationInstanceMutation($input: CreateVocationInstanceInput!) {
    createVocationInstance(input: $input) {
      vocationInstanceEdge {
        __typename
        cursor
        node {
          id
          level
          vocation {
            id
          }
        }
      }
      viewer {
        id
      }
    }
  }
`;

function sharedUpdater(store, viewer, newEdge) {
  // console.log('viewer', viewer);
  const viewerProxy = store.get(viewer.id);
  const conn = ConnectionHandler.getConnection(viewerProxy, 'viewer_vocationInstances');
  // console.log('viewerProxy', viewerProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

// let tempId = 0;

const createVocationInstance = (vocationId, viewer) => storyMutation(environment, {
  mutation,
  variables: {
    input: {
      vocationId: toClearId(vocationId),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const payload = store.getRootField('createVocationInstance');

    if (!payload) return console.log('No payload');

    const newEdge = payload.getLinkedRecord('vocationInstanceEdge');

    sharedUpdater(store, viewer, newEdge);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newVocationInstance:' + tempId++;
  //   const node = store.create(id, 'VocationInstance');
  //   node.setValue(label, 'label');
  //   node.setValue(id, 'id');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'VocationInstanceEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, viewer, newEdge);
  // },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createVocationInstance;
