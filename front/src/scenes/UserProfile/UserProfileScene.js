import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import StoryCreationForm from './components/StoryCreationForm';
import StoriesList from './components/StoriesList';

import Layout from '../../components/Layout';
import UserShowcase from '../../components/UserShowcase';

class UserProfileScene extends Component {

  // If a vocationInstance is selected, it means a story is being created
  state = { selectedVocationInstanceId: '' }

  setSelectedVocationInstanceId = id => this.setState({ selectedVocationInstanceId: id || '' });

  render() {
    const { viewer, user } = this.props;
    const { selectedVocationInstanceId } = this.state;
    const userIsViewer = viewer.id === user.id;

    return (
      <Layout viewer={viewer} backgroundImageUrl={user.backgroundImageUrl}>
        <section className="rcc" style={{ margin: '4rem 0 4rem 0' }}>
          <UserShowcase
            user={user}
            setSelectedVocationInstanceId={userIsViewer ? this.setSelectedVocationInstanceId : () => null}
            selectedVocationInstanceId={selectedVocationInstanceId}
          />
        </section>

        {userIsViewer && selectedVocationInstanceId ? (
          <section>
            <StoryCreationForm
              viewer={viewer}
              selectedVocationInstanceId={selectedVocationInstanceId}
              onSubmit={this.setSelectedVocationInstanceId}
            />
          </section>
        ) : (
          <section>
            <StoriesList user={user} />
          </section>
        )}

      </Layout>
    );
  }
}

export default createFragmentContainer(UserProfileScene, graphql`
  fragment UserProfileScene_viewer on User {
    id

    ...Layout_viewer
    ...StoryCreationForm_viewer
  }

  fragment UserProfileScene_user on User {
    id
    backgroundImageUrl

    ...UserShowcase_user
    ...StoriesList_user
  }
`);
