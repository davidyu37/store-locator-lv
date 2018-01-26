import React, { Component } from 'react';

import TouchCarousel from 'react-touch-carousel';
import cx from 'classnames';

import { Link } from 'react-router-dom';

import './Cities.css';
import ny from '../../../assets/images/cities/ny.jpg';
import dubai from '../../../assets/images/cities/dubai.png';
import shanghai from '../../../assets/images/cities/shanghai.png';
import miami from '../../../assets/images/cities/miami.png';
import paris from '../../../assets/images/cities/paris.png';
import london from '../../../assets/images/cities/london.png';


const citiesItems = [
  {
    name: 'LONDON',
    image: london,
  },
  {
    name: 'PARIS',
    image: paris,
  },
  {
    name: 'NEW YORK',
    image: ny,
  },
  {
    name: 'SHANGHAI',
    image: shanghai,
  },
  {
    name: 'DUBAI',
    image: dubai,
  },
  {
    name: 'MIAMI',
    image: miami,
  },
];

const cardSize = 115;


export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: citiesItems,
      // selectedStore: this.props.selectedStore,
    };
    this.carouselContainer = this.carouselContainer.bind(this);
    this.renderCard = this.renderCard.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   // if (nextProps.stores !== this.state.stores) {
  //   //   this.setState({ stores: nextProps.stores });
  //   // }
  //   // if (nextProps.selectedStore !== this.state.selectedStore) {
  //   //   this.setState({ selectedStore: nextProps.selectedStore });
  //   // }
  // }

  carouselContainer(props) {
    const { cursor, carouselState: { active, dragging }, ...rest } = props;

    const translateX = cursor * cardSize;

    let current = -Math.round(cursor) % this.state.stores.length;
    while (current < 0) {
      current += this.state.stores.length;
    }
    return (
      <div
        className={cx(
          'cities-carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging,
          },
        )}
      >
        <div
          className="cities-carousel-track"
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </div>
    );
  }

  renderCard(index, modIndex) {
    const item = this.state.stores[modIndex];
    return (
      <Link to={`/city/${item.name}`} key={index} className="cities-carousel-card">
        <div
          className="cities-carousel-card-inner"
        >
          <div className="cities-carousel-image-container">
            <img className="cities-carousel-image" src={item.image} alt="" />
          </div>
          <div className="cities-carousel-title">{item.name}</div>
        </div>
      </Link>
    );
  }


  render() {
    return (
      <div className="cities-container">
        <div className="cities-header">DISCOVER CITIES</div>
        <TouchCarousel
          component={this.carouselContainer}
          cardCount={this.state.stores.length}
          cardSize={90}
          renderCard={this.renderCard}
          loop={false}
        />
      </div>
    );
  }
}
