import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import createUser from '../../../mutations/CreateUserMutation';

const sSignupForm = {
  minWidth: '40vw',
  padding: '1rem',
  boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.50)',
};

class SignupForm extends Component {

  state = { email: '', password: '', hasAgreed: false }

  createInputHandler = key => e => this.setState({ [key]: e.target.value })

  handleSubmit = e => {
    e.preventDefault();

    if (!this.validateInputs()) return;

    const { email, password } = this.state;

    createUser(email, password).then(() => window.location.href = '/new_game');
  }

  validateInputs() {
    const { email, password, hasAgreed } = this.state;

    return email.length >= 6 && password.length >= 6 && hasAgreed;
  }

  render() {
    const { email, password, hasAgreed } = this.state;

    return (
      <form onSubmit={this.handleSubmit} style={sSignupForm}>
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

export default SignupForm;
