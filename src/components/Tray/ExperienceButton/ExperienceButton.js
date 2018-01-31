import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './ExperienceButton.css';


export default class ExperienceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Link to={`/city/${this.props.city}`} className="experience-button-container">
        {/* <div > */}
          EXPERIENCE {this.props.city}
        {/* </div> */}
      </Link>
    );
  }
}
