// # Saved Playlists concept

import get from 'lodash/get';
import times from 'lodash/times';
import { fromJS } from 'immutable';
import { apiCall } from 'services/api';

// # Action Types
const FETCH_PLAYLISTS = 'savedPlaylists/FETCH_PLAYLISTS';
const FETCH_PLAYLISTS_SUCCESS = 'savedPlaylists/FETCH_PLAYLISTS_SUCCESS';
const FETCH_PLAYLISTS_READY = 'savedPlaylists/FETCH_PLAYLISTS_READY';

const FETCH_PLAYLIST_TRACKS = 'savedPlaylists/FETCH_PLAYLIST_TRACKS';
const FETCH_PLAYLISTS_TRACKS_READY = 'savedPlaylists/FETCH_PLAYLISTS_TRACKS_READY';

// # Selectors
export const getPlaylists = state => state.savedPlaylists.get('playlists');
export const getPlaylistsTracks = state => state.savedPlaylists.get('playlistsTracks');

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
export const fetchAllPlaylists = () => dispatch =>
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

export const fetchAllPlaylistsTracks = () => (dispatch, getState) => {
  const playlists = getPlaylists(getState());
  const playlistsIds = playlists.map(playlist => playlist.get('id'));

  return Promise.all(playlistsIds.toJS().map(id => dispatch(fetchPlaylistTracks(id)))).then(
    responses => {
      const playlistTracks = responses
        .filter(response => get(response, 'payload.status') === 200)
        .map(response => get(response, 'payload.data'));

      // key tracks by playlist id
      const payload = playlistTracks.reduce((sum, playlist) => {
        const update = { [playlist.id]: get(playlist, 'tracks.items') };
        return { ...sum, ...update };
      }, {});

      return dispatch({ type: FETCH_PLAYLISTS_TRACKS_READY, payload });
    }
  );
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

    case FETCH_PLAYLISTS_TRACKS_READY: {
      return state
        .set('isLoadingPlaylistsTracks', false)
        .set('playlistsTracks', state.get('playlistsTracks').merge(fromJS(action.payload)));
    }

    default: {
      return state;
    }
  }
}
