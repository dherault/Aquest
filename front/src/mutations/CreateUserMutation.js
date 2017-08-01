import { graphql } from 'react-relay';
import commitMutation from '../utils/commitMutation';

const mutation = graphql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      token
      user {
        id
      }
    }
  }
`;

const createUser = (email, password) => commitMutation({
  mutation,
  variables: {
    input: {
      email,
      password,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
})
.then(({ response }) => {
  if (!response.createUser) return console.log('createUser: no response');

  const { token, user } = response.createUser;

  localStorage.setItem('token', token);

  return user;
});

export default createUser;
