import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import './InfoTray.css';

import iconClose from '../../images/iconClose.png';
import uberIcon from '../../images/uber.png';
import walkIcon from '../../images/walk.png';
import directionsIcon from '../../images/directions.png';

import InfoTabHandle from './InfoTabHandle/InfoTabHandle';
import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';
import Nearby from '../Carousel/Nearby/Nearby';
import Cities from '../Carousel/Cities/Cities';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfoTrayOpen: false,
      selectedStore: this.props.selectedStore,
      stores: this.props.stores,
      height: this.props.infoTrayHeight,
    }
    this.trayChange = this.trayChange.bind(this);
    this.toggleTray = this.toggleTray.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stores !== this.state.stores) {
      this.setState({ stores: nextProps.stores });
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
    if (nextProps.infoTrayHeight !== this.state.height) {
      console.log('got something')
      this.setState({ height: nextProps.infoTrayHeight });
    }
  }

  trayChange(e) {
    console.log(e);
    this.setState({ isInfoTrayOpen: e });
    if (!e) {
      this.props.infoTrayStatusChange(e);
    }
  }

  toggleTray() {
    this.setState({ isInfoTrayOpen: !this.state.isInfoTrayOpen })
  }

  hideTray() {
    this.props.infoTrayHeightChange(0)
    this.setState({ isInfoTrayOpen: false });
    // this.props.isInfoTrayOpen(false);
  }

  render() {
    console.log(this.state)
    return (
      <div className="info-tray">
        <SwipeableBottomSheet
          overflowHeight={this.state.height}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          open={this.state.isInfoTrayOpen}
          onChange={this.trayChange}
        >
          {this.props.selectedStore ? 
            <div className="info-tray-container">
              <div className="info-tray-basic-container">
                {/* <div onClick={() => this.toggleTray()}> */}
                  <InfoTabHandle isInfoTrayOpen={this.state.isInfoTrayOpen} toggleTray={this.toggleTray} />
                {/* </div> */}
                <div className="info-tray-header-container">
                  <div className="info-tray-header-title">{this.state.selectedStore.name}</div>
                  <div onClick={() => this.hideTray()} className="info-tray-close-button-container">
                    <img className="info-tray-close-button" src={iconClose} />
                  </div>
                </div>
                <div className="info-tray-address-and-image-container">
                  <div className="info-tray-address-container">
                  {this.state.selectedStore.address}
                  </div>
                  <div className="info-tray-store-image-container">
                    <img className="info-tray-store-image" src={this.state.selectedStore.image} />
                  </div>
                </div>
                <div className="info-tray-navigation-container">
                  <div className="info-tray-navigation-element">
                    <img src={uberIcon} />
                    <span>22 min</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <img src={walkIcon} />
                    <span>12 min</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <img src={directionsIcon} />
                    <span id="no-padding">Directions</span>
                  </div>
                </div>
              </div>
            </div>
            : <div></div>
          }
        </SwipeableBottomSheet>
      </div>
    );
  }
}
