import React, { Component } from 'react';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

class LandingScene extends Component {

  state = { signupToggled: true }

  render() {
    const { signupToggled } = this.state;

    return (
      <div className="columns">
        <div className="column is-two-thirds">
          <section className="">
            <div className="">
              <div className="">
                <h1 className="title">
                  Aquest is a tool for self-learners, students and passionate people
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

export default LandingScene;
