import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SignupForm from './components/SignupForm';
import Footer from '../../components/Footer';

class LandingScene extends Component {

  state = { signupToggled: false }

  render() {
    const { signupToggled } = this.state;

    return (
      <div className="y8 has-screen-height">
        <div className="y8" style={{ flexGrow: 1 }}>
          <p>
            <strong>Aquest</strong> is a real life role-playing game for self-learners, students, athletes and passionate people.
          </p>

          {signupToggled ? (
            <div>
              <SignupForm />
            </div>
          ) : (
            <div className="x5">
              <button onClick={() => this.setState({ signupToggled: !signupToggled })}>
                Start
              </button>
              <Link to="/login">
                <button>
                  Continue
                </button>
              </Link>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default LandingScene;
