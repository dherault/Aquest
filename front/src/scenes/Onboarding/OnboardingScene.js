import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import scenario from './scenario';
/*
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
);*/

class OnboardingScene extends Component {

  state = { onScreen: new Set() }

  componentDidMount() {
    // Reset body background, see SignupForm component
    document.body.style.backgroundColor = '';

    // setTimeout(() => this.setState({ onScreen: ['0', '0_title'] }), 1000);
    // setTimeout(() => this.setState({ onScreen: ['0', '0_title', '0_subtitle'] }), 3000);
    // setTimeout(() => this.setState({ onScreen: ['0'] }), 7000);
    // setTimeout(() => this.setState({ onScreen: ['1', '1_title'] }), 8500);

    this.plan(scenario);
  }

  plan(scenario, prefix = '', Δ = 0) {
    let t = Δ;

    scenario.forEach(({
      always,
      children,
      duration = 3000,
      delay = 0,
      fin = 0,
      fout = 0,
     }, i) => {
      if (always) return;

      const key = `${prefix}${i}_`;

      t += delay;

      setTimeout(() => console.log('show', key, duration) || this.cast(key, true), t);

      if (children) this.plan(children, key, t);

      t += delay + fin + duration;

      setTimeout(() => console.log('hide', key, duration) || this.cast(key, false), t);

      t += fout;

    });
  }

  cast(id, show) {
    const onScreen = new Set(this.state.onScreen);

    onScreen[show ? 'add' : 'delete'](id);

    this.setState({ onScreen });
  }

  renderScenes(scenario, prefix = '') {
    const { onScreen } = this.state;

    return scenario.map(({
      always,
      node,
      children,
      fin = 0,
      fout = 0,
      className = null,
      style = null,
    }, i) => {

      const key = `${prefix}${i}_`;
      const isOnScreen = always || onScreen.has(key);

      const props = {
        key,
        className,
        style: {
          ...style,
          display: always || isOnScreen ? null : 'none',
          opacity: always || isOnScreen ? 1 : 0,
          transition: `opacity ${isOnScreen ? fout : fin}ms linear, dis`,
        },
      };

      if (Array.isArray(children)) {
        return <div {...props}>{this.renderScenes(children, key)}</div>;
      }
      else if (typeof node === 'function') {
        return <div {...props}>{node(props, this.state, this.setState)}</div>;
      }

      return null;
    });
  }

  render() {
    console.log('render onScreen:', ...this.state.onScreen);

    return (
      <div className="y5 has-black-background has-white-color has-screen-height has-relative-position">
        {this.renderScenes(scenario)}
      </div>
    );
  }
}
/*
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
*/

export default createFragmentContainer(OnboardingScene, graphql`
  fragment OnboardingScene_viewer on User {
    id
  }
`);
