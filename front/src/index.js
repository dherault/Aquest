import './index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

import environment from './relayEnvironment';

import User from './User';
import SkillList from './SkillList';
import Login from './scenes/Login';

class AuthBouncer extends Component {
  componentWillMount() {
    this.bounce(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.bounce(nextProps);
  }

  bounce(props) {
    if (!this.isAuthenticated(props)) {
      console.log('Not auth, redirecting...');
      this.context.router.history.replace('/login');
    }
  }

  isAuthenticated(props) {
    return props.user || this.context.router.route.pathname.endsWith('/login');
  }

  render() {
    if (!this.isAuthenticated(this.props)) return null;

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

const renderApp = ({ error, props }) => (
  <Router>
    <div>

      <h1>Super Cool App</h1>
      <Link to="/">home</Link>
      &nbsp;~&nbsp;
      <Link to="/login">login</Link>
      &nbsp;~&nbsp;
      <Link to="/skills">skills</Link>

      {!!error && <pre>{JSON.stringify(error, null, 2)}</pre>}

      {props ? (
        <AuthBouncer {...props}>
          <Route exact path="/" render={p => <User {...p} {...props} />} />
          <Route exact path="/login" render={p => <Login {...p} {...props} />} />
          <Route exact path="/skills" render={p => <SkillList {...p} {...props} />} />
        </AuthBouncer>
      ) : (
        <div>
          Loading...
        </div>
      )}
    </div>
  </Router>
);

const query = graphql`
  query srcQuery {
    user {
      id
      ...User_user
      ...SkillList_user
      ...Login_user
    }
    individuals {
      ...SkillList_individuals
    }
  }
`;

ReactDOM.render(
  <QueryRenderer
    query={query}
    render={renderApp}
    environment={environment}
  />,
  document.getElementById('root'),
  () => console.log('App rendered yo !')
);
