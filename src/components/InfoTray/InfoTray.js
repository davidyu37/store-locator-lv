import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';


import IsolatedScroll from 'react-isolated-scroll';


import './InfoTray.css';

import iconClose from '../../assets/images/icons/icon-close.svg';
import uberIcon from '../../assets/images/icons/icon-uber.svg';
import walkIcon from '../../assets/images/icons/icon-walk.svg';
import directionsIcon from '../../assets/images/icons/icon-directions.svg';

import phoneIcon from '../../assets/images/icons/icon-telephone.svg';
import emailIcon from '../../assets/images/icons/icon-email.svg';
import shareIcon from '../../assets/images/icons/icon-share.svg';


import InfoTabHandle from './InfoTabHandle/InfoTabHandle';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfoTrayOpen: this.props.isInfoTrayOpen,
      selectedStore: this.props.selectedStore,
      stores: this.props.stores,
      height: this.props.infoTrayHeight,
    };
    this.trayChange = this.trayChange.bind(this);
    this.toggleTray = this.toggleTray.bind(this);

    this.dragging = false;
    this.transform = 0;

    this.animationOnClose = true;

    this.isOpen = false;
    this.transition = {
      transition: '300ms',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stores !== this.state.stores) {
      this.setState({ stores: nextProps.stores });
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
    if (nextProps.infoTrayHeight !== this.state.height) {
      this.setState({ height: nextProps.infoTrayHeight });
    }
    if (nextProps.isInfoTrayOpen !== this.state.isInfoTrayOpen) {
      this.setState({ isInfoTrayOpen: nextProps.isInfoTrayOpen });
    }
  }

  getTransform(num) {
    if (num === this.transform) {
      return;
    }
    this.transform = num;
    this.props.getTransformMap(num);
  }

  trayChange(e) {
    this.props.infoTrayStatusChange(e);
  }

  toggleTray() {
    this.props.infoTrayStatusChange(!this.state.isInfoTrayOpen);
  }

  hideTray() {
    this.props.infoTrayHeightChange(0);
    this.props.infoTrayStatusChange(false);

    if (this.state.isInfoTrayOpen) {
      this.transition = {
        transition: '0ms',
      };
      setTimeout(() => this.transition = {
        transition: '300ms',
      }, 300);
    }
  }

  isDragging(is) {
    if (this.dragging === is) {
      return;
    }
    this.dragging = is;
    this.props.isDragging(is);
  }

  render() {
    return (
      <div className="info-tray">
        <SwipeableBottomSheet
          overflowHeight={this.state.height}
          style={this.transition}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          open={this.state.isInfoTrayOpen}
          onChange={this.trayChange}
          scrollTopAtClose={false}
          swipeableViewsProps={{
            gettransform: num => this.getTransform(num),
            dragging: is => this.isDragging(is),
            animateTransitions: true,
            springConfig: { duration: '300ms', easeFunction: 'ease', delay: '0s' },
            // resistance: true
          }}
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
                    <img className="info-tray-close-button" src={iconClose} alt="" />
                  </div>
                </div>
                <div className="info-tray-address-and-image-container">
                  <div className="info-tray-address-container">
                    {this.state.selectedStore.address}
                  </div>
                  <div className="info-tray-store-image-container">
                    <img className="info-tray-store-image" src={this.state.selectedStore.image} alt="" />
                  </div>
                </div>
                <div className="info-tray-navigation-container">
                  <div className="info-tray-navigation-element">
                    <img src={uberIcon} alt="" />
                    <span>22 min</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <img src={walkIcon} alt="" />
                    <span>12 min</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <img src={directionsIcon} alt="" />
                    <span id="no-padding">Directions</span>
                  </div>
                </div>
              </div>
              <IsolatedScroll>
                <div className="info-tray-more-info-container">
                  <div className="info-tray-contacts-container">
                    <div className="info-tray-contacts-element">
                      <img src={phoneIcon} alt="" />
                      <span><a href="tel:212-343-1490">212-343-1490</a></span>
                    </div>
                    <div className="info-tray-contacts-element">
                      <img src={emailIcon} alt="" />
                      <span><a href="mailto:marcjacobs@gmail.com">Email</a></span>
                    </div>
                    <div className="info-tray-contacts-element">
                      <img src={shareIcon} alt="" />
                      <span id="no-padding">Share</span>
                    </div>
                  </div>
                  <div className="info-tray-opening-hours-main-container">
                    <div className="info-tray-opening-hours-header">OPENING HOURS</div>
                    <div className="info-tray-opening-hours-container">
                      <div className="info-tray-opening-hours-days">Mon - Sat</div>
                      <div className="info-tray-opening-hours-days">11am - 7pm</div>
                    </div>
                    <div className="info-tray-opening-hours-container">
                      <div className="info-tray-opening-hours-days">Sun</div>
                      <div className="info-tray-opening-hours-days">12pm - 6pm</div>
                    </div>
                  </div>
                  <div className="info-tray-store-info-container">
                    <div className="info-tray-store-info-header">STORY INFO</div>
                    <div className="info-tray-store-info-text">
                      Browse Marc Jacobs watches, perfume, bags, clothing, and more at a store near you. Shop one of our convenient Marc Jacobs stores, outlets or Bookmarc locations.
                      Browse Marc Jacobs watches, perfume, bags, clothing, and more at a store near you. Shop one of our convenient Marc Jacobs stores, outlets or Bookmarc locations.
                      Browse Marc Jacobs watches, perfume, bags, clothing, and more at a store near you. Shop one of our convenient Marc Jacobs stores, outlets or Bookmarc locations.
                    </div>
                  </div>
                </div>
              </IsolatedScroll>
            </div>
            : <div />
          }
        </SwipeableBottomSheet>
      </div>
    );
  }
}
