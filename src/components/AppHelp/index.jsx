import React, { Component } from 'react';
import './AppHelp.scss';
import Modal from 'components/Modal';

class Apphelp extends Component {
  render() {
    return (
      <Modal className="app-help-modal">
        <div className="app-help">
          <button className="back-button" onClick={this.props.onBack}>
            <i className="ion-arrow-left-c icon"></i> Back
          </button>
          <h1>Yeardrums</h1>
          <p>
            Yeardrums is an app developed/produced by Pasi Lampinen and Jack Spurr as a means to
            give Spotify users insight on their musical library and some fun history facts about
            each year.
          </p>
          <p>
            Yeardrums covers libraries with songs from 1945-2020. The song's accounted for when
            calculating a user's year must be in the user's playlists or saved tracks. Certain
            albums are listed as Compilation where songs in that album were not released in the year
            the album states. In this case Spotify's search API will try to provide the correct year
            for those songs, but will not be 100% accurate and some songs may not be included in the
            calculation.
          </p>
          <p>
            Each fact has been verified, but of course please check out each one on your own. The
            images used are for educational purposes and are protected under the Fair Use Copyright
            Act of 1976. Yeardrums is not affiliated and has no partnership with Spotify in any way
            shape or form.
          </p>
          <p>
            <strong>We hope you enjoy reeling in the years!</strong>
          </p>
        </div>
      </Modal>
    );
  }
}

export default Apphelp;
