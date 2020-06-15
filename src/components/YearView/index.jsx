import React, { useState, useEffect } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getYearlyTracks } from 'concepts/user-library';
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
  const { yearlyTrackCounts } = props;
  const isSharedPage = yearlyTrackCounts.isEmpty();

  return (
    <Modal>
      <div className="yearView">
        <h1>
          <span className="title">{isSharedPage ? 'My' : 'Your'} Year</span>
          <span className="highlight">{year}</span>
        </h1>

        <div className="yearView__content">
          {randomFact && <p>{randomFact}</p>}

          <figure className="yearView__img">
            <img src="https://picsum.photos/600/350?grayscale" className="yearView__img__img" />
          </figure>
        </div>

        <div className="yearView__footer">
          {!isSharedPage && (
            <>
              <h3>Tracks by Year</h3>
              <div className="yearView__viz">
                {yearlyTrackCounts.map(yearlyCount => (
                  <div className="yearView__viz__row" key={yearlyCount.get('year')}>
                    <div className="yearView__viz__year">{yearlyCount.get('year')}</div>
                    <div className="yearView__viz__barwrap">
                      <div
                        className="yearView__viz__bar"
                        style={{ width: `${yearlyCount.get('percentage')}%` }}
                      >
                        {yearlyCount.get('count')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3>Share your year</h3>
              <div className="yearView__share">
                <a
                  className="yearView__share__link"
                  href={`https://wa.me/?text=${url}`}
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
            </>
          )}

          {isSharedPage && (
            <div className="footer-buttons">
              <Link className="btn-primary" to="/">
                Check out your Year
              </Link>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = state => ({
  yearlyTrackCounts: getYearlyTracks(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(YearView);
