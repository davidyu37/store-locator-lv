import React, { Component } from 'react';

import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';


import './Tray.css';

import TabHandle from './TabHandle/TabHandle';
// import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';
import Nearby from '../Carousel/Nearby/Nearby';
import Cities from '../Carousel/Cities/Cities';
import ExperienceButton from './ExperienceButton/ExperienceButton';


export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTrayOpen: this.props.isTrayOpen,
      selectedStore: this.props.selectedStore,
      stores: this.props.stores,
      trayOverflowHeight: this.props.trayOverflowHeight,
    };
    this.trayChange = this.trayChange.bind(this);
    this.toggleTray = this.toggleTray.bind(this);

    this.dragging = false;
    this.transform = 0;

    this.transition = {
      transition: '300ms',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTrayOpen !== this.state.isTrayOpen) {
      this.setState({ isTrayOpen: nextProps.isTrayOpen });
      if (this.state.isTrayOpen) {
        this.transition = {
          transition: '0ms',
        };
        setTimeout(() => {
          this.transition = {
            transition: '300ms',
          };
        }, 300);
      }
    }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
    if (nextProps.trayOverflowHeight !== this.state.trayOverflowHeight) {
      this.setState({ trayOverflowHeight: nextProps.trayOverflowHeight });
    }
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


  trayChange(e) {
    this.props.trayStatusChange(e);
  }

  toggleTray() {
    this.props.trayStatusChange(!this.state.isTrayOpen);
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
            gettransform: num => this.getTransform(num),
            dragging: is => this.isDragging(is),
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
            {this.state.trayOverflowHeight === 210 ?
              <ExperienceButton
                city={this.props.city}
              />
              : null
            }
            <Nearby
              pois={this.props.pois}
              selectStore={this.props.selectStore}
              infoTrayStatusChange={this.props.infoTrayStatusChange}
              infoTrayHeightChange={this.props.infoTrayHeightChange}
              trayStatusChange={this.props.trayStatusChange}
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
