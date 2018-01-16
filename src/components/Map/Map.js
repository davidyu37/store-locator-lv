import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {},
            zoom: 15
        }
        this.setUserLocation = this.setUserLocation.bind(this);
    }

    componentDidMount() {
        const { GeolocateControl } = mapboxgl;
        
        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords;

            if (longitude !== 0 && latitude !== 0) {
                this.setUserLocation(longitude, latitude);
            }
        }, (err) => {
            if(err) return console.error(err);
        }, {
            enableHighAccuracy: true,
            timeout: 3000,
            distanceFilter: 5
        });

        mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWR5dTM3IiwiYSI6ImNqY2ZzMHBhZjJnZnEycWxsOThjd3UwMDcifQ.Ige72JF8lv9Sm2BfxH2KzA';
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 15
        });

        // const geolocate = new GeolocateControl({
        //     positionOptions: {
        //         enableHighAccuracy: true
        //     },
        //     trackUserLocation: true
        // });
        // this.map.addControl(geolocate);
    }

    setUserLocation(longitude, latitude) {
        this.map.setCenter([longitude, latitude]);
        const marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(this.map);
        
        this.setState({
            center: {
                latitude,
                longitude
            },
            marker
        });
    }


    render() {
        const { center, zoom } = this.state;

        return (
            <div ref={el => this.mapContainer = el} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
        );
    }
}

export default Map;
