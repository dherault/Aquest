import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import commitMutation from '../utils/commitMutation';

const mutation = graphql`
  mutation CreateMilestoneInstanceMutation($input: CreateMilestoneInstanceInput!, $milestoneId: String!) {
    createMilestoneInstance(input: $input) {
      milestoneInstanceEdge {
        __typename
        cursor
        node {
          id
          milestone {
            id
          }
        }
      }
      viewer {
        id
        hasReachedMilestone(milestoneId: $milestoneId)
      }
    }
  }
`;

const createMilestoneInstance = (milestoneId, viewer) => commitMutation({
  mutation,
  variables: {
    input: {
      milestoneId,
      clientMutationId: Math.random().toString().slice(2),
    },
    milestoneId,
  },
  updater(store) {
    const newEdge = store.getRootField('createMilestoneInstance').getLinkedRecord('milestoneInstanceEdge');
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'user_milestoneInstances');

    ConnectionHandler.insertEdgeBefore(conn, newEdge);
  },
});

export default createMilestoneInstance;
