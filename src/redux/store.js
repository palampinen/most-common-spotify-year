import { createStore, applyMiddleware, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import * as reducers from 'redux/reducers';
import { axiosApiMiddleware } from 'services/axios';
import history from 'services/history';

const historyMiddleware = routerMiddleware(history);
const middlewares = [thunk, historyMiddleware, axiosApiMiddleware];

const createStoreWithMiddleware = applyMiddleware.apply(this, middlewares)(createStore);
const reducer = combineReducers({ router: connectRouter(history), ...reducers });
const store = createStoreWithMiddleware(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-ignore-line
);

export default store;
