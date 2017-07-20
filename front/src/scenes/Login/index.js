import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import LoginScene from './LoginScene';

const query = graphql`
  query LoginQuery {
    viewer {
      ...LoginScene_viewer
    }
  }
`;

const Login = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return <LoginScene {...routerProps} {...props} />;
    }}
  />
);

export default Login;
