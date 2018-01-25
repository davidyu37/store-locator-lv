import React, { Component } from 'react';


import './TabHandle.css';

import tabHandleUp from '../../../assets/images/icons/handle-up.svg';
import tabHandleDown from '../../../assets/images/icons/handle-down.svg';



export default class TabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="tab-handle-container">
        <img onClick={this.props.toggleTray} className="tab-handle-image" src={this.props.isTrayOpen ? tabHandleDown : tabHandleUp} />
      </div>
    );
  }
}
