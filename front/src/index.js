import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './relayEnvironment';

import AuthBouncer from './AuthBouncer';
import User from './User';
import SkillList from './SkillList';
import Login from './scenes/Login';

const renderApp = ({ error, props }) => (
  <Router>
    <div>

      <h1>Super Cool App</h1>
      <Link to="/">home</Link>
      &nbsp;~&nbsp;
      <Link to="/login">login</Link>
      &nbsp;~&nbsp;
      <Link to="/skills">skills</Link>

      {!!error && <pre>{error.message}<br />{error.stack}</pre>}

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
      ...AuthBouncer_user
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
