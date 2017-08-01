import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

const parts = [
  <h1 key="0">Aquest Technologies presents...</h1>,
  <div key="1">(We do not have any sound yet so please play some epic music in your head)</div>,
  <h1 key="2">Aquest</h1>,
];

class OnboardingScene extends Component {

  state = { onScreen: [] }

  componentDidMount() {
    // Reset body background, see SignupForm component
    document.body.style.backgroundColor = '';

    setTimeout(() => this.setState({ onScreen: [0, 1] }), 1000);
    setTimeout(() => this.setState({ onScreen: [2] }), 5500);
  }

  render() {
    const { onScreen } = this.state;

    const displayedParts = parts.filter((part, i) => onScreen.includes(i));

    return (
      <div className="y5 has-black-background has-white-color has-screen-height">
        {displayedParts}
      </div>
    );
  }
}

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
