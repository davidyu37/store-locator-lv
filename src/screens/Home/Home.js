import React, { Component } from 'react';

import tDistance from '@turf/distance';
import { translate } from 'react-i18next';

import Map from '../../components/Map/Map';
import Tray from '../../components/Tray/Tray';
import InfoTray from '../../components/InfoTray/InfoTray';
import './Home.css';

import dummyStores from '../../assets//data/stores.json';
import dummyPoi from '../../assets//data/poi.json';

// Entry point of the app
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            selectedStore: null,
            bound: null,
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
            userLocation: null,
            transformMap: 0,
            dragging: false,
            trayOverflowHeight: 150,
        }

        //Tray related
        this.selectStore = this.selectStore.bind(this);
        this.infoTrayStatusChange = this.infoTrayStatusChange.bind(this);
        this.infoTrayHeightChange = this.infoTrayHeightChange.bind(this);
        this.trayStatusChange = this.trayStatusChange.bind(this);

        //Map related
        this.onBoundChange = this.onBoundChange.bind(this);
        this.updateUserLocation = this.updateUserLocation.bind(this);
        this.deselectStore = this.deselectStore.bind(this);

        this.getTransformMap = this.getTransformMap.bind(this);
        this.isDragging = this.isDragging.bind(this);
        this.goToLocation = this.goToLocation.bind(this);
    }

    componentDidMount() {
        // TODO: get store data from backend
        const { state } = this.props.location;
        // If params is needed, it's inside of match
        const { path } = this.props.match;
        if(state && path.startsWith('/store')) {
            const { selectedLocation } = state;
            // User comes from city page, go to this location
            this.goToLocation(selectedLocation);
        }

    }

    updateUserLocation(coord) {
        this.setState({
            userLocation: coord
        });
        // Update the store data
        // TODO: Check user permission for location
        // const storeData = this.updateStoreData(coord, 'store');
        
        // this.setState({
        //     ...storeData,
        // })
    }

    goToLocation(store) {
      this.selectStore(store, 'init');
      this.infoTrayStatusChange(true);
      this.infoTrayHeightChange(210);
      this.trayStatusChange(false);
    }

  updateStoreData(coord, dataType) {
    // update the store with distance relative to user
    const { cachedStores } = this.state;
    // TODO: use dataType to filter store/poi data

    const roundedCoord = [
      Math.round(coord[0] * 1000000) / 1000000,
      Math.round(coord[1] * 1000000) / 1000000
    ];

    const sortedStore = cachedStores.map((store) => {
      // Units can be degrees, radians, miles, or kilometers
      const distance = tDistance(roundedCoord, [Number(store.long), Number(store.lat)], { 'units': 'kilometers' });
      store.distance = distance;
      return store;
    }).sort((a, b) => a.distance - b.distance);

    // Not doing filtering
    // if (bound) {
    //   const filteredStores = this.filterStore(bound, sortedStore);
    //   return {
    //     stores: filteredStores,
    //     cachedStores: sortedStore
    //   }
    // } else {
      return {
        stores: sortedStore,
        cachedStores: sortedStore
      }
    // }
  }

  onBoundChange(bound) {
    // If Bound logic is needed in the future, write it here
    // const { cachedStores } = this.state;
    // const stores = this.filterStore(bound, cachedStores);
    // this.setState({
    //     bound,
    //     stores
    // });
  }

  filterStore(bound, stores) {
    let filteredStores = [];
    let notWithinBound = [];
    if (bound) {
      // If there's bound filter the store
      const { _sw, _ne } = bound;
      filteredStores = stores.filter((s) => {
        const storeLongitude = parseFloat(s.long);
        const storeLatitude = parseFloat(s.lat);

        if (storeLongitude >= _sw.lng && storeLongitude <= _ne.lng) {
          if (storeLatitude >= _sw.lat && storeLatitude <= _ne.lat) {
            return true;
          }
        }
        notWithinBound.push(s);
        return false;
      });
    }

    // If there's no stores within map bound, return the sorted stores
    if (filteredStores.length === 0) {
      return stores;
    }

    // To avoid carousel looking lonely with a few stores, fill in store that closest to user
    if (filteredStores.length < 4) {
      const fillInNum = 4 - filteredStores.length;

      const fillStores = notWithinBound.slice(0, fillInNum);

      const modifiedStores = filteredStores.concat(fillStores);

      return modifiedStores;
    }

    return filteredStores;
  }

  selectStore(store, mapStatus) {
    this.setState({ selectedStore: store });
    if(mapStatus === 'init') {
        //setTimeout to wait for map initialize
        setTimeout(() => {
            this.child.zoomToStore([store.long, store.lat], false);
            this.child.enlargeMarker(store)
        }, 200);
        return;
    }
    this.child.zoomToStore([store.long, store.lat], true);
    this.child.enlargeMarker(store);
  }

  deselectStore() {
    this.trayStatusChange(false);
    this.infoTrayStatusChange(false);
    if(this.state.selectedStore) {
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
        selectedStore: null
      });
    }
    if (height > 0) {
      this.setState({ trayOverflowHeight: 0 })
      return;
    }
    this.setState({ trayOverflowHeight: 150 });
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
      const { stores, cachedStores, cachedPois } = this.state;
      //i18n, t are for translation
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
          />
          <Tray
              stores={stores}
              selectedStore={this.state.selectedStore}
              selectStore={this.selectStore}
              infoTrayStatusChange={this.infoTrayStatusChange}
              infoTrayHeightChange={this.infoTrayHeightChange}
              trayStatusChange={this.trayStatusChange}
              isTrayOpen={this.state.isTrayOpen}
              getTransformMap={this.getTransformMap}
              isDragging={this.isDragging}
              trayOverflowHeight={this.state.trayOverflowHeight}
          />
          <InfoTray
              stores={stores}
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
