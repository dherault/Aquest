import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import loginUser from '../../mutations/LoginUserMutation';

import DiskImage from '../../components/DiskImage';
import Footer from '../../components/Footer';

class LoginScene extends Component {
  state = { email: 'yolo@gmail.com', password: 'yodoyodo' }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    loginUser(email, password);
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
            <Link to="/user">Go to profile</Link>
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="cct" style={{ flexGrow: 1 }}>
          <div>
            <label>Email</label>
            <input type="text" value={email} onChange={this.createInputHandler('email')} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={this.createInputHandler('password')} />
          </div>
          <input type="submit" value="ok" />
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
