import React, { Component } from 'react';

import TouchCarousel, { clamp } from 'react-touch-carousel';
import cx from 'classnames';


import './Carousel.css';


const query = window.location.search.slice(1);
const enableLoop = /\bloop\b/.test(query);
const enableAutoplay = /\bautoplay\b/.test(query);

const cardSize = 130;
const cardPadCount = 1;
const carouselWidth = clamp(window.innerWidth, 0, 960);


export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores: this.props.stores,
      selectedStore: this.props.selectedStore,
      infoTrayHeightChange: this.props.infoTrayHeightChange,
    }
    this.carouselContainer = this.carouselContainer.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.onStoreClick = this.onStoreClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.stores !== this.state.stores) {
    //   this.setState({ stores: nextProps.stores });
    // }
    if (nextProps.selectedStore !== this.state.selectedStore) {
      this.setState({ selectedStore: nextProps.selectedStore });
    }
  }

  carouselContainer(props) {
    const { cursor, carouselState: { active, dragging }, ...rest } = props

    const translateX = cursor * cardSize

    let current = -Math.round(cursor) % this.props.stores.length
    while (current < 0) {
      current += this.props.stores.length
    }
    return (
      <div
        className={cx(
          'carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging
          }
        )}
      >
        <div
          className='carousel-track'
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </div>
    )
  };

  renderCard(index, modIndex) {
    const item = this.props.stores[modIndex]
    return (
      <div
        key={index}
        className='carousel-card'
        onClick={() => this.onStoreClick(item)}
      >
        <div
          className='carousel-card-inner'
        >
          <div className="carousel-image-container">
            <img className="carousel-image" src={item.image} />
          </div>
          <div className='carousel-title'>{item.name}</div>
        </div>
      </div>
    )
  }

  onStoreClick(item) {
    this.props.selectStore(item);
    this.props.infoTrayStatusChange(true);
    this.props.infoTrayHeightChange(210);
    this.props.trayStatusChange(false);
  }


  render() {
    return (
      <div>
        <TouchCarousel
          component={this.carouselContainer}
          cardCount={this.props.stores.length}
          cardSize={150}
          renderCard={this.renderCard}
          loop={false}
        />
      </div>
    )
  }
}
