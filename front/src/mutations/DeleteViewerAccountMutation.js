import { graphql } from 'react-relay';
import commitMutation from '../utils/commitMutation';

const mutation = graphql`
  mutation DeleteViewerAccountMutation($input: DeleteViewerAccountInput!) {
    deleteViewerAccount(input: $input) {
      dummyField
    }
  }
`;

const deleteViewerAccount = () => commitMutation({
  mutation,
  variables: {
    input: {
      clientMutationId: Math.random().toString().slice(2),
    },
  },
})
.then(() => {
  localStorage.removeItem('token');
  window.location.href = '/';
});

export default deleteViewerAccount;
