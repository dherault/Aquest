import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import queryString from 'query-string';

import loginUser from '../../mutations/LoginMutation';

import DiskImage from '../../components/DiskImage';
import Footer from '../../components/Footer';

import profileLocationFor from '../../utils/profileLocationFor';

const isProduction = process.env.NODE_ENV === 'production';

class LoginScene extends Component {
  state = isProduction ? { email: '', password: '' } : { email: 'yolo@gmail.com', password: 'yodoyodo' }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    if (isEmail(email) && password.length >= 6) {
      loginUser(email, password)
      .then(viewer => {
        const { router } = this.context;

        if (!viewer.hasCompletedOnboarding) return router.history.push('/new_game');

        const parsed = queryString.parse(router.route.location.search);

        router.history.push(parsed.r ? decodeURIComponent(parsed.r) : profileLocationFor(viewer));
      });
    }
  }

  render() {
    const { viewer } = this.props;
    const { email, password } = this.state;

    return (
      <div className="y8 has-screen-height">

        <DiskImage style={{ margin: '2rem 0' }} />

        <h1>Log in</h1>

        {!!viewer && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            You are already logged in as {viewer.pseudo}.
            <br />
            <Link to={profileLocationFor(viewer)}>Go to profile</Link>
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="y8" style={{ flexGrow: 1 }}>
          <div className="has-bottom-margin">
            <label htmlFor="emailInput">Email</label>
            <input
              id="emailInput"
              type="text"
              value={email}
              onChange={this.createInputHandler('email')}
            />
          </div>
          <div className="has-large-bottom-margin">
            <label htmlFor="passwordInput">Password</label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={this.createInputHandler('password')}
            />
          </div>
          <input
            type="submit"
            value="ok"
            disabled={!isEmail(email) || password.length < 6}
          />
        </form>

        <Footer />
      </div>
    );
  }
}

LoginScene.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createFragmentContainer(LoginScene, graphql`
  fragment LoginScene_viewer on User {
    id
    pseudo
  }
`);
