import { commitMutation, graphql } from 'react-relay';
import environment from '../relayEnvironment';

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

const updateViewer = input => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      ...input,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  onCompleted(response, errors) {
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default updateViewer;
