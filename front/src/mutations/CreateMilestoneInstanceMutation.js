import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import commitMutation from '../utils/commitMutation';

const mutation = graphql`
  mutation CreateMilestoneInstanceMutation($input: CreateMilestoneInstanceInput!, $milestoneName: String!) {
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
        hasReachedMilestone(name: $milestoneName)
      }
    }
  }
`;

const createMilestoneInstance = (milestoneName, viewer) => commitMutation({
  mutation,
  variables: {
    input: {
      milestoneName,
      clientMutationId: Math.random().toString().slice(2),
    },
    milestoneName,
  },
  updater(store) {
    const newEdge = store.getRootField('createMilestoneInstance').getLinkedRecord('milestoneInstanceEdge');
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'user_milestoneInstances');

    ConnectionHandler.insertEdgeBefore(conn, newEdge);
  },
});

export default createMilestoneInstance;
