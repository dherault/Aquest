import { commitMutation } from 'react-relay';
import environment from '../relayEnvironment';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Relay mutation wrapper for promise support and logging
function customCommitMutation(mutationConfiguration) {

  return new Promise((resolve, reject) => (
    commitMutation(environment, {
      ...mutationConfiguration,
      onCompleted(response, errors) {
        if (isDevelopment && errors) {
          console.warn(`${errors.length} GraphQL error${errors.length > 1 ? 's' : ''}`);
          errors.forEach(error => console.warn(error));
        }

        resolve({ response, errors });
      },
      onError(error) {
        if (isDevelopment) {
          console.error('Mutation error:');
          console.error(error);
        }

        reject(error);
      },
    })
  ));
}

export default customCommitMutation;
