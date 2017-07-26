import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import isEmail from 'validator/lib/isEmail';

import updateViewer from '../../mutations/UpdateViewerMutation';
import deleteViewerAccount from '../../mutations/DeleteViewerAccountMutation';

import Layout from '../../components/Layout';
import PasswordInput from '../../components/PasswordInput';

const _inner = {
  width: '40vw',
};

class UserSettingsScene extends Component {

  state = {
    email: '',
    password: '',
  }

  handleEmailInputChange = e => this.setState({ email: e.target.value })
  handlePasswordInputChange = e => this.setState({ password: e.target.value })

  handleEmailFormSubmit = e => {
    e.preventDefault();

    const { email } = this.state;

    if (email && isEmail(email)) updateViewer({ email });
  }

  handlePasswordFormSubmit = e => {
    e.preventDefault();

    const { password } = this.state;

    if (password.length >= 6) updateViewer({ password });
  }

  handleProfilePrivacyChange = () => {
    updateViewer({ hasPrivateProfile: !this.props.viewer.hasPrivateProfile });
  }

  handleDeleteAccountClick = () => {
    const isOkWithConsequences = window.confirm('Are you sure you want to delete your user account, including all its data ? This operation cannot be undone!');

    if (isOkWithConsequences) {

      const hasMadeUpHisMind = window.confirm('We are sorry to see you go, hope you enjoyed the game ! Do not hesitate to contact us. Goodbye friend! (PS: you can still change your mind, after that game is over)');

      if (hasMadeUpHisMind) deleteViewerAccount();
    }
  }

  render() {
    const { viewer } = this.props;
    const { email, password } = this.state;

    return (
      <Layout viewer={viewer} backgroundImageUrl={viewer.backgroundImageUrl}>
        <div className="cct has-flex-grow has-large-margin has-large-padding has-white-background">
          <div style={_inner}>

            <section className="has-large-bottom-margin">
              <h3>Account settings</h3>

              <form onSubmit={this.handleEmailFormSubmit} className="has-large-bottom-margin">
                <label htmlFor="emailField">Change email</label>
                <div className="rlc">
                  <input
                    type="text"
                    id="emailField"
                    className="has-flex-grow"
                    value={email}
                    placeholder={viewer.email}
                    onChange={this.handleEmailInputChange}
                  />
                  {!!email && (
                    <input
                      type="submit"
                      value="save"
                      onClick={this.handleEmailFormSubmit}
                      disabled={!isEmail(email)}
                      style={{ marginLeft: '1rem' }}
                    />
                  )}
                </div>
              </form>

              <form onSubmit={this.handlePasswordFormSubmit}>
                <label htmlFor="passwordField">Change password</label>
                <div className="rlc">
                  <PasswordInput
                    id="passwordField"
                    value={password}
                    placeholder="******"
                    onChange={this.handlePasswordInputChange}
                  />
                  {!!password && (
                    <input
                      type="submit"
                      value="save"
                      onClick={this.handlePasswordFormSubmit}
                      disabled={password.length < 6}
                      style={{ marginLeft: '1rem' }}
                    />
                  )}
                </div>
              </form>
            </section>

            <section className="has-large-bottom-margin">
              <h3>Privacy settings</h3>

              <div
                className="has-cursor-pointer has-small-bottom-margin"
                onClick={this.handleProfilePrivacyChange}
              >
                <input
                  readOnly
                  type="checkbox"
                  id="privacyCheckbox"
                  checked={viewer.hasPrivateProfile}
                />
                <label
                  htmlFor="privacyCheckbox"
                  className="label-inline"
                >
                  Make my profile private
                </label>
              </div>

            </section>

            <section>
              <h3>End game settings</h3>
              <a onClick={this.handleDeleteAccountClick}>Delete my account</a>
            </section>

          </div>
        </div>
      </Layout>
    );
  }
}

export default createFragmentContainer(UserSettingsScene, graphql`
  fragment UserSettingsScene_viewer on User {
    id
    email
    hasPrivateProfile
    backgroundImageUrl

    ...Layout_viewer
  }
`);
