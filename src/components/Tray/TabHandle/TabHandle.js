import React, { Component } from 'react';

import './TabHandle.css';

import { ReactComponent as TabHandleUp } from '../../../assets/images/icons/handle-up.svg';
import { ReactComponent as TabHandleDown } from '../../../assets/images/icons/handle-down.svg';

export default class TabHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="tab-handle-container">
        <div
          onClick={() => this.props.toggleTray()}
          // className="tab-handle-image"
        >
          {this.props.isTrayOpen ? <TabHandleDown /> : <TabHandleUp />}
        </div>
      </div>
    );
  }
}
