import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

class OnboardingScene extends Component {

  render() {

    return (
      <div>onboarding</div>
    );
  }
}

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
