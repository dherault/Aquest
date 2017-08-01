import { graphql } from 'react-relay';
import commitMutation from '../utils/commitMutation';
import profileLocationFor from '../utils/profileLocationFor';

const mutation = graphql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      token
      user {
        pseudo
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

  window.location.href = profileLocationFor(user);
});

export default createUser;
