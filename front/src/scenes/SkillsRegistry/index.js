import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import SkillsRegistryScene from './SkillsRegistryScene';

const query = graphql`
  query SkillsRegistryQuery {
    viewer {
      ...AuthBouncer_viewer
      ...SkillsRegistryScene_viewer
    }
    individuals {
      ...SkillsRegistryScene_individuals
    }
  }
`;

const SkillsRegistry = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return (
        <AuthBouncer {...props}>
          <SkillsRegistryScene {...routerProps} {...props} />;
        </AuthBouncer>
      );
    }}
  />
);

export default SkillsRegistry;
