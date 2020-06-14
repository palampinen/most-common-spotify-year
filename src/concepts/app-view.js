// # App view concept
//
// This concept does not have reducer and it will work just as a combining
// "view-concept" for "core-concepts"

import { createStructuredSelector } from 'reselect';

import { checkLogin } from './auth';
import { fetchUserProfile, getUser } from './user';
import { fetchMostCommonYear } from './user-library';

// # Selectors
export const getAppViewData = createStructuredSelector({
  user: getUser,
});

// # Action creators
export const startApp = () => dispatch => {
  console.log('Starting app view...');

  dispatch(checkLogin())
    .then(() => {
      dispatch(fetchUserProfile());
      dispatch(fetchMostCommonYear());
    })
    .catch(() => {
      console.log('not logged in');
    });
};
