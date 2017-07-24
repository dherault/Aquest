import { storyMutation, graphql } from 'react-relay';
import environment from '../relayEnvironment';

const mutation = graphql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      token
    }
  }
`;

const createUser = (email, password) => storyMutation(environment, {
  mutation,
  variables: {
    input: {
      email,
      password,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  onCompleted(response, errors) {
    console.log('errors:', errors);

    const { token } = response.createUser;

    console.log('Got auth token!', token);

    localStorage.setItem('token', token);

    window.location.href = '/user';
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createUser;
