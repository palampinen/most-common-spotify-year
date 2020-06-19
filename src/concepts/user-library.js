// # Playlist concept

import get from 'lodash/get';
import times from 'lodash/times';
import head from 'lodash/head';
import split from 'lodash/split';
import first from 'lodash/first';
import isNil from 'lodash/isNil';
import random from 'lodash/random';
import { fromJS, List, Map } from 'immutable';
import { apiCall } from 'services/api';
import { createSelector } from 'reselect';
import history from 'services/history';
import { uniqBy } from 'services/immutable';
import { getUserId } from 'concepts/user';

import FamousComposers from 'constants/FamousComposers';

// # Action Types
const FETCH_PLAYLISTS = 'userLibrary/FETCH_PLAYLISTS';
const FETCH_PLAYLISTS_SUCCESS = 'userLibrary/FETCH_PLAYLISTS_SUCCESS';
const FETCH_PLAYLISTS_READY = 'userLibrary/FETCH_PLAYLISTS_READY';

const FETCH_PLAYLIST_TRACKS = 'userLibrary/FETCH_PLAYLIST_TRACKS';
const FETCH_PLAYLIST_TRACKS_SUCCESS = 'userLibrary/FETCH_PLAYLIST_TRACKS_SUCCESS';
const FETCH_PLAYLISTS_TRACKS_READY = 'userLibrary/FETCH_PLAYLISTS_TRACKS_READY';

const FETCH_SAVED_TRACKS = 'userLibrary/FETCH_SAVED_TRACKS';
const FETCH_SAVED_TRACKS_SUCCESS = 'userLibrary/FETCH_SAVED_TRACKS_SUCCESS';
const FETCH_SAVED_TRACKS_READY = 'userLibrary/FETCH_SAVED_TRACKS_READY';

const SEARCH_TRACK = 'userLibrary/SEARCH_TRACK';
// const SEARCH_TRACK_SUCCESS = 'userLibrary/SEARCH_TRACK_SUCCESS';
const SEARCH_TRACK_READY = 'userLibrary/SEARCH_TRACK_READY';

// const SEARCH_COMPILATION_TRACKS = 'userLibrary/SEARCH_COMPILATION_TRACKS';
// const SEARCH_COMPILATION_TRACKS_SUCCESS = 'userLibrary/SEARCH_COMPILATION_TRACKS_SUCCESS';
// const SEARCH_COMPILATION_TRACKS_READY = 'userLibrary/SEARCH_COMPILATION_TRACKS_READY';

// # Selectors
export const getPlaylists = state => state.userLibrary.get('playlists');
export const getPlaylistsTracks = state => state.userLibrary.get('playlistsTracks');
export const getSavedTracks = state => state.userLibrary.get('savedTracks');
export const getCompilationReplacementTracks = state =>
  state.userLibrary.get('compilationReplacementTracks');

// 1981, 1981-12 or 1981-12-15
const getYear = date => first(split(date, '-'));

const getAllUsersTracks = createSelector(
  getPlaylistsTracks,
  getSavedTracks,
  getUserId,
  (playlistTracks, savedTracks, userId) => {
    const allPlaylistTracks = playlistTracks.reduce((sum, playlist) => {
      return sum.concat(playlist);
    }, List([]));

    const ownPlaylistTracks = allPlaylistTracks.filter(track => {
      const addedByUserId = track.getIn(['added_by', 'id']);
      return addedByUserId === '' || addedByUserId === userId;
    });

    return (
      uniqBy(ownPlaylistTracks.concat(savedTracks), 'track.id')
        // remove old famous composers because these albums do "correct date"
        .filter(
          track => FamousComposers.indexOf(track.getIn(['track', 'artists', 0, 'name'])) === -1
        )
        // remove keyed by track
        .reduce((sum, track) => sum.push(track.get('track')), List())
    );
  }
);

const getAllTracks = createSelector(
  getAllUsersTracks,
  getCompilationReplacementTracks,
  (tracks, replacementTracks) => tracks.concat(replacementTracks)
);

const calculateYearOccurrences = createSelector(getAllTracks, allTracks => {
  const validTracks = allTracks.filter(
    track => track.getIn(['album', 'album_type']) !== 'compilation'
  );

  const yearOccurrences = validTracks.reduce((sum, track) => {
    const releaseYear = getYear(track.getIn(['album', 'release_date']));

    if (isNil(releaseYear)) {
      return sum;
    }

    return sum.setIn([releaseYear], (sum.get(releaseYear) || 0) + 1);
  }, Map());

  return yearOccurrences;
});

export const getYearlyTracks = createSelector(getAllTracks, allTracks => {
  const validTracks = allTracks.filter(
    track => track.getIn(['album', 'album_type']) !== 'compilation'
  );

  const tracksByYear = validTracks.reduce((sum, track) => {
    const releaseYear = getYear(track.getIn(['album', 'release_date']));

    return sum.set(releaseYear, (sum.get(releaseYear) || List()).push(track));
  }, Map());

  return tracksByYear;
});

export const getYearsWithTracks = createSelector(getYearlyTracks, tracksByYear =>
  (tracksByYear.keySeq().toList() || List()).sort()
);

export const getYearlyTrackCounts = createSelector(calculateYearOccurrences, tracksPerYear => {
  if (tracksPerYear.isEmpty()) {
    return List();
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

export const getRandomCoverFromMainYear = createSelector(
  calculateMostCommonYear,
  getYearlyTracks,
  (year, tracksByYear) => {
    const tracksFromYear = tracksByYear.get(year);

    if (!tracksFromYear || !tracksFromYear.size) {
      return null;
    }

    const randomIndex = random(tracksFromYear.size - 1);
    return tracksFromYear.getIn([randomIndex, 'album', 'images', 1, 'url']);
  }
);

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

// Since fetching playlists is limited to 50 per request
// we need to get playlists in batches
const MAX_PLAYLISTS_PER_REQUEST = 50;
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
      params: {
        fields:
          'id,tracks.items(added_by(id),track(id,uri,name,artists(name),album(id,album_type,release_date,images)))',
      },
    })
  );

const fetchAllPlaylistsTracks = () => (dispatch, getState) => {
  const playlists = getPlaylists(getState());
  const playlistsIds = playlists.map(playlist => playlist.get('id'));

  return Promise.all(playlistsIds.toJS().map(id => dispatch(fetchPlaylistTracks(id)))).then(() =>
    dispatch({ type: FETCH_PLAYLISTS_TRACKS_READY })
  );
};

const fetchSavedTracks = params => dispatch =>
  dispatch(
    apiCall({
      type: FETCH_SAVED_TRACKS,
      url: `/me/tracks`,
      params,
    })
  );

// Since fetching playlists is limited to 50 per request
// we need to get playlists in batches
const MAX_SAVED_TRACKS_PER_REQUEST = 50;
const fetchAllSavedTracks = () => dispatch =>
  dispatch(fetchSavedTracks({ limit: MAX_SAVED_TRACKS_PER_REQUEST }))
    .then(response => {
      const totalPlaylists = get(response, ['payload', 'data', 'total']);

      if (totalPlaylists > MAX_SAVED_TRACKS_PER_REQUEST) {
        const remainingPlaylists = totalPlaylists - MAX_SAVED_TRACKS_PER_REQUEST;
        const amountOfRequestsNeeded = Math.ceil(remainingPlaylists / MAX_SAVED_TRACKS_PER_REQUEST);

        return Promise.all(
          times(amountOfRequestsNeeded, index =>
            dispatch(
              fetchSavedTracks({
                limit: MAX_SAVED_TRACKS_PER_REQUEST,
                offset: (index + 1) * MAX_SAVED_TRACKS_PER_REQUEST,
              })
            )
          )
        );
      }
    })
    .then(() => dispatch({ type: FETCH_SAVED_TRACKS_READY }));

const searchTrack = track => dispatch => {
  const artistName = (track.getIn(['artists']) || List())
    .map(artist => artist.get('name'))
    .join(' ');

  const trackName = track.getIn(['name']);

  if (!trackName || !artistName) {
    return Promise.resolve();
  }

  return dispatch(
    apiCall({
      type: SEARCH_TRACK,
      url: `/search`,
      params: { q: `${artistName} ${trackName}`, type: 'track', limit: 3 },
    })
  )
    .then(result => {
      const tracks = get(result, ['payload', 'data', 'tracks', 'items']);

      if (!tracks) {
        return Promise.reject();
      }

      const validTracks = tracks.filter(
        track => get(track, ['album', 'album_type']) !== 'compilation'
      );

      return head(validTracks);
    })
    .then(track => {
      if (track) {
        return dispatch({ type: SEARCH_TRACK_READY, payload: track });
      }

      return Promise.resolve();
    })
    .catch(() => console.log('Could not get track'));
};

const fetchCompilationAlbumTracks = () => (dispatch, getState) => {
  const tracks = getAllUsersTracks(getState());

  const compilationTracks = tracks.filter(
    track => track.getIn(['album', 'album_type']) === 'compilation'
  );

  const DELAY_BETWEEN_BATCHES_MS = 500;
  const BATCH_SIZE = 20;
  const trackCount = compilationTracks.size;
  const amountOfBatchesNeeded = Math.ceil(trackCount / BATCH_SIZE);

  if (!trackCount) {
    return Promise.resolve();
  }

  function delay(t, v) {
    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
  }

  const fetchBatch = page =>
    Promise.all(
      times(BATCH_SIZE, index => {
        const track = compilationTracks.get(page * BATCH_SIZE + index);
        if (!track) {
          return Promise.resolve();
        }

        return dispatch(searchTrack(compilationTracks.get(page * BATCH_SIZE + index)));
      })
    );

  const pageArray = times(amountOfBatchesNeeded, i => i);

  return pageArray.reduce(
    (prev, page) => prev.then(() => delay(DELAY_BETWEEN_BATCHES_MS)).then(() => fetchBatch(page)),
    Promise.resolve()
  );
};

const redirectToCorrectYearPage = () => (dispatch, getState) => {
  const mostCommonYear = calculateMostCommonYear(getState());

  if (mostCommonYear) {
    history.replace(`/year/${mostCommonYear}`);
  }
};

export const fetchMostCommonYear = () => dispatch => {
  return dispatch(fetchAllPlaylists())
    .then(() => dispatch(fetchAllPlaylistsTracks()))
    .then(() => dispatch(fetchAllSavedTracks()))
    .then(() => dispatch(fetchCompilationAlbumTracks()))
    .then(() => dispatch(redirectToCorrectYearPage()));
};

// # Reducer
const initialState = fromJS({
  isLoadingPlaylists: false,
  isLoadingPlaylistsTracks: false,
  isLoadingSavedTracks: false,

  playlists: [],
  playlistsTracks: {},
  savedTracks: [],
  compilationReplacementTracks: [],
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

    case FETCH_SAVED_TRACKS: {
      return state.set('isLoadingSavedTracks', true);
    }

    case FETCH_SAVED_TRACKS_SUCCESS: {
      return state.set(
        'savedTracks',
        state.get('savedTracks').concat(fromJS(action.payload.data.items))
      );
    }

    case FETCH_SAVED_TRACKS_READY: {
      return state.set('isLoadingSavedTracks', false);
    }

    case SEARCH_TRACK_READY: {
      return state.set(
        'compilationReplacementTracks',
        state.get('compilationReplacementTracks').push(fromJS(action.payload))
      );
    }

    default: {
      return state;
    }
  }
}
