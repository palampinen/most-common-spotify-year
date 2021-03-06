import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import history from 'services/history';
import store from 'redux/store';

import AppInfo from 'components/AppInfo';
import AppView from 'containers/AppView';
import LoginView from 'containers/LoginView';
import Callback from 'containers/Callback';
import YearView from 'components/YearView';
import ScrollTopRoute from 'components/ScrollTopRoute';
import { initializeAnalytics } from 'services/analytics';

initializeAnalytics();

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/login" component={LoginView} />
        <Route exact path="/app-info" component={AppInfo} />
        <Route exact path="/callback" component={Callback} />
        <ScrollTopRoute exact path="/year/:year" component={YearView} />
        <Route path="/" component={AppView} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default App;
