import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { startApp, getAppViewData } from 'concepts/app-view';
import ScrollTopRoute from 'components/ScrollTopRoute';
import AppHelp from 'components/AppHelp';
import LoadingView from 'components/LoadingView';

import './AppView.scss';

class AppView extends Component {
  componentDidMount() {
    this.props.startApp();
  }

  render() {
    const { match } = this.props;

    return (
      <div className="App">
        <div className="App-container">
          <div className="App-content">
            <Route exact path={`${match.url}`} component={LoadingView} />
            <ScrollTopRoute exact path={`${match.url}about`} component={AppHelp} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = getAppViewData;
const mapDispatchToProps = { startApp };

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
