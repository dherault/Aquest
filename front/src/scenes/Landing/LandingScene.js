import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'react-router-dom';

import SignupForm from './components/SignupForm';
import Footer from '../../components/Footer';

import profileLocationFor from '../../utils/profileLocationFor';

const sMain = {
  backgroundSize: '100% auto',
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(/images/comet.jpg)',
};

class LandingScene extends Component {

  state = { signupToggled: false }

  render() {
    const { viewer } = this.props;
    const { signupToggled } = this.state;

    const continueLocation = viewer ? profileLocationFor(viewer) : '/login';

    return (
      <div className="y8 has-screen-height" style={sMain}>
        <div className="y5 has-white-color" style={{ flexGrow: 1, maxWidth: '50%' }}>
          <p style={{ textAlign: 'center', fontSize: '3.5rem', fontWeight: 700 }}>
            Aquest is a real life role-playing game for self-learners, students, athletes and passionate people.
          </p>

          {signupToggled ? (
            <div>
              <SignupForm />
            </div>
          ) : (
            <div className="x5b">
              <button style={{ marginRight: '1rem' }} onClick={() => this.setState({ signupToggled: !signupToggled })}>
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
        <Footer invert />
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
