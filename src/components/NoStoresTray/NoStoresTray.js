import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';


import './NoStoresTray.css';

// import SearchBar from '../SearchBar/SearchBar';
import Cities from '../Carousel/Cities/Cities';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trayOverflowHeight: 200,
    };
  }

  render() {
    return (
      <div className="no-stores-tray">
        <SwipeableBottomSheet
          // style={this.transition}
          overflowHeight={this.state.trayOverflowHeight}
          overlay={false}
          topShadow={false}
          shadowTip={false}
          // open={this.state.isTrayOpen}
          // onChange={this.trayChange}
          // swipeableViewsProps={{
          //   gettransform: num => this.getTransform(num),
          //   dragging: is => this.isDragging(is),
          //   animateTransitions: true,
          //   springConfig: { duration: '300ms', easeFunction: 'ease', delay: '0s' },
          // }}
        >
          <div className="no-stores-tray-container">
            {/* <SearchBar /> */}
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
