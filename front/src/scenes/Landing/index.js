import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import LandingScene from './LandingScene';

const query = graphql`
  query LandingQuery {
    viewer {
      ...LandingScene_viewer
    }
  }
`;

const Landing = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return <LandingScene {...routerProps} {...props} />;
    }}
  />
);

export default Landing;
