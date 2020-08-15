import React from 'react';
import './LoadingView.scss';

import Loader from 'components/Loader';

const LoadingView = () => (
  <div className="loading">
    <Loader className="spinner" />

    <h2>Analyzing your musical taste…</h2>
  </div>
);

export default LoadingView;
