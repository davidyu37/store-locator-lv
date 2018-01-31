import React, { Component } from 'react';

import TouchCarousel from 'react-touch-carousel';
import cx from 'classnames';


import './Nearby.css';
import winwood from '../../../assets/images/wynwood.png';


const nearbyItems = [
  {
    name: 'WYNWOOD KITCHEN & BAR',
    image: winwood,
  },
  {
    name: 'WYNWOOD KITCHEN & BAR',
    image: winwood,
  },
  {
    name: 'WYNWOOD KITCHEN & BAR',
    image: winwood,
  },
  {
    name: 'WYNWOOD KITCHEN & BAR',
    image: winwood,
  },
];

const cardSize = 220;


export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: nearbyItems,
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

    let current = -Math.round(cursor) % this.props.pois.length;
    while (current < 0) {
      current += this.props.pois.length;
    }
    return (
      <div
        className={cx(
          'nearby-carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging,
          },
        )}
      >
        <div
          className="nearby-carousel-track"
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </div>
    );
  }

  renderCard(index, modIndex) {
    const item = this.props.pois[modIndex];
    return (
      <div
        key={index}
        className="nearby-carousel-card"
        onClick={() => this.onStoreClick(item)}
      >
        <div
          className="nearby-carousel-card-inner"
        >
          <div className="nearby-carousel-image-container">
            <img className="nearby-carousel-image" src={item.photo} alt="" />
          </div>
          <div className="nearby-carousel-title">{item.name}</div>
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
      <div className="nearby-container">
        <div className="nearby-header">NEARBY EXPERIENCES</div>
        <TouchCarousel
          component={this.carouselContainer}
          cardCount={this.props.pois.length}
          cardSize={150}
          renderCard={this.renderCard}
          loop={false}
          moveScale={0.7}
          // maxOverflow={0.1}
          // clickTolerance={5}
        />
      </div>
    );
  }
}
