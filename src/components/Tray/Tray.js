import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import './Tray.css';

import TabHandle from './TabHandle/TabHandle';
import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';
import Nearby from '../Carousel/Nearby/Nearby';
import Cities from '../Carousel/Cities/Cities';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTrayOpen: this.props.isTrayOpen,
      selectedStore: this.props.selectedStore,
      stores: this.props.stores,
    }
    this.trayChange = this.trayChange.bind(this);
    this.toggleTray = this.toggleTray.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stores !== this.state.stores) {
      this.setState({ stores: nextProps.stores });
    }
    if (nextProps.isTrayOpen !== this.state.isTrayOpen) {
      this.setState({ isTrayOpen: nextProps.isTrayOpen });
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
  }

  trayChange(e) {
    console.log(e);
    this.setState({ isTrayOpen: e });
  }

  toggleTray() {
    this.setState({ isTrayOpen: !this.state.isTrayOpen })
  }


  render() {
    return (
      <div className="tray">
        <SwipeableBottomSheet
          overflowHeight={180}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          open={this.state.isTrayOpen}
          onChange={this.trayChange}
        >
          <div className="tray-container">
            {/* <div onClick={() => this.toggleTray()}> */}
             <TabHandle isTrayOpen={this.state.isTrayOpen} toggleTray={this.toggleTray} />
            {/* </div> */}
            {/* <SearchBar /> */}
            <Carousel
              stores={this.state.stores}
              selectStore={this.props.selectStore}
              infoTrayStatusChange={this.props.infoTrayStatusChange}
              infoTrayHeightChange={this.props.infoTrayHeightChange}
              trayStatusChange={this.props.trayStatusChange}
            />
            <Nearby
              stores={this.state.stores}
              selectStore={this.props.selectStore}
            />
            <Cities
              stores={this.state.stores}
              selectStore={this.props.selectStore}
            />
          </div>
        </SwipeableBottomSheet>
      </div>
    );
  }
}
