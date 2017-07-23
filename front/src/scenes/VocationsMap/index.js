import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import VocationsMapScene from './VocationsMapScene';

const query = graphql`
  query VocationsMapQuery {
    viewer {
      ...AuthBouncer_viewer
      ...VocationsMapScene_viewer
    }
    individuals {
      ...VocationsMapScene_individuals
    }
  }
`;

const VocationsMap = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return (
        <AuthBouncer {...props}>
          <VocationsMapScene {...routerProps} {...props} />
        </AuthBouncer>
      );
    }}
  />
);

export default VocationsMap;
