import React from 'react';
import './LoadingView.scss';

// import Loader from 'assets/816.png';

const LoadingView = () => (
  <div className="loading">
    {/*
    <img alt="Loading" src={Loader} className="spinner" />
    */}
    <div className="spinner">
      <svg viewBox="0 0 64 64">
        <g strokeWidth="1" strokeLinecap="square">
          <line x1="10" x2="10">
            <animate
              attributeName="y1"
              dur="750ms"
              values="16;18;28;18;16;16"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="y2"
              dur="750ms"
              values="48;46;36;44;48;48"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              dur="750ms"
              values="1;.4;.5;.8;1;1"
              repeatCount="indefinite"
            ></animate>
          </line>
          <line x1="24" x2="24">
            <animate
              attributeName="y1"
              dur="750ms"
              values="16;16;18;28;18;16"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="y2"
              dur="750ms"
              values="48;48;46;36;44;48"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              dur="750ms"
              values="1;1;.4;.5;.8;1"
              repeatCount="indefinite"
            ></animate>
          </line>
          <line x1="38" x2="38">
            <animate
              attributeName="y1"
              dur="750ms"
              values="18;16;16;18;28;18"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="y2"
              dur="750ms"
              values="44;48;48;46;36;44"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              dur="750ms"
              values=".8;1;1;.4;.5;.8"
              repeatCount="indefinite"
            ></animate>
          </line>
          <line x1="52" x2="52">
            <animate
              attributeName="y1"
              dur="750ms"
              values="28;18;16;16;18;28"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="y2"
              dur="750ms"
              values="36;44;48;48;46;36"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="stroke-opacity"
              dur="750ms"
              values=".5;.8;1;1;.4;.5"
              repeatCount="indefinite"
            ></animate>
          </line>
        </g>
      </svg>
    </div>

    <h2>Analyzing your musical taste…</h2>
  </div>
);

export default LoadingView;
