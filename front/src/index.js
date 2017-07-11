import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './relayEnvironment';

import User from './User';
import SkillList from './SkillList';

const renderApp = ({ error, props }) => (
  <Router>
    <div>

      <h1>Super Cool App</h1>
      <Link to="/">home</Link>
      &nbsp;~&nbsp;
      <Link to="/skills">skills</Link>

      {!!error && <pre>{JSON.stringify(error, null, 2)}</pre>}

      {props ? (
        <div>
          <Route exact path="/" render={p => <User {...p} user={props.user} />} />
          <Route exact path="/skills" render={p => <SkillList {...p} individuals={props.individuals} />} />
        </div>
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
      ...User_user
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
