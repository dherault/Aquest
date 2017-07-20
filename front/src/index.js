import './index.css';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { QueryRenderer, graphql } from 'react-relay';

// import environment from './relayEnvironment';

import Landing from './scenes/Landing';
import Login from './scenes/Login';
import UserProfile from './scenes/UserProfile';
import SkillsRegistry from './scenes/SkillsRegistry';

const routes = (
  <Router>
    <div>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/user" component={UserProfile} />
      <Route exact path="/skills" component={SkillsRegistry} />
    </div>
  </Router>
);

ReactDOM.render(
  routes,
  document.getElementById('root'),
  () => console.log('App rendered yo !')
);
