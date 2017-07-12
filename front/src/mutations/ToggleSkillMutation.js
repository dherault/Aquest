import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';
import toClearId from '../utils/toClearId';

const mutation = graphql`
  mutation ToggleSkillMutation($input: ToggleSkillInput!) {
    toggleSkill(input: $input) {
      toggled
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

function sharedUpdater(store, user, skillEdge, skillId) {
  // console.log('user', user);
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'User_acquiredSkills');
  const toggled = store.getRootField('toggleSkill').getValue('toggled');

  // console.log('toggled', toggled);

  if (toggled) ConnectionHandler.insertEdgeAfter(conn, skillEdge);
  else ConnectionHandler.deleteNode(conn, skillId);
}

// let tempId = 0;

const toggleSkill = (skillId, user) => commitMutation(environment, {
  mutation,
  variables: { input: { skillId: toClearId(skillId) } },
  updater(store) {
    const skillEdge = store.getRootField('toggleSkill').getLinkedRecord('skillEdge');
    sharedUpdater(store, user, skillEdge, skillId);
  },
  // optimisticUpdater(store) {
  //   const id = 'client:newSkill:' + tempId++;
  //   const node = store.create(id, 'Skill');
  //   node.setValue(input.label, 'label');
  //   node.setValue(id, 'id');
  //
  //   const skillEdge = store.create('client:skillEdge:' + tempId++, 'SkillEdge');
  //
  //   skillEdge.setLinkedRecord(node, 'node');
  //
  //   sharedUpdater(store, user, skillEdge);
  // },
});

export default toggleSkill;
