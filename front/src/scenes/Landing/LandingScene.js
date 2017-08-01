import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'react-router-dom';

import SignupForm from './components/SignupForm';
import Footer from '../../components/Footer';

import profileLocationFor from '../../utils/profileLocationFor';

class LandingScene extends Component {

  state = { signupToggled: false }

  render() {
    const { viewer } = this.props;
    const { signupToggled } = this.state;

    const continueLocation = viewer ? profileLocationFor(viewer) : '/login';

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
              <Link to={continueLocation}>
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

export default createFragmentContainer(LandingScene, graphql`
  fragment LandingScene_viewer on User {
    id
    pseudo
  }
`);
