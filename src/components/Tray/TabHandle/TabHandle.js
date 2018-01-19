import React, { Component } from 'react';


import './TabHandle.css';
import tabHandleUp from '../../../images/tab-handle-up.png';
import tabHandleDown from '../../../images/tab-handle-down.png';


export default class TabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="tab-handle-container">
        <img className="tab-handle-image" src={this.props.isTrayOpen ? tabHandleDown : tabHandleUp} />
      </div>
    );
  }
}
