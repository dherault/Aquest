import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

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
  }

  handlePasswordFormSubmit = e => {
    e.preventDefault();
  }

  handleProfilePrivacyChange = e => {
    console.log(e.target.checked);
  }

  handleDeleteAccountClick = () => {

  }

  render() {
    const { viewer } = this.props;
    const { email, password } = this.state;

    return (
      <Layout viewer={viewer} backgroundImageUrl={viewer.backgroundImageUrl}>
        <div className="cct has-flex-grow has-large-margin has-large-padding has-white-background">
          <div style={_inner}>

            <section>
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
                      style={{ marginLeft: '1rem' }}
                      onClick={this.handleEmailFormSubmit}
                    />
                  )}
                </div>
              </form>

              <form onSubmit={this.handlePasswordFormSubmit} className="has-large-bottom-margin">
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
                      style={{ marginLeft: '1rem' }}
                      onClick={this.handlePasswordFormSubmit}
                    />
                  )}
                </div>
              </form>
            </section>

            <section>
              <h3>Privacy settings</h3>

              <div
                className="has-cursor-pointer has-small-bottom-margin"
                onChange={this.handleProfilePrivacyChange}
              >
                <input
                  type="checkbox"
                  id="privacyCheckbox"
                  checked={false}
                  onChange={this.handleProfilePrivacyChange}
                />
                <label
                  htmlFor="privacyCheckbox"
                  className="label-inline"
                >
                  Make my profile private
                </label>
              </div>

              <div
                className="has-large-bottom-margin has-cursor-pointer"
                onChange={this.handleProfileShowcaseChange}
              >
                <input
                  type="checkbox"
                  id="showcaseCheckbox"
                  checked={false}
                />
                <label
                  htmlFor="showcaseCheckbox"
                  className="label-inline"
                >
                  Showcase my profile on the front page
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
    backgroundImageUrl

    ...Layout_viewer
  }
`);
