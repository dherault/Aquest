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
  const conn = ConnectionHandler.getConnection(individualsProxy, 'individuals_skills');
  // console.log('individualsProxy', individualsProxy);
  // console.log('conn', conn);

  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempId = 0;

const createSkill = (label, individuals) => commitMutation(environment, {
  mutation,
  variables: {
    input: {
      label,
      clientMutationId: Math.random().toString().slice(2),
    },
  },
  updater(store) {
    const payload = store.getRootField('createSkill');

    if (!payload) return console.log('No payload');

    const newEdge = payload.getLinkedRecord('skillEdge');

    sharedUpdater(store, individuals, newEdge);
  },
  optimisticUpdater(store) {
    const id = 'client:newSkill:' + tempId++;
    const node = store.create(id, 'Skill');
    node.setValue(label, 'label');
    node.setValue(id, 'id');

    const newEdge = store.create('client:newEdge:' + tempId++, 'SkillEdge');

    newEdge.setLinkedRecord(node, 'node');

    sharedUpdater(store, individuals, newEdge);
  },
  onCompleted(response, errors) {
    console.log('response:', response);
    console.log('errors:', errors);
  },
  onError(error) {
    console.error('error:', error);
  },
});

export default createSkill;
