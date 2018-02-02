import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import './InfoTray.css';

import { ReactComponent as IconClose } from '../../assets/images/icons/icon-close.svg';
import { ReactComponent as UberIcon } from '../../assets/images/icons/icon-uber.svg';
import { ReactComponent as WalkIcon } from '../../assets/images/icons/icon-walk.svg';
import { ReactComponent as DirectionsIcon } from '../../assets/images/icons/icon-directions.svg';

import { ReactComponent as PhoneIcon } from '../../assets/images/icons/icon-telephone.svg';
import { ReactComponent as EmailIcon } from '../../assets/images/icons/icon-email.svg';
import { ReactComponent as ShareIcon } from '../../assets/images/icons/icon-share.svg';


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
    this.convertToHourMin = this.convertToHourMin.bind(this);

    this.dragging = false;
    this.transform = 0;

    this.animationOnClose = true;

    this.isOpen = false;
    this.transition = {
      transition: '300ms',
    };
    this.daysOfWeek = [
      {
        short: 'Mon',
        full: 'monday_business_hours',
      },
      {
        short: 'Tue',
        full: 'tuesday_business_hours',
      },
      {
        short: 'Wed',
        full: 'wednesday_business_hours',
      },
      {
        short: 'Thu',
        full: 'thursday_business_hours',
      },
      {
        short: 'Fri',
        full: 'friday_business_hours',
      },
      {
        short: 'Sat',
        full: 'saturday_business_hours',
      },
      {
        short: 'Sun',
        full: 'sunday_business_hours',
      },
    ];
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

  convertToHourMin = (hours) => {
    let hour = 0;
    let min = Math.round(hours * 60);
    if (hours > 1) {
      hour = Math.round(hours);
      const minutesDec = (hours - hour) * 60;
      min = Math.round(minutesDec);
    }

    if (hour > 10) {
      return '> 10H';
    } else if (hour > 0) {
      return `${hour}H ${min}M`;
    }
    return `${min} MIN`;
  }

  workingHours = (short, full) => (
    <div className="info-tray-opening-hours-days">
      <div className="info-tray-opening-hours-days-container">
        <div className="info-tray-opening-hours-days-day">{short}</div>
        <div className="info-tray-opening-hours-days-time">{full}</div>
      </div>
    </div>
  );

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
                  <div className="info-tray-header-title">{this.state.selectedStore.name ? this.state.selectedStore.name : this.state.selectedStore.business_name}</div>
                  <div onClick={() => this.hideTray()} className="info-tray-close-button-container">
                    <IconClose />
                  </div>
                </div>
                <div className="info-tray-address-and-image-container">
                  <div className="info-tray-address-container">
                    {this.state.selectedStore.address_1}
                  </div>
                  <div className="info-tray-store-image-container">
                    <img className="info-tray-store-image" src={this.state.selectedStore.photo} alt="" />
                  </div>
                </div>
                <div className="info-tray-navigation-container">
                  <div className="info-tray-navigation-element">
                    <UberIcon />
                    <span>22 min</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <WalkIcon />
                    <span>{this.convertToHourMin(this.state.selectedStore.walkTime)}</span>
                  </div>
                  <div className="info-tray-navigation-element">
                    <DirectionsIcon />
                    <span id="no-padding">Directions</span>
                  </div>
                </div>
              </div>
              <div className="info-tray-more-info-container">
                <div className="info-tray-contacts-container">
                  <div className="info-tray-contacts-element">
                    <PhoneIcon />
                    <span><a href="tel:212-343-1490">212-343-1490</a></span>
                  </div>
                  <div className="info-tray-contacts-element">
                    <EmailIcon />
                    <span><a href="mailto:marcjacobs@gmail.com">Email</a></span>
                  </div>
                  <div className="info-tray-contacts-element">
                    <ShareIcon />
                    <span id="no-padding">Share</span>
                  </div>
                </div>
                <div className="info-tray-opening-hours-main-container">
                  <div className="info-tray-opening-hours-header">OPENING HOURS</div>
                  <div className="info-tray-opening-hours-container">
                    {this.daysOfWeek.map(day => this.workingHours(day.short, this.state.selectedStore[day.full]))}
                  </div>
                </div>
                <div className="info-tray-store-info-container">
                  <div className="info-tray-store-info-header">STORE INFORMATION</div>
                  <div className="info-tray-store-info-text">
                    {this.state.selectedStore.description}
                  </div>
                </div>
              </div>
            </div>
            : <div />
          }
        </SwipeableBottomSheet>
      </div>
    );
  }
}
