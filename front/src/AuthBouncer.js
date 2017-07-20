import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

class AuthBouncer extends Component {
  componentWillMount() {
    this.bounce();
  }

  componentDidUpdate() {
    this.bounce();
  }

  bounce() {
    if (!this.isAuthenticated()) {
      console.log('Not auth, redirecting...');

      const redirection = encodeURIComponent(this.context.router.route.location.pathname);

      this.context.router.history.replace(`/login?r=${redirection}`);
    }
  }

  isAuthenticated() {
    const { viewer, publicPaths } = this.props;

    return viewer || publicPaths.includes(this.context.router.route.location.pathname);
  }

  render() {
    if (!this.isAuthenticated()) return null;

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

AuthBouncer.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createFragmentContainer(AuthBouncer, graphql`
  fragment AuthBouncer_viewer on User {
    id
  }
`);
