import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import UserProfileScene from './UserProfileScene';

const query = graphql`
  query UserProfileQuery($count: Int!, $cursor: String) {
    viewer {
      ...AuthBouncer_viewer
      ...UserProfileScene_viewer
    }
  }
`;

const initialVariables = {
  count: 10,
  cursor: null,
};

const UserProfile = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    variables={initialVariables}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;

      return (
        <AuthBouncer {...props}>
          <UserProfileScene {...routerProps} {...props} />
        </AuthBouncer>
      );
    }}
  />
);

export default UserProfile;
