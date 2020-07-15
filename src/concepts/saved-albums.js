// # Saved Albums concept
import get from 'lodash/get';
import times from 'lodash/times';
import { fromJS, List } from 'immutable';
import { createSelector } from 'reselect';
import { apiCall } from 'services/api';

// # Action Types
const FETCH_SAVED_ALBUMS = 'savedAlbums/FETCH_SAVED_ALBUMS';
const FETCH_SAVED_ALBUMS_SUCCESS = 'savedAlbums/FETCH_SAVED_ALBUMS_SUCCESS';
const FETCH_SAVED_ALBUMS_READY = 'savedAlbums/FETCH_SAVED_ALBUMS_READY';

// # Selectors
export const getSavedAlbums = state => state.savedAlbums.get('albums');

export const getSavedAlbumsTracks = createSelector(getSavedAlbums, savedAlbums =>
  savedAlbums.reduce((sumOfTracks, savedAlbum) => {
    const album = savedAlbum.get('album');

    // reject compliation albums
    if (album.get('album_type') === 'compilation') {
      return sumOfTracks;
    }

    const tracks = album.getIn(['tracks', 'items']);
    const albumInfo = fromJS({
      release_date_precision: album.get('release_date_precision'),
      release_date: album.get('release_date'),
      album_type: album.get('album_type'),
      name: album.get('name'),
      label: album.get('label'),
      images: album.get('images'),
      id: album.get('id'),
      uri: album.get('uri'),
    });

    const tracksWithAlbumInfo = tracks.map(track => track.set('album', albumInfo));

    return sumOfTracks.concat(tracksWithAlbumInfo);
  }, List([]))
);

// # Action Creators
const fetchSavedAlbums = params => dispatch =>
  dispatch(
    apiCall({
      type: FETCH_SAVED_ALBUMS,
      url: `/me/albums`,
      params,
    })
  );

// Since fetching saved albums is limited to 50 per request
// we need to get albums in batches
const MAX_SAVED_ALBUMS_PER_REQUEST = 50;
export const fetchAllSavedAlbums = () => dispatch =>
  dispatch(fetchSavedAlbums({ limit: MAX_SAVED_ALBUMS_PER_REQUEST }))
    .then(response => {
      const totalSavedAlbums = get(response, ['payload', 'data', 'total']);

      if (totalSavedAlbums > MAX_SAVED_ALBUMS_PER_REQUEST) {
        const remainingAlbums = totalSavedAlbums - MAX_SAVED_ALBUMS_PER_REQUEST;
        const amountOfRequestsNeeded = Math.ceil(remainingAlbums / MAX_SAVED_ALBUMS_PER_REQUEST);

        return Promise.all(
          times(amountOfRequestsNeeded, index =>
            dispatch(
              fetchSavedAlbums({
                limit: MAX_SAVED_ALBUMS_PER_REQUEST,
                offset: (index + 1) * MAX_SAVED_ALBUMS_PER_REQUEST,
              })
            )
          )
        );
      }
    })
    .then(() => dispatch({ type: FETCH_SAVED_ALBUMS_READY }));

// # Reducer
const initialState = fromJS({
  isLoadingSavedAlbums: false,
  albums: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SAVED_ALBUMS: {
      return state.set('isLoadingSavedAlbums', true);
    }

    case FETCH_SAVED_ALBUMS_SUCCESS: {
      return state.set('albums', state.get('albums').concat(fromJS(action.payload.data.items)));
    }

    case FETCH_SAVED_ALBUMS_READY: {
      return state.set('isLoadingSavedAlbums', false);
    }

    default: {
      return state;
    }
  }
}
