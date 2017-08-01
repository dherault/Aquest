import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import createUser from '../../../mutations/CreateUserMutation';

const sSignupForm = {
  minWidth: '40vw',
  padding: '1rem',
  boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.50)',
};

const sDone = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: 'black',
  transition: 'opacity 2s',
};

class SignupForm extends Component {

  state = { email: '', password: '', hasAgreed: false, done: false }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    if (!this.validateInputs()) return;

    const { email, password } = this.state;

    createUser(email, password).then(user => {
      if (user) {
        this.setState({ done: true });

        setTimeout(() => {
          // Prevent white flash on route change
          document.body.style.backgroundColor = 'black';
          // Move to onboarding
          this.context.router.history.push('/new_game');
        }, 2000);
      }
    });
  }

  validateInputs() {
    const { email, password, hasAgreed } = this.state;

    return email.length >= 6 && password.length >= 6 && hasAgreed;
  }

  render() {
    const { email, password, hasAgreed, done } = this.state;

    return (
      <form onSubmit={this.handleSubmit} style={sSignupForm}>
        <div style={{ ...sDone, zIndex: done ? 999 : -1, opacity: done ? 1 : 0 }} />
        <div>
          <label>Email</label>
          <input type="text" value={email} onChange={this.createInputHandler('email')} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={this.createInputHandler('password')} />
        </div>
        <div>
          <input type="checkbox" checked={hasAgreed} onChange={() => this.setState({ hasAgreed: !hasAgreed })} />
          <label className="label-inline">I agree to the Aquest <Link to="/terms_of_services">Terms of services</Link> and <Link to="/privacy_policy">Privacy policy</Link>.</label>
        </div>
        <input
          type="submit"
          value="start adventure!"
          disabled={!this.validateInputs()}
        />
      </form>
    );
  }
}

SignupForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default SignupForm;
