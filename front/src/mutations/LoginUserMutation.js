import { graphql } from 'react-relay';
import queryString from 'query-string';
import commitMutation from '../utils/commitMutation';
import profileLocationFor from '../utils/profileLocationFor';

const mutation = graphql`
  mutation LoginUserMutation($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        pseudo
      }
    }
  }
`;

const loginUser = (email, password) => commitMutation({
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
  if (!response.loginUser) return console.log('loginUser: no response');

  const { token, user } = response.loginUser;

  localStorage.setItem('token', token);

  const parsed = queryString.parse(window.location.search);

  window.location.href = parsed.r ? decodeURIComponent(parsed.r) : profileLocationFor(user); // LOOOOOOL NOOOOOOOB
});

export default loginUser;
