// # Playlist concept

import get from 'lodash/get';
import times from 'lodash/times';
import split from 'lodash/split';
import first from 'lodash/first';
import isNil from 'lodash/isNil';
import { fromJS, List, Map } from 'immutable';
import { apiCall } from 'services/api';
import { createSelector } from 'reselect';
import history from 'services/history';

// # Action Types
const FETCH_PLAYLISTS = 'userLibrary/FETCH_PLAYLISTS';
const FETCH_PLAYLISTS_SUCCESS = 'userLibrary/FETCH_PLAYLISTS_SUCCESS';
const FETCH_PLAYLISTS_READY = 'userLibrary/FETCH_PLAYLISTS_READY';

const FETCH_PLAYLIST_TRACKS = 'userLibrary/FETCH_PLAYLIST_TRACKS';
const FETCH_PLAYLIST_TRACKS_SUCCESS = 'userLibrary/FETCH_PLAYLIST_TRACKS_SUCCESS';
const FETCH_PLAYLISTS_TRACKS_READY = 'userLibrary/FETCH_PLAYLISTS_TRACKS_READY';

// # Selectors
export const getPlaylists = state => state.userLibrary.get('playlists');
export const getPlaylistsTracks = state => state.userLibrary.get('playlistsTracks');

// 1981, 1981-12 or 1981-12-15
const getYear = date => first(split(date, '-'));

const calculateYearOccurrences = createSelector(getPlaylistsTracks, playlistTracks => {
  // uniq tracks?
  const allTracks = playlistTracks.reduce((sum, album) => {
    return sum.concat(album);
  }, List([]));

  const yearOccurrences = allTracks.reduce((sum, track) => {
    const releaseDate = getYear(track.getIn(['track', 'album', 'release_date']));

    if (isNil(releaseDate)) {
      return;
    }

    return sum.setIn([releaseDate], (sum.get(releaseDate) || 0) + 1);
  }, Map());

  return yearOccurrences;
});

export const getYearlyTracks = createSelector(calculateYearOccurrences, tracksPerYear => {
  if (tracksPerYear.isEmpty()) {
    return fromJS([]);
  }

  const max = tracksPerYear.max();

  const years = tracksPerYear.reduce((sum, count, year) => {
    return sum.push(fromJS({ count, year, percentage: (count / max) * 100 }));
  }, List([]));

  return years.sortBy(year => year.get('year')).reverse();
});

const calculateMostCommonYear = createSelector(calculateYearOccurrences, yearOccurrences => {
  const maxOccurrences = yearOccurrences.max();
  // HOX return first occurrence if multiple exists
  const mostCommonYear = yearOccurrences.findKey(val => val === maxOccurrences);

  return mostCommonYear;
});

// # Action Creators
export const fetchUserPlaylists = params => dispatch => {
  return dispatch(
    apiCall({
      type: FETCH_PLAYLISTS,
      url: `/me/playlists`,
      params,
    })
  );
};

// Since fetcing playlists is limited to 50 per request
// we need to get playlists in batches
const MAX_PLAYLISTS_PER_REQUEST = 5;
const fetchAllPlaylists = () => dispatch =>
  dispatch(fetchUserPlaylists({ limit: MAX_PLAYLISTS_PER_REQUEST }))
    .then(response => {
      const totalPlaylists = get(response, ['payload', 'data', 'total']);

      if (totalPlaylists > MAX_PLAYLISTS_PER_REQUEST) {
        const remainingPlaylists = totalPlaylists - MAX_PLAYLISTS_PER_REQUEST;
        const amountOfRequestsNeeded = Math.ceil(remainingPlaylists / MAX_PLAYLISTS_PER_REQUEST);

        return Promise.all(
          times(amountOfRequestsNeeded, index =>
            dispatch(
              fetchUserPlaylists({
                limit: MAX_PLAYLISTS_PER_REQUEST,
                offset: (index + 1) * MAX_PLAYLISTS_PER_REQUEST,
              })
            )
          )
        );
      }
    })
    .then(() => dispatch({ type: FETCH_PLAYLISTS_READY }));

const fetchPlaylistTracks = playlistId => dispatch =>
  dispatch(
    apiCall({
      type: FETCH_PLAYLIST_TRACKS,
      url: `/playlists/${playlistId}`,
      params: { fields: 'id,tracks.items(track(id,name,album(id,release_date)))' },
    })
  );

const fetchAllPlaylistsTracks = () => (dispatch, getState) => {
  const playlists = getPlaylists(getState());
  const playlistsIds = playlists.map(playlist => playlist.get('id'));

  return Promise.all(playlistsIds.toJS().map(id => dispatch(fetchPlaylistTracks(id)))).then(() =>
    dispatch({ type: FETCH_PLAYLISTS_TRACKS_READY })
  );
};

const redirectToCorrectYearPage = () => (dispatch, getState) => {
  const mostCommonYear = calculateMostCommonYear(getState());

  history.replace(`/year/${mostCommonYear}`);
};

export const fetchMostCommonYear = () => (dispatch, getState) => {
  dispatch(fetchAllPlaylists())
    .then(() => dispatch(fetchAllPlaylistsTracks()))
    .then(() => dispatch(redirectToCorrectYearPage()));
};

// # Reducer
const initialState = fromJS({
  isLoadingPlaylists: false,
  isLoadingPlaylistsTracks: false,
  playlists: [],
  playlistsTracks: {},
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS: {
      return state.set('isLoadingPlaylists', true);
    }

    case FETCH_PLAYLISTS_SUCCESS: {
      return state.set(
        'playlists',
        state.get('playlists').concat(fromJS(action.payload.data.items))
      );
    }

    case FETCH_PLAYLISTS_READY: {
      return state.set('isLoadingPlaylists', false);
    }

    case FETCH_PLAYLIST_TRACKS: {
      return state.set('isLoadingPlaylistsTracks', true);
    }

    case FETCH_PLAYLIST_TRACKS_SUCCESS: {
      return state.setIn(
        ['playlistsTracks', action.payload.data.id],
        fromJS(get(action, ['payload', 'data', 'tracks', 'items']))
      );
    }

    case FETCH_PLAYLISTS_TRACKS_READY: {
      return state.set('isLoadingPlaylistsTracks', false);
    }

    default: {
      return state;
    }
  }
}
