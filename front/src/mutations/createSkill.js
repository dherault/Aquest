import { commitMutation, graphql } from 'react-relay'
import environment from '../relayEnvironment'

console.log('environment:', environment);

const createSkill = skill => console.log('skill:', skill) || commitMutation(environment, {
  variables: { input: skill },
  mutation: graphql`
    mutation createSkillMutation($input: createSkillInput!) {
      createSkill(input: $input) {
        skill {
          label
        }
      }
    }
  `,
  updater: store => {
    // console.log('updated');
    // console.log(store)
    // console.log(environment.getStore())
    // console.log(store.getRootField('skills'))
  }
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
