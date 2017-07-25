import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../relayEnvironment';

import AuthBouncer from '../../components/AuthBouncer';
import LoadingIndicator from '../../components/LoadingIndicator';
import DevelopmentErrorMessage from '../../components/DevelopmentErrorMessage';

import UserProfileScene from './UserProfileScene';

const query = graphql`
  query UserProfileQuery($pseudo: String!, $count: Int!, $cursor: String) {
    viewer {
      ...AuthBouncer_viewer
      ...UserProfileScene_viewer
    }
    individuals {
      user(pseudo: $pseudo) {
        ...UserProfileScene_user
      }
    }
  }
`;

const UserProfile = routerProps => (
  <QueryRenderer
    query={query}
    environment={environment}
    variables={{
      count: 10,
      cursor: null,
      pseudo: routerProps.match.params.pseudo,
    }}
    render={({ error, props }) => {
      if (error) return <DevelopmentErrorMessage error={error} />;
      else if (!props) return <LoadingIndicator />;
      else if (!props.individuals.user) return <div>User not found</div>;

      return (
        <AuthBouncer {...props}>
          <UserProfileScene {...routerProps} viewer={props.viewer} user={props.individuals.user} />
        </AuthBouncer>
      );
    }}
  />
);

export default UserProfile;
