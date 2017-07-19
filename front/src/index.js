import './index.css';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './relayEnvironment';

import AuthBouncer from './AuthBouncer';
import SkillsRegistry from './scenes/SkillsRegistry';
import UserProfile from './scenes/UserProfile';
import Login from './scenes/Login';
import Landing from './scenes/Landing';

const publicPaths = [
  '/',
  '/login',
];

const renderApp = ({ error, props }) => (
  <Router>
    <div>

      <nav className="navbar">
        <div className="navbar-brand">
          :)
        </div>
        <div className="navbar-menu">
          <Link className="navbar-item" to="/">landing</Link>
          <Link className="navbar-item" to="/user">user</Link>
          <Link className="navbar-item" to="/login">login</Link>
          <Link className="navbar-item" to="/skills">skills</Link>
          <a className="navbar-item" onClick={() => localStorage.removeItem('token') || (window.location.href = '/')}>logout</a>
        </div>
      </nav>

      {!!error && <pre>{error.message}<br />{error.stack}</pre>}

      {props ? (
        <AuthBouncer {...props} publicPaths={publicPaths}>
          <Route exact path="/" render={p => <Landing {...p} {...props} />} />
          <Route exact path="/login" render={p => <Login {...p} {...props} />} />
          <Route exact path="/user" render={p => <UserProfile {...p} {...props} />} />
          <Route exact path="/skills" render={p => <SkillsRegistry {...p} {...props} />} />
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
      ...AuthBouncer_user
      ...UserProfile_user
      ...SkillsRegistry_user
      ...Login_user
      ...Landing_user
    }
    individuals {
      ...SkillsRegistry_individuals
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
