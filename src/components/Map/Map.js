import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './Map.css';
import MJPIN from '../../images/pins/Pin-MJ.png';

// Properties exposed outside of this component
/*
    stores
    onBoundChange
    selectedStore
    selectStore
*/

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {
                longitude: -73.9995625,
                latitude: 40.725389
            },
            zoom: 15,
            markers: []
        }
        this.initializeMap = this.initializeMap.bind(this);
        this.getUserCoordinates = this.getUserCoordinates.bind(this);
        this.clearMarkers = this.clearMarkers.bind(this);
    }

    componentDidMount() {
        // This allow parent component with access to methods within this component
        this.props.onRef(this);

        this.getUserCoordinates();
        
        this.initializeMap();

    }

    componentWillUnmount() {
        // This removes the binding between parent component if this component unmounts
        this.props.onRef(undefined);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.stores !== this.props.stores) {
            const { markers } = this.state;
            if(markers[0]) {
                this.clearMarkers(markers);
            }
            // Whenever there are new store data, this update the markers
            this.renderMultipleMarkers(nextProps.stores)
        }
    }

    clearMarkers(markers) {
        markers.forEach((marker) => {
            marker.remove();
        });
        
        this.setState({
            markers: []
        });
    }

    initializeMap() {
        const { center } = this.state;
        // Initialize mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWR5dTM3IiwiYSI6ImNqY2ZzMHBhZjJnZnEycWxsOThjd3UwMDcifQ.Ige72JF8lv9Sm2BfxH2KzA';

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/davidyu37/cjchb25zf74i72rqyryiiq1hf',
            zoom: 15,
            center: [center.longitude, center.latitude]
        });

        this.geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        });
        this.map.addControl(this.geolocate, 'bottom-left');

        this.updateBound();

        // Listen to zoom events
        //Event types: zoomstart, zoom, zoomend
        this.map.on('zoomend', (e) => {
            this.updateBound();
        });
        //Event types: dragstart, drag, dargend
        this.map.on('dragend', (e) => {
            this.updateBound();
        });
    }

    getUserCoordinates() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            this.props.updateUserLocation([longitude, latitude]);
        }, (err) => {
            return console.error('Get user location error:', err);
        },
        {
            enableHighAccuracy: true
        });
    }

    updateBound() {
        const bound = this.map.getBounds();
        // Bound is object containing northeast and southwest coordinates
        this.props.onBoundChange(bound);
        // TODO: should trigger fetchDataByBound here, if needed
        // this.props.fetchDataByBound(bound);
    }

    renderMultipleMarkers(stores) {
        const markers = [];
        stores.forEach((store) => {
            const { lat, long } = store;
            // TODO: should render different marker image based on marker type
            const marker = this.drawMarker(MJPIN, [long, lat], store);
            markers.push(marker);
        });

        this.setState({
            markers
        });
    }

    drawMarker(image, coord, store) {
        
        const el = document.createElement('img');
        const self = this;
        el.className = 'marker';
        el.src = image;
        el.style.width = '50px';
        el.style.height = '62px';
        el.addEventListener('click', function () {
            self.onMarkerClick(store, coord);
        });

        const marker = new mapboxgl.Marker(el)
            .setLngLat(coord)
            .addTo(this.map);

        return marker;
    }

    onMarkerClick(store, coord) {
        this.props.selectStore(store);
        this.props.infoTrayStatusChange(true);
        this.props.infoTrayHeightChange(210);
        this.props.trayStatusChange(false);
    }

    zoomToStore(coord) {
        this.map.flyTo({ center: coord, zoom: 18 });
    }

    zoomOut() {
        this.map.setZoom(15);
    }

    getUserLocation() {
        // Get user's location programtically
        this.geolocate._onClickGeolocate.bind(this.geolocate);
        this.getUserCoordinates();
    }

    render() {

        return (
            <div
                ref={el => this.mapContainer = el}
                className="map-view"
            >
            </div>
        );
    }
}

export default Map;