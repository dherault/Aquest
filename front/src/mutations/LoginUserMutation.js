import { commitMutation, graphql } from 'react-relay';
import environment from '../relayEnvironment';
import queryString from 'query-string';
// import store from '../relayStore';

const mutation = graphql`
  mutation LoginUserMutation($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
    }
  }
`;

const loginUser = (email, password) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      email,
      password,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  // updater(mutationStore) {
  //   const user = mutationStore.getRootField('loginUser').getLinkedRecord('user');
  //   console.log('user:', user);
  //   console.log('store:', store);
  //
  //   window.x = store;
  //   window.a = mutationStore;
  //   window.user = user;
  //
  // },
  onCompleted(response, errors) {
    console.log('errors:', errors);

    const { token } = response.loginUser;

    console.log('Got auth token!', token);

    localStorage.setItem('token', token);

    const parsed = queryString.parse(window.location.search);

    window.location.href = parsed.r ? decodeURIComponent(parsed.r) : '/user'; // LOOOOOOL NOOOOOOOB
  },
  onError(error) {
    console.error('error:', error);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newCommit:' + tempId++;
  //   const node = store.create(id, 'Commit');
  //   node.setValue(input.label, 'label');
  //   node.setValue(id, 'id');
  //
  //   console.log('node', node);
  //   // node.setValue(input.vocationId, 'vocation');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'CommitEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, newEdge);
  // },
});

export default loginUser;
