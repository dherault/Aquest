import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import scenario from './scenario';
import castActor from './castActor';

const actors = {
  aquestPresents: castActor(() => <h1>Aquest Technologies presents</h1>),
};

class OnboardingScene extends Component {

  componentDidMount() {
    // Reset body background, see SignupForm component
    document.body.style.backgroundColor = '';

    scenario.start(actors);
  }

  render() {
    return (
      <div className="y5 has-black-background has-white-color has-screen-height">
        {actors.aquestPresents.element}
      </div>
    );
  }
}

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
