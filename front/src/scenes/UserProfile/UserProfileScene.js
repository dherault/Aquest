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

  selectVocationInstance = id => this.setState({ selectedVocationInstanceId: id });

  render() {
    const { viewer } = this.props;
    const { selectedVocationInstanceId } = this.state;

    let storyCreationForm = null;

    if (selectedVocationInstanceId) {
      const selectedVocationInstanceEdge = viewer.vocationInstances.edges.find(e => e.node.id === selectedVocationInstanceId);

      // Should always be true
      if (selectedVocationInstanceEdge) {
        storyCreationForm = <StoryCreationForm viewer={viewer} vocationInstance={selectedVocationInstanceEdge.node} />
      }
    }

    return (
      <BackgroundImage src={viewer.backgroundImageUrl}>
        <NavBar viewer={viewer} />

        <BackgroundImage.Content>
          <section className="rcc" style={{ marginTop: '4rem' }}>
            <UserShowcase
              user={viewer}
              onVocationInstanceClick={this.selectVocationInstance}
            />
          </section>

          <section>
            {storyCreationForm}
          </section>

          <section>
            <StoriesList viewer={viewer} />
          </section>
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

    vocationInstances(first: 4) @connection(key: "user_vocationInstances") {
      edges {
        node {
          id
          ...StoryCreationForm_vocationInstance
        }
      }
    }

    ...NavBar_viewer
    ...UserShowcase_user
    ...StoriesList_viewer
    ...StoryCreationForm_viewer
  }
`);
