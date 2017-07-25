import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import StoryCreationForm from './components/StoryCreationForm';
import StoriesList from './components/StoriesList';

import UserShowcase from '../../components/UserShowcase';
import NavBar from '../../components/NavBar';
import BackgroundImage from '../../components/BackgroundImage';
import Footer from '../../components/Footer';

class UserProfileScene extends Component {

  // If a vocationInstance is selected, it means a story is being created
  state = { selectedVocationInstanceId: '' }

  setSelectedVocationInstanceId = id => this.setState({ selectedVocationInstanceId: id || '' });

  render() {
    const { viewer } = this.props;
    const { selectedVocationInstanceId } = this.state;

    return (
      <BackgroundImage src={viewer.backgroundImageUrl}>
        <NavBar viewer={viewer} />

        <BackgroundImage.Content>
          <section className="rcc" style={{ margin: '4rem 0 4rem 0' }}>
            <UserShowcase
              user={viewer}
              setSelectedVocationInstanceId={this.setSelectedVocationInstanceId}
              selectedVocationInstanceId={selectedVocationInstanceId}
            />
          </section>

          {selectedVocationInstanceId ? (
            <section>
              <StoryCreationForm
                viewer={viewer}
                selectedVocationInstanceId={selectedVocationInstanceId}
                onSubmit={this.setSelectedVocationInstanceId}
              />
            </section>
          ) : (
            <section>
              <StoriesList viewer={viewer} />
            </section>
          )}

        </BackgroundImage.Content>

        <Footer />
      </BackgroundImage>
    );
  }
}

export default createFragmentContainer(UserProfileScene, graphql`
  fragment UserProfileScene_viewer on User {
    id
    backgroundImageUrl

    ...NavBar_viewer
    ...UserShowcase_user
    ...StoriesList_viewer
    ...StoryCreationForm_viewer
  }
`);
