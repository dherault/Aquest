import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

const sLayer = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0,
};

const Layer = ({ children, visible = false }) => (
  <div
    className="y5"
    style={{
      ...sLayer,
      visibility: visible ? 'visible' : 'hidden',
      zIndex: visible ? 1 : -1,
    }}
  >
    {children}
  </div>
);

const sFader = {
  transition: 'opacity 1.5s',
};

const Fader = ({ children, visible = false }) => (
  <div style={{ ...sFader, opacity: visible ? 1 : 0 }}>
    {children}
  </div>
);

class OnboardingScene extends Component {

  state = { onScreen: ['0'] }

  componentDidMount() {
    // Reset body background, see SignupForm component
    document.body.style.backgroundColor = '';

    setTimeout(() => this.setState({ onScreen: ['0', '0_title'] }), 1000);
    setTimeout(() => this.setState({ onScreen: ['0', '0_title', '0_subtitle'] }), 3000);
    setTimeout(() => this.setState({ onScreen: ['0'] }), 7000);
    setTimeout(() => this.setState({ onScreen: ['1', '1_title'] }), 8500);
  }

  render() {
    const { onScreen } = this.state;

    const isOnScreen = i => onScreen.includes(i);

    return (
      <div className="y5 has-black-background has-white-color has-screen-height has-relative-position">

        <Layer visible={isOnScreen('0')}>
          <Fader visible={isOnScreen('0_title')}>
            <h1 className="has-no-select">
              Aquest Technologies presents...
            </h1>
          </Fader>
          <Fader visible={isOnScreen('0_subtitle')}>
            <div className="has-no-select">
              (We do not have any sound yet so please play some epic music in your head)
            </div>
          </Fader>
        </Layer>

        <Layer visible={isOnScreen('1')}>
          <Fader visible={isOnScreen('1_title')}>
            <h1 className="has-no-select">
              Aquest
            </h1>
          </Fader>
        </Layer>

      </div>
    );
  }
}

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
