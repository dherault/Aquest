import { storyMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation CreateStoryMutation($input: CreateStoryInput!) {
    createStory(input: $input) {
      storyEdge {
        __typename
        cursor
        node {
          id
          label
          createdAt
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

const createStory = (vocationId, label, viewer) => storyMutation(environment, {
  mutation,
  variables: {
    input: {
      label,
      vocationId: toClearId(vocationId),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const newEdge = store.getRootField('createStory').getLinkedRecord('storyEdge');
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'viewer_stories');

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

export default createStory;
