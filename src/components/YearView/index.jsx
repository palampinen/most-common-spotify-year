import React, { useState, useEffect } from 'react';
import get from 'lodash/get';

import Modal from 'components/Modal';
import './YearView.scss';

const YearView = props => {
  useEffect(() => {
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      .then(response => response.json())
      .then(data => setRandomFact(data.text));
  }, []);

  const [randomFact, setRandomFact] = useState('');

  const year = get(props, ['match', 'params', 'year']);
  const url = window.location.href;
  return (
    <Modal>
      <div className="yearView">
        <h1>
          Your Year
          <br />
          <span>{year}</span>
        </h1>

        <div className="yearView__content">
          {randomFact && <p>{randomFact}</p>}

          <div className="yearView__img">
            <img src="https://picsum.photos/600/350?grayscale" className="yearView__img__img" />
          </div>
        </div>

        <div className="yearView__footer">
          <h3>Share your year</h3>
          <div className="yearView__share">
            <a
              className="yearView__share__link"
              href={`whatsapp://${url}`}
              title="Share to Whatsapp"
            >
              <i className="ion-social-whatsapp"></i>
            </a>
            <a
              className="yearView__share__link"
              href={`https://twitter.com/intent/tweet?text=Most+common+year+for+my+music+is+${year}&url=${encodeURI(
                url
              )}`}
              rel="noopener noreferrer"
              title="Share to Twitter"
            >
              <i className="ion-social-twitter" />
            </a>
            <a
              className="yearView__share__link"
              href={`https://www.facebook.com/sharer.php?u=${encodeURI(
                url
              )}&t=Most+common+year+for+my+music+is+${year}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share to Facebook"
            >
              <i className="ion-social-facebook" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default YearView;
