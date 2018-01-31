import React, { Component } from 'react';

import './SplashScreen.css';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    if (this.props.isLoaded) {
      this.splashScreenStyle = { opacity: 0, zIndex: 0 };
    }
    return (
      <div className="splash-screen" style={this.splashScreenStyle}>Splash Screen</div>
    );
  }
}
