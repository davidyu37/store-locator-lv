import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import './City.css';

import Carousel from '../../components/Carousel/Carousel';

import dummyStores from '../../assets//data/stores.json';
import dummyPois from '../../assets//data/poi.json';
import NYPIC from '../../assets/images/cities/new-york.jpg';
import WINWOOD from '../../assets/images/wynwood.png';
import EATPIN from '../../assets/images/pins/pin-icon-restaurant.svg';
import MUSICPIN from '../../assets/images/pins/pin-icon-music.svg';
import SIGHTPIN from '../../assets/images/pins/pin-icon-sights.svg';
import SHOPPIN from '../../assets/images/pins/pin-icon-shopping.svg';


const cityData = {
  LONDON: 'LONDON',
  NEWYORK: 'NEW YORK',
  PARIS: 'PARIS',
  SHANGHAI: 'SHANGHAI',
  DUBAI: 'DUBAI',
  MIAMI: 'MIAMI',
};

const pinData = {
  music: {
    img: MUSICPIN,
    color: '#5fc3ae',
  },
  restaurant: {
    img: EATPIN,
    color: '#e13ca5',
  },
  sight: {
    img: SIGHTPIN,
    color: '#e6090f',
  },
  shop: {
    img: SHOPPIN,
    color: '#3cb6e1',
  },
};

// The city page
class City extends Component {
  constructor(props) {
    super(props);
    // const { cityname } = this.props.match.params;

    this.state = {
      stores: dummyStores,
      pois: dummyPois,
    };
  }

  renderPoi = (poi, index) => {
    return (
      <Link
        key={index}
        to={{
          pathname: `/poi/${poi.id}`,
          state: { selectedLocation: poi },
        }}
        className="city-experience-container">
        <div className="experience-image-container">
          <img className="experience-logo" alt="Experience Logo" src={WINWOOD} />
          <div className="experience-icon-container" style={{ backgroundColor: pinData[poi.marker].color }}>
            <img className="experience-type-icon" alt="Experience Category" src={pinData[poi.marker].img} />
          </div>
        </div>
        <div className="experience-text-container">
          <div className="experience-title">WYNWOOD KITCHEN & BAR</div>
          <div className="experience-type">{poi.marker}</div>
          <div className="experience-desc">Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</div>
        </div>
      </Link>
    );
  }

  render() {
    // i18n, t are for translation
    // const { i18n, t } = this.props;
    const { stores, pois } = this.state;
    const { cityname } = this.props.match.params;
    // Wrote background inline style to swap background image with javascript
    return (
      <div className="city-container">
        <div className="city-ios-scroll-fix">
          <header>
            <div
              className="city-header-image"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${NYPIC})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <p>EXPERIENCE</p>
              <h2>{cityData[cityname]}</h2>
            </div>
            <div className="city-copy">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et aliquet magna. Vivamus eu ornare massa. Sed ultricies sem non quam dignissim rutrum. Cras pulvinar semper metus ac imperdiet. Proin sed ipsum vel nisl dapibus lobortis.
              </p>
            </div>
          </header>
          <h1 className="city-content-title">MARC JACOBS IN {cityData[cityname]}</h1>
          <Carousel stores={stores} {...this.props} />
          <p className="city-content-title">EXPERIENCE IN {cityData[cityname]}</p>
          {pois.map((poi, i) => this.renderPoi(poi, i))}
        </div>
      </div>
    );
  }
}

export default translate()(City);
