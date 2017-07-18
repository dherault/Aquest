import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation CreateSkillInstanceMutation($input: CreateSkillInstanceInput!) {
    createSkillInstance(input: $input) {
      skillInstanceEdge {
        __typename
        cursor
        node {
          id
        }
      }
      user {
        id
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  // console.log('user', user);
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'user_skillInstances');
  // console.log('userProxy', userProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

// let tempId = 0;

const createSkillInstance = (skillId, user) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      skillId: toClearId(skillId),
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const payload = store.getRootField('createSkillInstance');

    if (!payload) return console.log('No payload');

    const newEdge = payload.getLinkedRecord('skillInstanceEdge');

    sharedUpdater(store, user, newEdge);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newSkillInstance:' + tempId++;
  //   const node = store.create(id, 'SkillInstance');
  //   node.setValue(label, 'label');
  //   node.setValue(id, 'id');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'SkillInstanceEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, newEdge);
  // },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createSkillInstance;
