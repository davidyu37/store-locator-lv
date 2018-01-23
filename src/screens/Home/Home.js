import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import Tray from '../../components/Tray/Tray';
import InfoTray from '../../components/InfoTray/InfoTray';
import './Home.css';

import tDistance from '@turf/distance';

import dummyStores from '../../assets//data/stores.json';
import dummyPoi from '../../assets//data/poi.json';
import { translate } from 'react-i18next';

//Entry point of the app
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            selectedStore: null,
            bound: null,
            // TODO: should be fetched through API
            // stores change by distance and map bound
            stores: dummyStores.concat(dummyPoi),
            // cachedStores are the original data
            cachedStores: dummyStores.concat(dummyPoi),
            isTrayOpen: false,
            isInfoTrayOpen: false,
            infoTrayHeight: 0,
            userLocation: null,
            transformMap: 0,
            dragging: false,
        }

        //Tray related
        this.selectStore = this.selectStore.bind(this);
        this.infoTrayStatusChange = this.infoTrayStatusChange.bind(this);
        this.infoTrayHeightChange = this.infoTrayHeightChange.bind(this);
        this.trayStatusChange = this.trayStatusChange.bind(this);

        //Map related
        this.onBoundChange = this.onBoundChange.bind(this);
        this.updateUserLocation = this.updateUserLocation.bind(this);

        this.getTransformMap = this.getTransformMap.bind(this);
        this.isDragging = this.isDragging.bind(this);
    }

    componentDidMount() {
        // TODO: get store data from backend
    }

    updateUserLocation(coord) {
        this.setState({
            userLocation: coord
        });
        // Update the store data
        this.updateStoreData(coord);
    }

    updateStoreData(coord) {
        // update the store with distance relative to user
        const { cachedStores, bound } = this.state;
        const roundedCoord = [
            Math.round(coord[0] * 1000000 ) / 1000000,
            Math.round(coord[1] * 1000000) / 1000000
        ];

        const sortedStore = cachedStores.map((store) => {
            // Units can be degrees, radians, miles, or kilometers
            const distance = tDistance(roundedCoord, [Number(store.long), Number(store.lat)], { 'units': 'kilometers'} );
            store.distance = distance;
            return store;
        }).sort((a, b) => a.distance - b.distance);

        if(bound) {
            const filteredStores = this.filterStore(bound, sortedStore);

            this.setState({
                stores: filteredStores,
                cachedStores: sortedStore
            });
        } else {
            this.setState({
                stores: sortedStore,
                cachedStores: sortedStore
            });
        }


    }

    onBoundChange(bound) {
        const { cachedStores } = this.state;
        const stores = this.filterStore(bound, cachedStores);
        // console.log(cachedStores);
        this.setState({
            bound,
            stores
        });
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
        if(filteredStores.length === 0) {
            return stores;
        }

        // To avoid carousel looking lonely with a few stores, fill in store that closest to user
        if(filteredStores.length < 4) {
            const fillInNum = 4 - filteredStores.length;

            const fillStores = notWithinBound.slice(0, fillInNum);

            const modifiedStores = filteredStores.concat(fillStores);
           
            return modifiedStores;
        }

        return filteredStores;
    }

    selectStore(store) {
        this.setState({ selectedStore: store });
        this.child.zoomToStore([store.long, store.lat]);
    }

    trayStatusChange(open) {
      this.setState({ isTrayOpen: open });
    }

    infoTrayStatusChange(open) {
      console.log('info tray', open);
      this.setState({ isInfoTrayOpen: open });
    }

    infoTrayHeightChange(height) {
      this.setState({ infoTrayHeight: height });
      if (height === 0) {
        this.child.zoomOut();
      }
    }

    getTransformMap(num) {
      if (this.state.transformMap !== num) {
        this.setState({ transformMap: num });
      }
      // console.log(num);
    }

    isDragging(is) {
      this.setState({ dragging: is });
      console.log(is);
    }

    render() {
        const { stores } = this.state;

        //i18n, t are for translation
        // const { i18n, t } = this.props;
        
        return (
        <div className="container">
            <Map
            onRef={ref => (this.child = ref)}
            stores={stores}
            selectedStore={this.state.selectedStore}
            selectStore={this.selectStore}
            onBoundChange={this.onBoundChange}
            updateUserLocation={this.updateUserLocation}
            infoTrayStatusChange={this.infoTrayStatusChange}
            infoTrayHeightChange={this.infoTrayHeightChange}
            trayStatusChange={this.trayStatusChange}
            transformMap={this.state.transformMap}
            dragging={this.state.dragging}
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
