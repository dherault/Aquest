import { commitMutation, graphql } from 'react-relay';
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
          ...Story_story
        }
      }
      viewer {
        id
        storyCount
      }
      vocationInstance {
        id
        level
      }
    }
  }
`;

const createStory = (label, shouldLevelUp, vocationInstance, viewer) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      label,
      hasLeveledUp: shouldLevelUp,
      vocationId: toClearId(vocationInstance.vocation.id),
      vocationInstanceId: toClearId(vocationInstance.id),
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
    console.error('onError:', error);
  },
});

export default createStory;
