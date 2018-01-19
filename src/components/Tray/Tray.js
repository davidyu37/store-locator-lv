import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import './Tray.css';

import TabHandle from './TabHandle/TabHandle';
import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTrayOpen: false,
      selectedStore: this.props.selectedStore,
      stores: this.props.stores,
    }
    this.trayChange = this.trayChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stores !== this.state.stores) {
      this.setState({ stores: nextProps.stores });
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
  }

  trayChange(e) {
    console.log(e);
    this.setState({ isTrayOpen: e });
  }

  render() {
    return (
      <div className="tray">
        <SwipeableBottomSheet
          overflowHeight={180}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          onChange={this.trayChange}
        >
          <div className="tray-container">
            <TabHandle isTrayOpen={this.state.isTrayOpen} />
            {/* <SearchBar /> */}
            <Carousel
              stores={this.state.stores}
              selectStore={this.props.selectStore}
            />
          </div>
        </SwipeableBottomSheet>
      </div>
    );
  }
}
