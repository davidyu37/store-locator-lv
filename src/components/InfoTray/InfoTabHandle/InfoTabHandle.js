import React, { Component } from 'react';


import './InfoTabHandle.css';

import tabHandleUp from '../../../images/icons/handle-up.svg';
import tabHandleDown from '../../../images/icons/handle-down.svg';



export default class InfoTabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="info-tab-handle-container">
        <img onClick={() => this.props.toggleTray()} className="info-tab-handle-image" src={this.props.isInfoTrayOpen ? tabHandleDown : tabHandleUp} />
      </div>
    );
  }
}
