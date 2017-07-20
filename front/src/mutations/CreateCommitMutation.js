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
      viewer {
        id
      }
    }
  }
`;

const createCommit = (skillId, label, viewer) => commitMutation(environment, {
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
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'viewer_commits');

    ConnectionHandler.insertEdgeBefore(conn, newEdge);
  },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createCommit;
