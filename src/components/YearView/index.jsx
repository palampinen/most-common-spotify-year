import React, { useState, useEffect } from 'react';
import get from 'lodash/get';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ReactComponent as PlayIcon } from 'assets/play-icon.svg';

import { getYearlyTrackCounts, getYearlyTracks } from 'concepts/user-library';
import Modal from 'components/Modal';
import history from 'services/history';
import './YearView.scss';

const YearTracksView = ({ year, tracksByYears, clearYear }) => {
  const tracksByYear = tracksByYears.get(year);

  window.onpopstate = function (event) {
    event.preventDefault && event.preventDefault();
    clearYear();

    setTimeout(function () {
      window.onpopstate = null;
    });
  };

  return (
    <Modal className="trackView__modal">
      <div className="yearView trackView">
        <button className="backButton" onClick={clearYear}>
          <i className="ion-arrow-left-c icon"></i> Back
        </button>
        <h3>Tracks from Year {year}</h3>
        <div className="trackList">
          {tracksByYear
            .sortBy(track => track.getIn(['track', 'artists', 0, 'name']))
            .map(track => (
              <a
                className="track"
                href={track.getIn(['track', 'uri'])}
                key={track.getIn(['track', 'id'])}
              >
                {' '}
                <figure className="img">
                  <img
                    alt="Album cover"
                    src={track.getIn(['track', 'album', 'images', 2, 'url'])}
                  />
                  <PlayIcon className="play-icon" />
                </figure>
                <div>
                  <div className="artist">
                    {(track.getIn(['track', 'artists']) || List())
                      .map(artist => artist.get('name'))
                      .join(', ')}
                  </div>
                  <div className="name">{track.getIn(['track', 'name'])}</div>
                </div>
              </a>
            ))}
        </div>
        {tracksByYear.size > 10 && (
          <button className="backButton" onClick={clearYear}>
            <i className="ion-arrow-left-c icon"></i> Back
          </button>
        )}
      </div>
    </Modal>
  );
};

const YearView = props => {
  const [randomFact, setRandomFact] = useState('');
  const [detailYear, setYearDetail] = useState(null);

  useEffect(() => {
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      .then(response => response.json())
      .then(data => setRandomFact(data.text));
  }, []);

  const year = get(props, ['match', 'params', 'year']);
  const url = window.location.href;
  const { yearlyTrackCounts, tracksByYears } = props;
  const isSharedPage = yearlyTrackCounts.isEmpty();

  return (
    <>
      {!!detailYear && (
        <YearTracksView
          tracksByYears={tracksByYears}
          year={detailYear}
          clearYear={() => {
            window.location.hash = '';
            setYearDetail(null);
          }}
        />
      )}
      <Modal>
        <div className="yearView">
          <h1>
            <span className="title">{isSharedPage ? 'My' : 'Your'} Year</span>
            <span className="highlight">{year}</span>
          </h1>

          <div className="yearView__content">
            {randomFact && <p>{randomFact}</p>}

            <figure className="yearView__img">
              <img
                alt={`Pic from year ${year}`}
                src="https://picsum.photos/600/350?grayscale"
                className="yearView__img__img"
              />
            </figure>
          </div>

          <div className="yearView__footer">
            {!isSharedPage && (
              <>
                <h3>Tracks by Year</h3>
                <div className="yearView__viz">
                  {yearlyTrackCounts.map(yearlyCount => (
                    <div
                      className="yearView__viz__row"
                      key={yearlyCount.get('year')}
                      onClick={() => {
                        window.location.hash = 'tracks';
                        setYearDetail(yearlyCount.get('year'));
                      }}
                    >
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
    </>
  );
};

const mapStateToProps = state => ({
  yearlyTrackCounts: getYearlyTrackCounts(state),
  tracksByYears: getYearlyTracks(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(YearView);
