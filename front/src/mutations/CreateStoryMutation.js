import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import toClearId from '../utils/toClearId';
import commitMutation from '../utils/commitMutation';

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

const createStory = (label, shouldLevelUp, vocationInstance, viewer) => commitMutation({
  mutation,
  variables: {
    input: {
      label,
      hasLeveledUp: shouldLevelUp,
      vocationInstanceId: toClearId(vocationInstance.id),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const newEdge = store.getRootField('createStory').getLinkedRecord('storyEdge');
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'user_stories');

    ConnectionHandler.insertEdgeBefore(conn, newEdge);
  },
});

export default createStory;
