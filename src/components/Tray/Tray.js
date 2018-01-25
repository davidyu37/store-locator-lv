import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import Blah from 'react-swipeable-views';


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
      trayOverflowHeight: this.props.trayOverflowHeight,
    }
    this.trayChange = this.trayChange.bind(this);
    this.toggleTray = this.toggleTray.bind(this);

    this.dragging = false;
    this.transform = 0;

    // this.overflowHeight = 150; 
    this.transition = {
      transition: '300ms'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stores !== this.state.stores) {
      // this.setState({ stores: nextProps.stores });
      // // if (this.state.selectedStore) {
      //   this.transition = {
      //     transition: '0ms'
      //   }
      //   setTimeout(() => this.transition = {
      //     transition: '300ms'
      //   }, 300)
      // // }
    }
    if (nextProps.isTrayOpen !== this.state.isTrayOpen) {
      this.setState({ isTrayOpen: nextProps.isTrayOpen });
      if (this.state.isTrayOpen) {
        // console.log('tray opened', this.state.isTrayOpen)
        this.transition = {
          transition: '0ms'
        }
        setTimeout(() => {
          // console.log('transition back', this.state.isTrayOpen)
          this.transition = {
           transition: '300ms'
        }}, 300)
      }
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
    if (nextProps.trayOverflowHeight !== this.state.trayOverflowHeight) {
      this.setState({ trayOverflowHeight: nextProps.trayOverflowHeight });
    }
  }

  trayChange(e) {
    this.props.trayStatusChange(e);
  }

  toggleTray() {
    this.props.trayStatusChange(!this.state.isTrayOpen);
  }

  getTransform(num) {
    // console.log(num);
    if (num === this.transform) {
      return;
    }
    if (num === 0 && !this.dragging && this.state.isTrayOpen) {
      return;
    }
    this.transform = num;
    this.props.getTransformMap(num);
  }

  isDragging(is) {
    if (JSON.stringify(this.dragging) === JSON.stringify(is)) {
      // console.log('same same');
      return;
    }
    this.dragging = is;
    // console.log('not same');
    this.props.isDragging(is);
    // console.log(is);
  }


  render() {
    return (
      <div className="tray">
        <SwipeableBottomSheet
          style={this.transition}
          overflowHeight={this.state.trayOverflowHeight}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          open={this.state.isTrayOpen}
          onChange={this.trayChange}
          swipeableViewsProps={{ 
            gettransform: (num => this.getTransform(num)),
            dragging: (is => this.isDragging(is)),
            animateTransitions: true,
            springConfig: { duration: '300ms', easeFunction: 'ease', delay: '0s' },
          }}
        >
          <div className="tray-container">
             <TabHandle isTrayOpen={this.state.isTrayOpen} toggleTray={this.toggleTray} />
            {/* <SearchBar /> */}
            <Carousel
              stores={this.props.stores}
              selectStore={this.props.selectStore}
              infoTrayStatusChange={this.props.infoTrayStatusChange}
              infoTrayHeightChange={this.props.infoTrayHeightChange}
              trayStatusChange={this.props.trayStatusChange}
              isDragging={this.props.isDragging}
            />
            <Nearby
              stores={this.props.stores}
              selectStore={this.props.selectStore}
            />
            <Cities
              stores={this.props.stores}
              selectStore={this.props.selectStore}
            />
          </div>
        </SwipeableBottomSheet>
      </div>
    );
  }
}
