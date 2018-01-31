import React, { Component } from 'react';

import SVG from 'react-inlinesvg';

import './InfoTabHandle.css';

import tabHandleUp from '../../../assets/images/icons/handle-up.svg';
import tabHandleDown from '../../../assets/images/icons/handle-down.svg';


export default class InfoTabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="info-tab-handle-container">
        <div
          onClick={() => this.props.toggleTray()}
          // className="info-tab-handle-image"
        >
          <SVG
            src={this.props.isInfoTrayOpen ? tabHandleDown : tabHandleUp}
          >
            <img src={this.props.isInfoTrayOpen ? tabHandleDown : tabHandleUp} alt="" />
          </SVG>
        </div>
      </div>
    );
  }
}
