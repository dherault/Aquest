import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation CreateSkillInstanceMutation($input: CreateSkillInstanceInput!) {
    createSkillInstance(input: $input) {
      skillInstanceEdge {
        __typename
        cursor
        node {
          id
          level
          skill {
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
  const conn = ConnectionHandler.getConnection(viewerProxy, 'viewer_skillInstances');
  // console.log('viewerProxy', viewerProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

// let tempId = 0;

const createSkillInstance = (skillId, viewer) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      skillId: toClearId(skillId),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const payload = store.getRootField('createSkillInstance');

    if (!payload) return console.log('No payload');

    const newEdge = payload.getLinkedRecord('skillInstanceEdge');

    sharedUpdater(store, viewer, newEdge);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newSkillInstance:' + tempId++;
  //   const node = store.create(id, 'SkillInstance');
  //   node.setValue(label, 'label');
  //   node.setValue(id, 'id');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'SkillInstanceEdge');
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

export default createSkillInstance;
