// import './Skills.css';
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

class LandingScene extends Component {

  state = { signupToggled: true }

  render() {
    const { user } = this.props;

    if (user) return <Redirect to="/user" />;

    const { signupToggled } = this.state;

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1.618, backgroundColor: 'yellow' }}>
          left
        </div>
        <div style={{ flexGrow: 1, backgroundColor: 'grey' }}>
          <button onClick={() => this.setState({ signupToggled: !signupToggled })}>x</button>
          {signupToggled ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(LandingScene, graphql`
  fragment Landing_user on Person {
    id
    pseudo
  }
`);
