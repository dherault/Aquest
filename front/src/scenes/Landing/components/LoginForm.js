// import './Vocations.css';
import React, { Component } from 'react';
// import { createFragmentContainer, graphql } from 'react-relay';
import loginUser from '../../../mutations/LoginUserMutation';

// import { Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';

class LoginForm extends Component {

  state = { email: '', password: '' }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    loginUser(email, password);
  }

  render() {
    const { email, password } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        login
        <div>
          <input type="text" value={email} onChange={this.createInputHandler('email')} />
        </div>
        <div>
          <input type="password" value={password} onChange={this.createInputHandler('password')} />
        </div>
        <input type="submit" value="ok" />
      </form>
    );
  }
}

export default LoginForm;
