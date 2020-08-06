// # Playlist concept

import get from 'lodash/get';
// import times from 'lodash/times';
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
import { getSavedAlbumsTracks, fetchAllSavedAlbums } from 'concepts/saved-albums';
import {
  getPlaylists,
  getPlaylistsTracks,
  fetchAllPlaylists,
  fetchAllPlaylistsTracks,
} from 'concepts/saved-playlists';
import { getSavedTracks, fetchAllSavedTracks } from 'concepts/saved-tracks';

import FamousComposers from 'constants/FamousComposers';
import { FROM_SAVED_TRACKS, FROM_SAVED_ALBUM, FROM_PLAYLIST } from 'constants/TrackSources';

// # Action Types
const SEARCH_TRACK = 'userLibrary/SEARCH_TRACK';
// const SEARCH_TRACK_SUCCESS = 'userLibrary/SEARCH_TRACK_SUCCESS';
const SEARCH_TRACK_READY = 'userLibrary/SEARCH_TRACK_READY';

// # Selectors

export const getCompilationReplacementTracks = state =>
  state.userLibrary.get('compilationReplacementTracks');

// Date can be in following formats: 1981, 1981-12 or 1981-12-15
const getYear = date => first(split(date, '-'));

// Key by albums tracks with "track" for consistent behavior
const getSavedAlbumsTracksKeyedByTrack = createSelector(getSavedAlbumsTracks, tracks =>
  tracks.reduce((sum, track) => sum.push(fromJS({ track })), List([]))
);

const getAllUsersTracks = createSelector(
  getPlaylists,
  getPlaylistsTracks,
  getSavedTracks,
  getSavedAlbumsTracksKeyedByTrack,
  getUserId,
  (playlists, playlistTracks, savedTracks, savedAlbumsTracks, userId) => {
    // Playlist tracks
    const playlistTracksWithSource = playlistTracks.reduce((sum, tracks, playlistId) => {
      const playlist = playlists.find(playlist => playlist.get('id') === playlistId) || Map();

      const ownPlaylistTracks = tracks
        .filter(track => {
          const addedByUserId = track.getIn(['added_by', 'id']);
          return addedByUserId === '' || addedByUserId === userId;
        })
        .map(track =>
          track.setIn(
            ['track', 'source'],
            Map({
              type: FROM_PLAYLIST,
              name: playlist.get('name'),
              id: playlistId,
              uri: playlist.get('uri'),
            })
          )
        );

      return sum.concat(ownPlaylistTracks);
    }, List([]));

    // Saved tracks
    const savedTracksWithSource = savedTracks.map(track =>
      track.setIn(
        ['track', 'source'],
        Map({
          type: FROM_SAVED_TRACKS,
          uri: 'https://open.spotify.com/collection/tracks',
        })
      )
    );

    // Saved albums
    const savedAlbumsTracksWithSource = savedAlbumsTracks.map(track =>
      track.setIn(
        ['track', 'source'],
        Map({
          type: FROM_SAVED_ALBUM,
          name: track.getIn(['track', 'album', 'name']),
          uri: track.getIn(['track', 'album', 'uri']),
        })
      )
    );

    // Combine unique tracks
    return (
      uniqBy(
        savedTracksWithSource.concat(playlistTracksWithSource, savedAlbumsTracksWithSource),
        'track.id'
      )
        // remove old famous composers because these albums do not have "correct date" for this analysis
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
  (usersTracks, replacementTracks) => {
    const replacementTracksWithSource = replacementTracks.map(track =>
      track.set(
        'source',
        (
          usersTracks.find(usersTrack => usersTrack.get('id') === track.get('originalTrackId')) ||
          Map()
        ).get('source')
      )
    );

    return usersTracks.concat(replacementTracksWithSource);

    // const originalTrackIds = replacementTracksWithSource.map(t => t.get('originalTrackId'));
    // const usersTracksWithoutReplaced = usersTracks.filter(
    //   t => originalTrackIds.indexOf(t.get('id')) < 0
    // );

    // return usersTracksWithoutReplaced.concat(replacementTracksWithSource);
  }
);

const getValidTracks = createSelector(getAllTracks, allTracks => {
  const validTracks = allTracks.filter(
    track => track.getIn(['album', 'album_type']) !== 'compilation'
  );

  return uniqBy(validTracks, 'id');
});

const calculateYearOccurrences = createSelector(getValidTracks, validTracks => {
  return validTracks.reduce((sum, track) => {
    const releaseYear = getYear(track.getIn(['album', 'release_date']));

    if (isNil(releaseYear)) {
      return sum;
    }

    return sum.setIn([releaseYear], (sum.get(releaseYear) || 0) + 1);
  }, Map());
});

export const getYearlyTracks = createSelector(getValidTracks, validTracks => {
  return validTracks.reduce((sum, track) => {
    const releaseYear = getYear(track.getIn(['album', 'release_date']));

    return sum.set(releaseYear, (sum.get(releaseYear) || List()).push(track));
  }, Map());
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
const searchTrack = originalTrack => dispatch => {
  const artistName = (originalTrack.getIn(['artists']) || List())
    .map(artist => artist.get('name'))
    .join(' ');

  const trackName = originalTrack.getIn(['name']);
  const originalTrackId = originalTrack.get('id');

  if (!trackName || !artistName) {
    return Promise.resolve();
  }

  return dispatch(
    apiCall({
      type: SEARCH_TRACK,
      url: `/search`,
      params: { q: `${artistName} ${trackName}`, type: 'track', limit: 5 },
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
        return dispatch({ type: SEARCH_TRACK_READY, payload: { ...track, originalTrackId } });
      }

      return Promise.resolve();
    })
    .catch(() => console.log('Could not get track'));
};
/*
const fetchCompilationAlbumTracks = () => (dispatch, getState) => {
  const tracks = getAllUsersTracks(getState());

  const compilationTracks = tracks.filter(
    track => track.getIn(['album', 'album_type']) === 'compilation'
  );

  const DELAY_BETWEEN_BATCHES_MS = 750;
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
*/

const redirectToCorrectYearPage = () => (dispatch, getState) => {
  const mostCommonYear = calculateMostCommonYear(getState());

  if (mostCommonYear) {
    history.replace(`/year/${mostCommonYear}`);
  }
};

export const fetchMostCommonYear = () => dispatch => {
  return (
    dispatch(fetchAllPlaylists())
      .then(() => dispatch(fetchAllPlaylistsTracks()))
      .then(() => dispatch(fetchAllSavedTracks()))
      .then(() => dispatch(fetchAllSavedAlbums()))
      // .then(() => dispatch(fetchCompilationAlbumTracks()))
      .then(() => dispatch(redirectToCorrectYearPage()))
  );
};

// # Reducer
const initialState = fromJS({
  compilationReplacementTracks: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
