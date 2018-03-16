import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
// import { Shooting } from 'menestrel';
// import scenario from './scenario';
// import { casting } from './casting';

class OnboardingScene extends Component {

  render() {
    return (
      <div />
      // <Shooting
      //   casting={casting}
      //   scenario={scenario}
      //   className="y5 has-black-background has-white-color has-screen-height"
      // />
    );
  }
}

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
