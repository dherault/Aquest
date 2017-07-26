import { commitMutation, graphql } from 'react-relay';
import environment from '../relayEnvironment';

const mutation = graphql`
  mutation DeleteViewerAccountMutation($input: DeleteViewerAccountInput!) {
    deleteViewerAccount(input: $input) {
      dummyField
    }
  }
`;

const deleteViewerAccount = () => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);

    localStorage.removeItem('token');
    window.location.href = '/';
  },
  onError(error) {
    console.error('onError:', error);
  },
});

export default deleteViewerAccount;
