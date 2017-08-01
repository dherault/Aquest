import { graphql } from 'react-relay';
import queryString from 'query-string';
import commitMutation from '../utils/commitMutation';
import profileLocationFor from '../utils/profileLocationFor';

const mutation = graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      token
      viewer {
        pseudo
      }
    }
  }
`;

const login = (email, password) => commitMutation({
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
  if (!response.login) return console.log('login: no response');

  const { token, viewer } = response.login;

  localStorage.setItem('token', token);

  const parsed = queryString.parse(window.location.search);

  window.location.href = parsed.r ? decodeURIComponent(parsed.r) : profileLocationFor(viewer); // LOOOOOOL NOOOOOOOB
});

export default login;
