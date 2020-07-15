import React from 'react';
import './LoadingView.scss';

import Loader from 'assets/816.png';

const LoadingView = () => (
  <div className="loading">
    <img alt="Loading" src={Loader} className="spinner" />
    {/*
    <div className="spinner">
      <svg viewBox="0 0 64 64">
        <g fill="none" fillRule="evenodd" strokeWidth="3">
          <circle cx="32" cy="32" r="13.9548">
            <animate
              attributeName="r"
              begin="0s"
              dur="2s"
              values="0;24"
              keyTimes="0;1"
              keySplines="0.1,0.2,0.3,1"
              calcMode="spline"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="2s"
              values=".2;1;.2;0"
              repeatCount="indefinite"
            ></animate>
          </circle>
          <circle cx="32" cy="32" r="23.3">
            <animate
              attributeName="r"
              begin="-1s"
              dur="2s"
              values="0;24"
              keyTimes="0;1"
              keySplines="0.1,0.2,0.3,1"
              calcMode="spline"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              begin="-1s"
              dur="2s"
              values=".2;1;.2;0"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </g>
      </svg>
    </div>
    </div>
  */}
    <h2>Analyzing your musical taste</h2>
  </div>
);

export default LoadingView;
