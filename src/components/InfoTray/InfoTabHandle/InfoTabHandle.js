import React, { Component } from 'react';


import './InfoTabHandle.css';
import tabHandleUp from '../../../images/tab-handle-up.png';
import tabHandleDown from '../../../images/tab-handle-down.png';


export default class InfoTabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="info-tab-handle-container">
        <img onClick={() => this.toggleTray()} className="info-tab-handle-image" src={this.props.isInfoTrayOpen ? tabHandleDown : tabHandleUp} />
      </div>
    );
  }
}
