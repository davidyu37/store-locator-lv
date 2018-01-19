import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import Tray from '../../components/Tray/Tray';
import './Home.css';

import dummyData from '../../stores.json';

//Entry point of the app
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            selectedStore: null,
            bound: null,
            // TODO: should be fetched through API
            stores: dummyData
        }
        this.selectStore = this.selectStore.bind(this);
        this.onBoundChange = this.onBoundChange.bind(this);
    }

    onBoundChange(bound) {
        this.setState({
            bound
        });
    }

    selectStore(store) {
        this.setState({ selectedStore: store });
        this.child.zoomToStore([store.long, store.lat]);
    }

    render() {
        const { bound, stores } = this.state;

        let filteredStores = stores;

        if(bound) {
            // If there's bound filter the store
            const { _sw, _ne } = bound;
            filteredStores = stores.filter((s) => {
                const storeLongitude = parseFloat(s.long);
                const storeLatitude = parseFloat(s.lat);

                if(storeLongitude >= _sw.lng && storeLongitude <= _ne.lng) {
                    if(storeLatitude >= _sw.lat && storeLatitude <= _ne.lat) {
                        return true;
                    }
                }
                return false;
            });
        }
        

        return (
        <div className="container">
            <Map
            onRef={ref => (this.child = ref)}
            stores={filteredStores}
            selectedStore={this.state.selectedStore}
            selectStore={this.selectStore}
            onBoundChange={this.onBoundChange}/>
            <Tray
            stores={filteredStores}
            selectedStore={this.state.selectedStore}
            selectStore={this.selectStore}
            />
        </div>
        );
    }
}

export default Home;
