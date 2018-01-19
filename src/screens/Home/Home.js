import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import Tray from '../../components/Tray/Tray';
import InfoTray from '../../components/InfoTray/InfoTray';
import './Home.css';

import dummyData from '../../stores.json';
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
            stores: dummyData,
            isTrayOpen: false,
            isInfoTrayOpen: false,
            infoTrayHeight: 0,
        }
        this.selectStore = this.selectStore.bind(this);
        this.onBoundChange = this.onBoundChange.bind(this);
        console.log('User Language', props.i18n.language);
        this.infoTrayStatusChange = this.infoTrayStatusChange.bind(this);
        this.infoTrayHeightChange = this.infoTrayHeightChange.bind(this);
        this.trayStatusChange = this.trayStatusChange.bind(this);
    }

    onBoundChange(bound) {
        this.setState({
            bound,
        });
    }

    selectStore(store) {
        this.setState({ selectedStore: store });
        this.child.zoomToStore([store.long, store.lat]);
    }

    trayStatusChange(open) {
      console.log('close tray', open);
      this.setState({ isTrayOpen: open });

    }

    infoTrayStatusChange(open) {
      console.log(open);
      this.setState({ isInfoTrayOpen: open });
    }

    infoTrayHeightChange(height) {
      console.log('got the change', height);
      this.setState({ infoTrayHeight: height });
    }

    render() {
        const { bound, stores } = this.state;
        //i18n, t are for translation
        const { i18n, t } = this.props;

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
            infoTrayStatusChange={this.infoTrayStatusChange}
            infoTrayHeightChange={this.infoTrayHeightChange}
            trayStatusChange={this.trayStatusChange}
            isTrayOpen={this.state.isTrayOpen}
            />
            <InfoTray
            stores={filteredStores}
            selectedStore={this.state.selectedStore}
            selectStore={this.selectStore}
            isInfoTrayOpen={this.state.isInfoTrayOpen}
            infoTrayHeight={this.state.infoTrayHeight}
            infoTrayStatusChange={this.infoTrayStatusChange}
            infoTrayHeightChange={this.infoTrayHeightChange}
            trayStatusChange={this.trayStatusChange}
            />
        </div>
        );
    }
}

export default translate()(Home);
