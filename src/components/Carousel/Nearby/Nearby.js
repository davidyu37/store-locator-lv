import React, { Component } from 'react';

import TouchCarousel, { clamp } from 'react-touch-carousel';
import cx from 'classnames';


import './Nearby.css';
import winwood from '../../../images/wynwood.png';


const nearbyItems = [
  {
    name: "WYNWOOD KITCHEN & BAR",
    image: winwood
  },
  {
    name: "WYNWOOD KITCHEN & BAR",
    image: winwood
  },
  {
    name: "WYNWOOD KITCHEN & BAR",
    image: winwood
  },
  {
    name: "WYNWOOD KITCHEN & BAR",
    image: winwood
  },
]

const cardSize = 220;
const cardPadCount = 1;
const carouselWidth = clamp(window.innerWidth, 0, 960);


export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: nearbyItems,
      selectedStore: this.props.selectedStore,
    }
    this.carouselContainer = this.carouselContainer.bind(this);
    this.renderCard = this.renderCard.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.stores !== this.state.stores) {
    //   this.setState({ stores: nextProps.stores });
    // }
    // if (nextProps.selectedStore !== this.state.selectedStore) {
    //   this.setState({ selectedStore: nextProps.selectedStore });
    // }
  }

  carouselContainer(props) {
    const { cursor, carouselState: { active, dragging }, ...rest } = props

    const translateX = cursor * cardSize

    let current = -Math.round(cursor) % this.state.stores.length
    while (current < 0) {
      current += this.state.stores.length
    }
    return (
      <div
        className={cx(
          'nearby-carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging
          }
        )}
      >
        <div
          className='nearby-carousel-track'
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </div>
    )
  };

  renderCard(index, modIndex) {
    const item = this.state.stores[modIndex]
    return (
      <div
        key={index}
        className='nearby-carousel-card'
        // onClick={() => this.props.selectStore(item)}
      >
        <div
          className='nearby-carousel-card-inner'
        >
          <div className="nearby-carousel-image-container">
            <img className="nearby-carousel-image" src={item.image} />
          </div>
          <div className='nearby-carousel-title'>{item.name}</div>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="nearby-container">
        <div className="nearby-header">NEARBY EXPERIENCES</div>
        <TouchCarousel
          component={this.carouselContainer}
          cardCount={this.state.stores.length}
          cardSize={150}
          renderCard={this.renderCard}
          loop={false}
        />
      </div>
    )
  }
}
