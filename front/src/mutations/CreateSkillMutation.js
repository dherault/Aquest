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

const createSkill = (input, individuals) => console.log('input:', input) || commitMutation(environment, {
  mutation,
  variables: { input },
  updater(store) {
    const newEdge = store.getRootField('createSkill').getLinkedRecord('skillEdge');
    console.log('neww': newEdge);
    sharedUpdater(store, individuals, newEdge);
  },
  // optimisticResponse: () => ({
  //   skill: variables,
  // }),
  // onCompleted?: ?(response: ?Object) => void,
  // onError?: ?(error: Error) => void,
  // optimisticResponse?: ?() => Object,
  // optimisticUpdater?: ?(store: RecordSourceProxy) => void,
  // updater?: ?(store: RecordSourceSelectorProxy) => void,
});

export default createSkill
