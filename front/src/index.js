import './index.css';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './relayEnvironment';

import Footer from './components/Footer';
import AuthBouncer from './AuthBouncer';
import SkillsRegistry from './scenes/SkillsRegistry';
import UserProfile from './scenes/UserProfile';
import Login from './scenes/Login';
import Landing from './scenes/Landing';

const publicPaths = [
  '/',
  '/login',
];

const noFooterPaths = [
];

const renderApp = ({ error, props }) => (
  <Router>
    <div>

      {!!error && process.env.NODE_ENV !== 'production' && (
        <pre>
          {error.stack}
          {!!error.source && (
            <span>
              <br />Source:<br />
              {JSON.stringify(error.source, null, 2)}
            </span>
          )}
        </pre>
      )}

      {props ? (
        <AuthBouncer {...props} publicPaths={publicPaths}>
          <Route exact path="/" render={p => <Landing {...p} {...props} />} />
          <Route exact path="/login" render={p => <Login {...p} {...props} />} />
          <Route exact path="/user" render={p => <UserProfile {...p} {...props} />} />
          <Route exact path="/skills" render={p => <SkillsRegistry {...p} {...props} />} />
          <Footer {...props} noFooterPaths={noFooterPaths} />
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
  query srcQuery($count: Int!, $cursor: String) {
    viewer {
      ...AuthBouncer_viewer
      ...UserProfile_viewer
      ...SkillsRegistry_viewer
      ...Login_viewer
      ...Landing_viewer
      ...Footer_viewer
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
    variables={{
      count: 10,
      cursor: null,
    }}
    environment={environment}
  />,
  document.getElementById('root'),
  () => console.log('App rendered yo !')
);
