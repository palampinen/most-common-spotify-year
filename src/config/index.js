const config = {
  API_URL: 'https://api.spotify.com/v1',
  SPOTIFY_AUTHORIZE_URL: 'https://accounts.spotify.com/authorize',
  SPOTIFY_AUTH_SCOPES: 'playlist-read-private user-library-read',
  SPOTIFY_CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  CALLBACK_URL: `${window.location.origin}/callback`,

  // Default Country used for artists top track query
  // https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/
  // This could be dynamic, but userinfo for instance does not include this information
  DEFAULT_COUNTRY_CODE: 'FI',
};

export default config;
