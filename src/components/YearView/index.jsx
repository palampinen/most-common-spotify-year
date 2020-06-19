import React, { useState, useEffect } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  getRandomCoverFromMainYear,
  getYearlyTrackCounts,
  getYearlyTracks,
  getYearsWithTracks,
  fetchMostCommonYear,
} from 'concepts/user-library';
import Modal from 'components/Modal';
import TracksFromYear from 'components/TracksFromYear';
import './YearView.scss';

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
  const { yearlyTrackCounts, tracksByYears, yearsWithTracks, mainYearCoverUrl } = props;
  const isSharedPage = yearlyTrackCounts.isEmpty();

  // To ease development
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && isSharedPage) {
  //     props.fetchMostCommonYear();
  //   }
  // }, []);

  return (
    <>
      {!!detailYear && (
        <TracksFromYear
          tracksByYears={tracksByYears}
          year={detailYear}
          availableYears={yearsWithTracks}
          setYear={setYearDetail}
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
            {randomFact && <p className="yearView__fact">{randomFact}</p>}

            <figure className="yearView__img">
              <img
                alt={`Album from year ${year}`}
                src={mainYearCoverUrl || 'https://picsum.photos/500/500'}
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

                <div className="yearView__share">
                  <h3>Share your year</h3>
                  <div className="yearView__share__buttons">
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
                </div>
              </>
            )}

            {isSharedPage && (
              <div className="footer-buttons">
                <Link className="btn-primary" to="/">
                  Find out your Year{' '}
                  <span role="img" aria-label="music">
                    🎵
                  </span>
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
  yearsWithTracks: getYearsWithTracks(state),
  mainYearCoverUrl: getRandomCoverFromMainYear(state),
});

const mapDispatchToProps = { fetchMostCommonYear };

export default connect(mapStateToProps, mapDispatchToProps)(YearView);
