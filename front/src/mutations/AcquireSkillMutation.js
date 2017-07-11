import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';

const mutation = graphql`
  mutation AcquireSkillMutation($input: AcquireSkillInput!) {
    acquireSkill(input: $input) {
      skillEdge {
        __typename
        cursor
        node {
          id
          label
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
  const conn = ConnectionHandler.getConnection(userProxy, 'User_acquiredSkills');
  // console.log('userProxy', userProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

// let tempId = 0;

const acquireSkill = (input, user) => commitMutation(environment, {
  mutation,
  variables: { input },
  updater(store) {
    const newEdge = store.getRootField('acquireSkill').getLinkedRecord('skillEdge');
    sharedUpdater(store, user, newEdge);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newSkill:' + tempId++;
  //   const node = store.create(id, 'Skill');
  //   node.setValue(input.label, 'label');
  //   node.setValue(id, 'id');
  //
  //   const newEdge = store.create('client:newEdge:' + tempId++, 'SkillEdge');
  //
  //   newEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, newEdge);
  // },
});

export default acquireSkill;
