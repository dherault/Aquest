// import './Vocations.css';
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import loginUser from '../../mutations/LoginUserMutation';

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
      <div style={{ textAlign: 'center' }}>

        <h1>Log in</h1>

        {!!viewer && <div>You are logged in as {viewer.pseudo}</div>}

        <form onSubmit={this.handleSubmit}>
          <div>
            <input type="text" value={email} onChange={this.createInputHandler('email')} />
          </div>
          <div>
            <input type="password" value={password} onChange={this.createInputHandler('password')} />
          </div>
          <input type="submit" value="ok" />
        </form>

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
