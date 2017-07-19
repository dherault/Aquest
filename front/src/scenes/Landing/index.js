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
      <div className="columns">
        <div className="column is-two-thirds">
          <section className="hero is-primary">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  Aquest is a tool for self-learners
                </h1>
                <h2 className="subtitle">
                  <ul>
                    <li>Track your progress</li>
                    <li>Stay motivated</li>
                    <li>have fun!</li>
                  </ul>
                </h2>
              </div>
            </div>
          </section>
        </div>
        <div className="column">
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
