import React, { Component } from 'react';

import tDistance from '@turf/distance';
import { translate } from 'react-i18next';

import Map from '../../components/Map/Map';
import Tray from '../../components/Tray/Tray';
import InfoTray from '../../components/InfoTray/InfoTray';
import NoStoresTray from '../../components/NoStoresTray/NoStoresTray';
import './Home.css';

import dummyStores from '../../assets/data/stores.json';
import dummyPoi from '../../assets/data/poi.json';

import dummyCity from '../../assets/data/city.json';

// Entry point of the app
class Home extends Component {
  constructor(props) {
    super(props);

    // Prevent map going to user's location if the user is coming from city page
    const { path } = props.match;
    let goToUserLocation = false;

    if (path.startsWith('/store') || path.startsWith('/poi')) {
      goToUserLocation = false;
    }

    this.state = {
      city: 'NEW YORK',
      selectedStore: null,
      // bound: null,
      // TODO: should be fetched through API
      // stores change by distance and map bound
      stores: dummyStores,
      pois: dummyPoi,
      // cachedStores are the original data
      cachedStores: dummyStores,
      cachedPois: dummyPoi,
      isTrayOpen: false,
      isInfoTrayOpen: false,
      infoTrayHeight: 0,
      transformMap: 0,
      dragging: false,
      trayOverflowHeight: 230,
      goToUserLocation,
    };

    // Tray related
    this.selectStore = this.selectStore.bind(this);
    this.infoTrayStatusChange = this.infoTrayStatusChange.bind(this);
    this.infoTrayHeightChange = this.infoTrayHeightChange.bind(this);
    this.trayStatusChange = this.trayStatusChange.bind(this);

    // Map related
    this.updateUserLocation = this.updateUserLocation.bind(this);
    this.deselectStore = this.deselectStore.bind(this);
    // this.updateUserCityAndCountry = this.updateUserCityAndCountry.bind(this);

    this.getTransformMap = this.getTransformMap.bind(this);
    this.isDragging = this.isDragging.bind(this);
    this.goToLocation = this.goToLocation.bind(this);
  }

  componentDidMount() {
    // TODO: get store data from backend
    const { state } = this.props.location;
    // If params is needed, it's inside of match
    const { path } = this.props.match;
    if (state && (path.startsWith('/store') || path.startsWith('/poi'))) {
      const { selectedLocation } = state;
      // User comes from city page, go to this location
      this.goToLocation(selectedLocation);
    }
  }

  updateUserLocation(err, coord) {
    // Update the store data
    // TODO: Check user permission for location
    const { cachedPois, cachedStores } = this.state;
    let storeData = cachedStores;
    let poiData = cachedPois;

    if (err) {
      this.setState({
        stores: storeData,
        pois: poiData,
      });
      console.log('gps err:', err);
      return;
    }

    storeData = this.sortDataByDistanceToUser(coord, 'store');
    poiData = this.sortDataByDistanceToUser(coord, 'poi');

    if (!poiData) {
      this.setState({ trayOverflowHeight: 150 });
    }
    if (storeData.stores) {
      this.child.fitToBound(coord, [storeData.stores[0].long, storeData.stores[0].lat]);
    }

    this.setState({
      ...storeData,
      ...poiData,
    });
  }

  isWithinCity = (location) => {
    const cityUserIn = dummyCity.filter((city) => {
      const distToCityCenter = tDistance(location, [city.longitude, city.latitude], { unit: 'kilometers' });
      if (distToCityCenter < city.radius_km) {
        return true;
      }
      return false;
    });
    return cityUserIn[0];
  }

  getMapCenter = (center) => {
    const { cachedStores, cachedPois } = this.state;
    // Find the city where the center of the map is
    const city = this.isWithinCity([center.lng, center.lat]);
    // If mapcenter is within the city radius filter the stores and pois
    if (city) {
      // Use the city coordinates and radius to filter the stores and pois data
      const stores = this.filterByCityRadius(city, cachedStores);
      const pois = this.filterByCityRadius(city, cachedPois);

      this.setState({
        stores,
        pois,
        city: city.name,
      });
    } else {
      // Show default tray instead
      this.setState({
        city: '',
      });
    }
  }

  goToLocation(store) {
    this.selectStore(store, 'init');
    this.infoTrayHeightChange(210);
    this.trayStatusChange(false);
  }

  filterByCityRadius = (city, data) => {
    const clonedData = data.slice(0);
    const filtered = clonedData.filter((d) => {
      if (d.lat && d.long) {
        const distToCityCenter = tDistance([Number(city.longitude), Number(city.latitude)], [Number(d.long), Number(d.lat)], { unit: 'kilometers' });
        return distToCityCenter < city.radius_km;
      }
      return console.error('Data doesnt have lat and long', d);
    });
    return filtered;
  }

  sortDataByDistanceToUser(coord, dataType) {
    // update the store with distance relative to user
    const { stores, pois } = this.state;
    let datas = stores.slice(0);
    // TODO: use dataType to filter store/poi data
    if (dataType === 'poi') {
      datas = pois.slice(0);
    }

    const roundedCoord = [
      Math.round(coord[0] * 1000000) / 1000000,
      Math.round(coord[1] * 1000000) / 1000000,
    ];

    const sortedData = datas.map((data) => {
      // Units can be degrees, radians, miles, or kilometers
      const distance = tDistance(roundedCoord, [Number(data.long), Number(data.lat)], { units: 'kilometers' });
      // Average walking speed is 4.5 km/h
      const walkTime = distance / 4.5;
      data.distance = distance;
      data.walkTime = walkTime;
      return data;
    }).sort((a, b) => a.distance - b.distance);

    if (dataType === 'poi') {
      return {
        pois: sortedData,
      };
    }

    return {
      stores: sortedData,
    };
  }
  
  selectStore(store, mapStatus) {
    this.setState({ selectedStore: store });
    if (mapStatus === 'init') {
      // setTimeout to wait for map initialize
      setTimeout(() => {
        this.child.zoomToStore([store.long, store.lat], false);
        this.child.enlargeMarker(store);
      }, 200);
      return;
    }
    this.child.zoomToStore([store.long, store.lat], true);
    this.child.enlargeMarker(store);
  }

  deselectStore() {
    this.trayStatusChange(false);
    this.infoTrayStatusChange(false);
    if (this.state.selectedStore) {
      this.child.shrinkMarker();
    }
  }

  trayStatusChange(open) {
    this.setState({ isTrayOpen: open });
  }

  infoTrayHeightChange(height) {
    this.setState({ infoTrayHeight: height });
    if (height === 0) {
      this.child.zoomOut();
      this.child.shrinkMarker();
      this.setState({
        selectedStore: null,
      });
    }
    if (height > 0) {
      this.setState({ trayOverflowHeight: 0 });
      return;
    }
    this.setState({ trayOverflowHeight: 230 });
  }


  infoTrayStatusChange(open) {
    this.setState({ isInfoTrayOpen: open });
  }

  getTransformMap(num) {
    if (this.state.transformMap !== num) {
      this.setState({ transformMap: num });
    }
  }

  isDragging(is) {
    this.setState({ dragging: is });
  }

  render() {
    const {
      stores, pois, cachedStores, cachedPois, goToUserLocation,
    } = this.state;
    // i18n, t are for translation
    // const { i18n, t } = this.props;

    return (
      <div className="container">
        <Map
          onRef={ref => (this.child = ref)}
          stores={cachedStores}
          pois={cachedPois}
          selectedStore={this.state.selectedStore}
          selectStore={this.selectStore}
          deselectStore={this.deselectStore}
          onBoundChange={this.onBoundChange}
          updateUserLocation={this.updateUserLocation}
          infoTrayStatusChange={this.infoTrayStatusChange}
          infoTrayHeightChange={this.infoTrayHeightChange}
          trayStatusChange={this.trayStatusChange}
          transformMap={this.state.transformMap}
          dragging={this.state.dragging}
          trayOverflowHeight={this.state.trayOverflowHeight}
          infoTrayHeight={this.state.infoTrayHeight}
          goToUserLocation={goToUserLocation}
          getMapCenter={this.getMapCenter}
        />
        {this.state.city ?
          <Tray
            stores={stores}
            pois={pois}
            selectedStore={this.state.selectedStore}
            selectStore={this.selectStore}
            infoTrayStatusChange={this.infoTrayStatusChange}
            infoTrayHeightChange={this.infoTrayHeightChange}
            trayStatusChange={this.trayStatusChange}
            isTrayOpen={this.state.isTrayOpen}
            getTransformMap={this.getTransformMap}
            isDragging={this.isDragging}
            trayOverflowHeight={this.state.trayOverflowHeight}
            city={this.state.city}
          />
          :
          <NoStoresTray />
        }
        <InfoTray
          stores={stores}
          pois={pois}
          selectedStore={this.state.selectedStore}
          selectStore={this.selectStore}
          isInfoTrayOpen={this.state.isInfoTrayOpen}
          infoTrayHeight={this.state.infoTrayHeight}
          infoTrayStatusChange={this.infoTrayStatusChange}
          infoTrayHeightChange={this.infoTrayHeightChange}
          trayStatusChange={this.trayStatusChange}
          getTransformMap={this.getTransformMap}
          isDragging={this.isDragging}
        />
      </div>
    );
  }
}

export default translate()(Home);
