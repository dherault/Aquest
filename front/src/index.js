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

      {!!error && (
        <article className="message is-danger">
          <div className="message-body">
            <pre>
              {error.stack}
              {!!error.source && (
                <span>
                  <br />Source:<br />
                  {JSON.stringify(error.source, null, 2)}
                </span>
              )}
            </pre>
          </div>
        </article>
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
    user {
      ...AuthBouncer_user
      ...UserProfile_user
      ...SkillsRegistry_user
      ...Login_user
      ...Landing_user
      ...Footer_user
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
