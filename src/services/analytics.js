// Service to use Google Analytics

import ReactGA from 'react-ga';
import isObject from 'lodash/isObject';
import mapValues from 'lodash/mapValues';
import toString from 'lodash/toString';
import config from 'config';

export const initializeAnalytics = () => {
  if (process.env.NODE_ENV !== 'test') {
    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
    pageView(window.location.pathname + window.location.search);
  }
};

export const trackEvent = opts => {
  // Stringify possible objects from event data
  const eventOpts = mapValues(opts, value => {
    if (isObject(value)) {
      return JSON.stringify(value);
    }

    return toString(value);
  });

  return ReactGA.event(eventOpts);
};

export const trackCustomEvent = (category, action, label) =>
  trackEvent({ category, action, label });

export const pageView = path => {
  return ReactGA.pageview(path);
};
