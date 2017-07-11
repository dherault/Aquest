import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../relayEnvironment';

const mutation = graphql`
  mutation CreateSkillMutation($input: CreateSkillInput!) {
    createSkill(input: $input) {
      skillEdge {
        __typename
        cursor
        node {
          id
          label
        }
      }
      individuals {
        id
      }
    }
  }
`;

function sharedUpdater(store, individuals, newEdge) {
  // console.log('individuals', individuals);
  const individualsProxy = store.get(individuals.id);
  const conn = ConnectionHandler.getConnection(individualsProxy, 'SkillList_skills');
  // console.log('individualsProxy', individualsProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempId = 0;

const createSkill = (input, individuals) => commitMutation(environment, {
  mutation,
  variables: { input },
  updater(store) {
    const newEdge = store.getRootField('createSkill').getLinkedRecord('skillEdge');
    sharedUpdater(store, individuals, newEdge);
  },
  optimisticUpdater(store) {
    const id = 'client:newSkill:' + tempId++;
    const node = store.create(id, 'Skill');
    node.setValue(input.label, 'label');
    node.setValue(id, 'id');

    const newEdge = store.create('client:newEdge:' + tempId++, 'SkillEdge');

    newEdge.setLinkedRecord(node, 'node');

    sharedUpdater(store, individuals, newEdge);
  },
});

export default createSkill
