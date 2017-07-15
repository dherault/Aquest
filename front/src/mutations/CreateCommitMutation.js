import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation CreateCommitMutation($input: CreateCommitInput!) {
    createCommit(input: $input) {
      commitEdge {
        __typename
        cursor
        node {
          id
          label
          createdAt
          skill {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'user_commits');
  // console.log('userProxy', userProxy);
  // console.log('conn', conn);
  // console.log('newEdge', newEdge.getDataID());

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

// let tempId = 0;

const createCommit = (skillId, label, user) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      label,
      skillId: toClearId(skillId),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const newEdge = store.getRootField('createCommit').getLinkedRecord('commitEdge');
    sharedUpdater(store, user, newEdge);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newCommit:' + tempId++;
  //   const node = store.create(id, 'Commit');
  //   node.setValue(input.label, 'label');
  //   node.setValue(id, 'id');
  //
  //   console.log('node', node);
  //   // node.setValue(input.skillId, 'skill');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'CommitEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, newEdge);
  // },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createCommit;
