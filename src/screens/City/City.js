import React, { Component } from 'react';
import { translate } from 'react-i18next';

import './City.css';

import Carousel from '../../components/Carousel/Carousel';

import dummyStores from '../../assets//data/stores.json';
// import dummyPoi from '../../assets//data/poi.json';
import NYPIC from '../../assets/images/cities/new-york.jpg';
import WINWOOD from '../../assets/images/wynwood.png';
import EATPIN from '../../assets/images/pins/pin-icon-restaurant.svg';


// The city page
class City extends Component {
  constructor(props) {
    super(props);
    // const { cityname } = this.props.match.params;

    this.state = {
      stores: dummyStores,
    };
  }

  render() {
    // i18n, t are for translation
    // const { i18n, t } = this.props;
    const { stores } = this.state;
    // Wrote background inline style to swap background image with javascript
    return (
      <div className="container">
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
            <h2>NEW YORK</h2>
          </div>
          <div className="city-copy">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et aliquet magna. Vivamus eu ornare massa. Sed ultricies sem non quam dignissim rutrum. Cras pulvinar semper metus ac imperdiet. Proin sed ipsum vel nisl dapibus lobortis.
            </p>
          </div>
        </header>
        <h1 className="city-content-title">MARC JACOBS IN NEW YORK</h1>
        <Carousel stores={stores} {...this.props} />
        <p className="city-content-title">EXPERIENCE IN NEW YORK</p>
        <div className="city-experience-container">
          <div className="experience-image-container">
            <img className="experience-logo" alt="Experience Logo" src={WINWOOD} />
            <div className="experience-icon-container">
              <img className="experience-type-icon" alt="Experience Category" src={EATPIN} />
            </div>
          </div>
          <div className="experience-text-container">
            <div className="experience-title">WYNWOOD KITCHEN & BAR</div>
            <div className="experience-type">Restaurant & Bars</div>
            <div className="experience-desc">Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</div>
          </div>
        </div>
        <div className="city-experience-container">
          <div className="experience-image-container">
            <img className="experience-logo" alt="Experience Logo" src={WINWOOD} />
            <div className="experience-icon-container">
              <img className="experience-type-icon" alt="Experience Category" src={EATPIN} />
            </div>
          </div>
          <div className="experience-text-container">
            <div className="experience-title">WYNWOOD KITCHEN & BAR</div>
            <div className="experience-type">Restaurant & Bars</div>
            <div className="experience-desc">Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(City);
