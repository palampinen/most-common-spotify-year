import get from 'lodash/get';
import last from 'lodash/last';
import queryString from 'query-string';

export const parseAccessToken = () => {
  const url = window.location.href;
  const callbackParams = last(url.split('#'));
  const queryParams = queryString.parse(callbackParams);

  return get(queryParams, 'access_token');
};

export default parseAccessToken;
