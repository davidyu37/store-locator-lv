import React, { Component } from 'react';

import TouchCarousel from 'react-touch-carousel';
import cx from 'classnames';

import './Carousel.css';

const cardSize = 145;

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores: this.props.stores,
      selectedStore: this.props.selectedStore,
      // infoTrayHeightChange: this.props.infoTrayHeightChange,
    };
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
    const {
      cursor,
      carouselState: {
        active, dragging,
      },
      ...rest
    } = props;

    const translateX = cursor * cardSize;

    // // if (translateX )
    // if (-translateX < (this.props.stores.length - 2) * 145) {
    //   translateX;
    // }

    let current = -Math.round(cursor) % this.props.stores.length;
    while (current < 0) {
      current += this.props.stores.length;
    }
    return (
      <div
        className={cx(
          'carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging,
          },
        )}
      >
        <div
          className="carousel-track"
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </div>
    );
  }

  renderCard(index, modIndex) {
    const item = this.props.stores[modIndex];
    return (
      <div
        key={index}
        className="carousel-card"
        onClick={() => this.onStoreClick(item)}
      >
        <div
          className="carousel-card-inner"
        >
          <div className="carousel-image-container">
            <img className="carousel-image" src={item.image} alt="" />
          </div>
          <div className="carousel-title">{item.name}</div>
        </div>
      </div>
    );
  }

  onStoreClick(item) {
    if (this.props.selectStore) {
      this.props.selectStore(item);
      this.props.infoTrayStatusChange(false);
      this.props.infoTrayHeightChange(200);
      this.props.trayStatusChange(false);
      return;
    }
    // User coming from city page, direct them to map
    const { history } = this.props;
    history.push(`/store/${item.id}`, { selectedLocation: item });
  }


  render() {
    return (
      <div>
        <TouchCarousel
          component={this.carouselContainer}
          cardCount={this.props.stores.length}
          cardSize={150}
          renderCard={this.renderCard}
          // moveScale={3}
          maxOverflow={0.1}
          clickTolerance={5}
          loop={false}
        />
      </div>
    );
  }
}
