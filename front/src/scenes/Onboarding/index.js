import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import OnboardingScene from './OnboardingScene';

const query = graphql`
  query OnboardingQuery {
    viewer {
      ...AuthBouncer_viewer
      ...OnboardingScene_viewer
    }
  }
`;

const Onboarding = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return (
        <AuthBouncer {...props}>
          <OnboardingScene {...routerProps} viewer={props.viewer} />
        </AuthBouncer>
      );
    }}
  />
);

export default Onboarding;
