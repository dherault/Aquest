import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

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
  updater(store) {
    const token = store.getRootField('loginUser').getValue('token');

    console.log(token);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newCommit:' + tempId++;
  //   const node = store.create(id, 'Commit');
  //   node.setValue(input.label, 'label');
  //   node.setValue(id, 'id');
  //
  //   console.log('node', node);
  //   // node.setValue(input.skillId, 'skill');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'CommitEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, newEdge);
  // },
});

export default loginUser;
