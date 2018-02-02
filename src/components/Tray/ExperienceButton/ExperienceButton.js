import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import './ExperienceButton.css';


export class ExperienceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { t } = this.props;

    return (
      <Link to={`/city/${this.props.city}`} className="experience-button-container">
        {t('experience')} {this.props.city}
      </Link>
    );
  }
}

export default translate()(ExperienceButton);
