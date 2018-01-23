import React, { Component } from 'react';
import './City.css';

import { translate } from 'react-i18next';

// The city page
class City extends Component {
  constructor(props) {
    super(props);
    const { cityname } = this.props.match.params;
  }

  render() {
    //i18n, t are for translation
    // const { i18n, t } = this.props;

    return (
      <div className="container">
        City page
        Wonderful Pictures
        Wonderful Words
        Wonderful everything
      </div>
    );
  }
}

export default translate()(City);
