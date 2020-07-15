// # Saved Tracks concept
import get from 'lodash/get';
import times from 'lodash/times';
import { fromJS } from 'immutable';
import { apiCall } from 'services/api';

// # Action Types
const FETCH_SAVED_TRACKS = 'savedTracks/FETCH_SAVED_TRACKS';
const FETCH_SAVED_TRACKS_SUCCESS = 'savedTracks/FETCH_SAVED_TRACKS_SUCCESS';

// # Selectors
export const getSavedTracks = state => state.savedTracks.get('tracks');

// # Action Creators
const fetchSavedTracks = params => dispatch =>
  dispatch(
    apiCall({
      type: FETCH_SAVED_TRACKS,
      url: `/me/tracks`,
      params,
    })
  );

// Since fetching saved tracks is limited to 50 per request
// we need to get tracks in batches
const MAX_SAVED_TRACKS_PER_REQUEST = 50;
export const fetchAllSavedTracks = () => dispatch =>
  dispatch(fetchSavedTracks({ limit: MAX_SAVED_TRACKS_PER_REQUEST })).then(response => {
    const totalTracks = get(response, ['payload', 'data', 'total']);

    if (totalTracks > MAX_SAVED_TRACKS_PER_REQUEST) {
      const remainingTracks = totalTracks - MAX_SAVED_TRACKS_PER_REQUEST;
      const amountOfRequestsNeeded = Math.ceil(remainingTracks / MAX_SAVED_TRACKS_PER_REQUEST);

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
  });

// # Reducer
const initialState = fromJS({
  isLoadingSavedTracks: false,
  tracks: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SAVED_TRACKS: {
      return state.set('isLoadingSavedTracks', true);
    }

    case FETCH_SAVED_TRACKS_SUCCESS: {
      return state.set('tracks', state.get('tracks').concat(fromJS(action.payload.data.items)));
    }

    default: {
      return state;
    }
  }
}
