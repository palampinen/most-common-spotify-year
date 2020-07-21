import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import random from 'lodash/random';
import replace from 'lodash/replace';

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
import YearlyFacts from 'constants/YearlyFacts';
import YearImage from 'components/YearImage';
import AppHelp from 'components/AppHelp';
import './YearView.scss';

const YearView = props => {
  const [randomFact, setRandomFact] = useState('');
  const [detailYear, setYearDetail] = useState(null);
  const [factIndex, setFactIndex] = useState(null);
  const [isCopiedOk, setCopiedOk] = useState(false);
  const [isAboutPageVisible, setAboutPageVisible] = useState(false);
  const year = get(props, ['match', 'params', 'year']);
  const { urlFactIndex } = props;
  const copyUrlRef = useRef();

  // Set random fact or get from URL
  useEffect(() => {
    const facts = get(YearlyFacts, [year, 'facts']);
    if (facts && facts.length) {
      const factIndex =
        urlFactIndex && urlFactIndex < facts.length ? urlFactIndex : random(facts.length - 1);

      setFactIndex(factIndex);
      setRandomFact(facts[factIndex]);
    }
  }, [urlFactIndex, year]);

  const baseUrl = replace(window.location.href, '#', '');
  const url = urlFactIndex ? baseUrl : `${baseUrl}?fact=${factIndex}`;
  const { yearlyTrackCounts, tracksByYears, yearsWithTracks } = props;
  const isSharedPage = yearlyTrackCounts.isEmpty();

  return (
    <>
      <Helmet>
        <title>Yeardrums | {year}</title>
        <meta name="description" content="Yeardrums - Find out your main Music Year 🎵" />
        <meta property="og:image" content="assets/yeardrums.png"></meta>
        <meta property="og:title" content="Yeardrums - Find out your main Music Year 🎵"></meta>
        <meta
          property="og:description"
          content="Yeardrums app will analyze your musical taste from Spotify and give you year that you have most music."
        ></meta>
      </Helmet>

      {!!detailYear && (
        <TracksFromYear
          tracksByYears={tracksByYears}
          year={detailYear}
          mainFactIndex={factIndex}
          mainYear={year}
          mainRandomFact={randomFact}
          availableYears={yearsWithTracks}
          setYear={setYearDetail}
          clearYear={() => {
            window.location.hash = '';
            setYearDetail(null);
          }}
        />
      )}

      {isAboutPageVisible && (
        <AppHelp
          onBack={() => {
            window.location.hash = '';
            setAboutPageVisible(false);
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
              <YearImage
                alt={`Image from year ${year}`}
                imageId={`${year}-${factIndex + 1}`}
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
                          {yearlyCount.get('year') === year ? ' ⭐️' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="yearView__share">
                  <h3>Share your year</h3>
                  <div className="yearView__share__buttons">
                    <div ref={copyUrlRef} className="yearView__share__url">
                      {url}
                    </div>
                    <button
                      className="yearView__share__link"
                      onClick={() => {
                        const copyTextElement = copyUrlRef.current;
                        const sel = window.getSelection();
                        let range;

                        if (document.selection) {
                          range = document.body.createTextRange();
                          range.moveToElementText(copyTextElement);
                          range.select();
                        } else if (sel) {
                          range = document.createRange();
                          range.selectNodeContents(copyTextElement);
                          sel.removeAllRanges();
                          sel.addRange(range);
                        }

                        document.execCommand('copy');
                        setCopiedOk(true);

                        setTimeout(() => {
                          setCopiedOk(false);
                        }, 3000);
                      }}
                      title="Copy to clipboard"
                    >
                      {isCopiedOk ? (
                        <i className="ion-checkmark-round icon-success"></i>
                      ) : (
                        <i className="ion-link"></i>
                      )}
                    </button>

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
                  <span role="img" aria-label="drums">
                    🥁
                  </span>
                </Link>
              </div>
            )}

            <div className="footer-links">
              <button
                className="link--about"
                onClick={() => {
                  window.location.hash = 'about';
                  setAboutPageVisible(true);
                }}
              >
                <i className="icon ion-help-circled"></i> About this app
              </button>
            </div>
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
  urlFactIndex: get(state, ['router', 'location', 'query', 'fact']),
});

const mapDispatchToProps = { fetchMostCommonYear };

// const YearViewWithRouter = withRouter(YearView);

export default connect(mapStateToProps, mapDispatchToProps)(YearView);
