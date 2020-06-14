import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { authorizeUser } from '../../concepts/auth';
import changeThemeColor from '../../services/change-theme';
import ThemeColors from '../../constants/ThemeColors';
import './LoginView.scss';

import { ReactComponent as SpotifyLogo } from 'assets/spotify.svg';

class LoginView extends Component {
  componentDidMount() {
    changeThemeColor(ThemeColors.DEFAULT);
  }

  render() {
    return (
      <span>
        <div className="login">
          <div className="login__content">
            <span className="login__app-icon" onClick={this.toggleAppInfo}>
              Obscurify<span className="login__app-icon__dot">.</span>
            </span>

            <h1 className="login__title">How old is your music taste?</h1>
            <button className="btn btn-primary btn-login" onClick={this.props.authorizeUser}>
              <SpotifyLogo className="spotifyLogo" /> Log in with Spotify
            </button>

            <Link className="btn-link" to="app-info">
              What is this?
            </Link>
          </div>
          <span className="login__background" />
        </div>
      </span>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = { authorizeUser };

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
