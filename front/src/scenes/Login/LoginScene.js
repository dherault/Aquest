import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import isEmail from 'validator/lib/isEmail';

import loginUser from '../../mutations/LoginUserMutation';

import DiskImage from '../../components/DiskImage';
import Footer from '../../components/Footer';

class LoginScene extends Component {
  state = { email: 'yolo@gmail.com', password: 'yodoyodo' }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    if (isEmail(email) && password.length >= 6) loginUser(email, password);
  }

  render() {
    const { viewer } = this.props;
    const { email, password } = this.state;

    return (
      <div className="cct has-screen-height">

        <DiskImage style={{ margin: '2rem 0' }} />

        <h1>Log in</h1>

        {!!viewer && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            You are already logged in as {viewer.pseudo}.
            <br />
            <Link to={`~${window.encodeURIComponent(viewer.pseudo)}`}>Go to profile</Link>
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="cct" style={{ flexGrow: 1 }}>
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

export default createFragmentContainer(LoginScene, graphql`
  fragment LoginScene_viewer on User {
    id
    pseudo
  }
`);
