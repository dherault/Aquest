import 'flexpad/flexpad.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Landing from './scenes/Landing';
import Login from './scenes/Login';
import VocationsMap from './scenes/VocationsMap';
import UserProfile from './scenes/UserProfile';
import UserSettings from './scenes/UserSettings';
import Onboarding from './scenes/Onboarding';
import NotFound from './scenes/NotFound';

const routes = (
  <Router>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/vocations" component={VocationsMap} />
      <Route exact path="/~:pseudo" component={UserProfile} />
      <Route exact path="/settings" component={UserSettings} />
      <Route exact path="/welcome" component={Onboarding} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

// It's render time!
ReactDOM.render(
  routes,
  document.getElementById('root'),
  () => console.log('App rendered yo!')
);
