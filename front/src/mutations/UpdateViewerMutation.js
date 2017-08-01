import { graphql } from 'react-relay';
import commitMutation from '../utils/commitMutation';

const mutation = graphql`
  mutation UpdateViewerMutation($input: UpdateViewerInput!) {
    updateViewer(input: $input) {
      viewer {
        id
        email
        pseudo
        description
        hasPrivateProfile
      }
    }
  }
`;

const updateViewer = input => commitMutation({
  mutation,
  variables: {
    input: {
      ...input,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
});

export default updateViewer;
