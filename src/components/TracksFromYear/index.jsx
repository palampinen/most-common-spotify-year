import React from 'react';
import { List } from 'immutable';
import classnames from 'classnames';

import { ReactComponent as PlayIcon } from 'assets/play-icon.svg';
import Modal from 'components/Modal';
import styles from './TracksFromYear.module.scss';
import { FROM_SAVED_TRACKS, FROM_SAVED_ALBUM, FROM_PLAYLIST } from 'constants/TrackSources';

const getSourceInformation = track => {
  const source = track.getIn(['source', 'type']);
  if (source === FROM_SAVED_TRACKS) {
    return (
      <a href={track.getIn(['source', 'uri'])} target="_blank" rel="noopener noreferrer">
        Liked Song
      </a>
    );
  }

  if (source === FROM_PLAYLIST) {
    return (
      <a href={track.getIn(['source', 'uri'])} target="_blank" rel="noopener noreferrer">
        <span>{track.getIn(['source', 'name'])}</span>
      </a>
    );
  }

  if (source === FROM_SAVED_ALBUM) {
    return (
      <a href={track.getIn(['source', 'uri'])} target="_blank" rel="noopener noreferrer">
        <span>{track.getIn(['source', 'name'])}</span>
      </a>
    );
  }

  return null;
};

const TracksFromYear = ({ availableYears, year, tracksByYears, clearYear, setYear }) => {
  const tracksByYear = tracksByYears.get(year);
  const yearPosition = availableYears.indexOf(year);

  window.onpopstate = function (event) {
    event.preventDefault && event.preventDefault();
    clearYear();

    setTimeout(function () {
      window.onpopstate = null;
    });
  };

  return (
    <Modal className={styles.trackViewModal}>
      <div className={classnames('yearView', styles.trackView)}>
        <button className={styles.backButton} onClick={clearYear}>
          <i className={classnames('ion-arrow-left-c', styles.icon)}></i> Back
        </button>

        <h3 className={styles.navTitle}>
          <button
            disabled={yearPosition <= 0}
            className={styles.navButton}
            onClick={() => setYear(availableYears.get(yearPosition - 1))}
          >
            <i className={classnames('ion-arrow-left-b', styles.icon, styles.iconLeft)}></i>
          </button>
          <span className={styles.titleText}>Tracks from Year {year}</span>
          <button
            disabled={yearPosition >= availableYears.size - 1}
            className={styles.navButton}
            onClick={() => setYear(availableYears.get(yearPosition + 1))}
          >
            <i className={classnames('ion-arrow-right-b', styles.icon)}></i>
          </button>
        </h3>

        <div className={styles.trackList}>
          {tracksByYear
            .sortBy(track => track.getIn(['artists', 0, 'name']))
            .map(track => (
              <a className={styles.track} href={track.getIn(['uri'])} key={track.getIn(['id'])}>
                <figure className={styles.img}>
                  <img alt="Album cover" src={track.getIn(['album', 'images', 2, 'url'])} />
                  <PlayIcon className={styles.playIcon} />
                </figure>
                <span className={styles.trackInfo}>
                  <span className={styles.artist}>
                    {(track.getIn(['artists']) || List())
                      .map(artist => artist.get('name'))
                      .join(', ')}{' '}
                    • <span>{track.getIn(['name'])}</span>
                  </span>
                  <span className={styles.name}>{getSourceInformation(track)}</span>
                </span>
                {/*
                <span className={styles.moreInfo}>
                  <span className={classnames('ion-more', styles.moreIcon)}></span>
                  <span className={styles.trackSource}>{getSourceInformation(track)}</span>
                </span>
                */}
              </a>
            ))}
        </div>
        {tracksByYear.size > 10 && (
          <button className={styles.backButton} onClick={clearYear}>
            <i className="ion-arrow-left-c icon"></i> Back
          </button>
        )}
      </div>
    </Modal>
  );
};

export default TracksFromYear;
