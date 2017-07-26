import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import UserSettingsScene from './UserSettingsScene';

const query = graphql`
  query UserSettingsQuery {
    viewer {
      ...AuthBouncer_viewer
      ...UserSettingsScene_viewer
    }
  }
`;

const UserSettings = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return (
        <AuthBouncer {...props}>
          <UserSettingsScene {...routerProps} {...props} />
        </AuthBouncer>
      );
    }}
  />
);

export default UserSettings;
