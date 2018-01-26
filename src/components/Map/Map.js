import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './Map.css';
import MJPIN from '../../assets/images/pins/Pin-MJ.png';
import EATPIN from '../../assets/images/pins/Pin-Eats.png';
import MUSICPIN from '../../assets/images/pins/Pin-Music.png';
import SIGHTSPIN from '../../assets/images/pins/Pin-Sights.png';


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
                longitude: -74.01530431379776,
                latitude: 40.70888200021085
            },
            zoom: 11.5,
            markers: [],
            selectedMarker: null
        }
        this.initializeMap = this.initializeMap.bind(this);
        this.getUserCoordinates = this.getUserCoordinates.bind(this);
        // this.clearMarkers = this.clearMarkers.bind(this);
        this.shrinkMarker = this.shrinkMarker.bind(this);
        this.enlargeMarker = this.enlargeMarker.bind(this);
    }

    componentDidMount() {
        // This allow parent component with access to methods within this component
        this.props.onRef(this);

        this.getUserCoordinates();
        
        this.initializeMap();
        
        let markers = [];
        
        if(this.props.stores[0]) {
            markers = this.props.stores.concat(this.props.pois);
        }

        this.renderMultipleMarkers(markers);
    }

    componentWillUnmount() {
        // This removes the binding between parent component if this component unmounts
        this.props.onRef(undefined);
    }

    componentWillReceiveProps(nextProps) {
        // if(nextProps.stores !== this.props.stores) {
        //     const { markers } = this.state;
        //     if(markers[0]) {
        //         this.clearMarkers(markers);
        //     }
        //     // Whenever there are new store data, this update the markers
        //     this.renderMultipleMarkers(nextProps.stores)
        // }

        if (nextProps.transformMap) {
            // Whenever there are new store data, this update the markers
        }
        
        if (nextProps.isDragging !== this.props.isDragging) {
            // Whenever there are new store data, this update the markers
            console.log(nextProps.isDragging);
        }
    }

    // clearMarkers(markers) {
    //     markers.forEach((marker) => {
    //         marker.remove();
    //     });
        
    //     this.setState({
    //         markers: []
    //     });
    // }

    initializeMap() {
        const { center, zoom } = this.state;
        // Initialize mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWR5dTM3IiwiYSI6ImNqY2ZzMHBhZjJnZnEycWxsOThjd3UwMDcifQ.Ige72JF8lv9Sm2BfxH2KzA';

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/davidyu37/cjchb25zf74i72rqyryiiq1hf',
            zoom: zoom,
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

        //Event types: dragstart, drag, dargend, dragqueen. jk about the dragqueen
        this.map.on('dragend', (e) => {
            this.updateBound();
        });

        this.map.on('dragstart', (e) => {
            this.props.deselectStore();
        });

        // Use this to get coordinates on map
        // this.map.on('click', (e) => {
        //     const { lngLat } = e;
        //     console.log('Click on map', lngLat);
        // })
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
            const { lat, long, marker } = store;
            const markerImage = this.getImage(marker);
            const newMarker = this.drawMarker(markerImage, [long, lat], store);
            markers.push(newMarker);
        });

        this.setState({
            markers
        });
    }

    getImage(category) {
        // store, restaurant, music, sight, mall

        switch(category) {
            case 'store':
                return MJPIN;
            case 'restaurant':
                return EATPIN;
            case 'sight':
                return SIGHTSPIN;
            case 'music':
                return MUSICPIN;
            // case 'mall':
            //     return ;
            //     break;
            default:
            console.log('no image found');
            break;
        }
    }

    drawMarker(image, coord, store) {
        // const { selectedStore } = this.props;

        const container = document.createElement('div');
        const markerImage = document.createElement('img');
        const shadow = document.createElement('div');

        const self = this;
        const offset = 45 / 2;

        container.className = 'marker';
        container.id = store.id;
        container.style.transition = 'width 300ms, height 300ms';

        shadow.className = 'shadow';

        markerImage.src = image;
        
        markerImage.style.width = '36px';
        markerImage.style.height = '45px';
        markerImage.style.transition = 'width 300ms, height 300ms';
        shadow.style.display = 'none';
        

        container.appendChild(markerImage);
        container.appendChild(shadow);

        
        markerImage.addEventListener('click', function () {
            self.onMarkerClick(store, coord);
        });

        const marker = new mapboxgl.Marker(container, {
            offset: [ 0, -offset]
        })
            .setLngLat(coord)
            .addTo(this.map);

        return marker;
    }

    onMarkerClick(store, coord) {
        if(this.state.selectedMarker) {
            this.shrinkMarker();
        }
        
        this.props.selectStore(store);
        this.props.infoTrayStatusChange(true);
        this.props.infoTrayHeightChange(210);
        this.props.trayStatusChange(false);


        this.enlargeMarker(store);
    }

    enlargeMarker(store) {
        const { markers } = this.state;
        
        let selectedMarker;

        markers.forEach((m) => {
            const { _element, _offset } = m;
            if (_element.id === store.id) {
                // _offset make the it centers on the bottom of the pin
                _offset.y = -(65 / 2);
                //_element is the container of the marker
                _element.style.width = '52px';
                _element.style.height = '65px';
                // children[0] is the image itself
                _element.children[0].style.width = '52px';
                _element.children[0].style.height = '65px';
                // children[1] is the shadow
                _element.children[1].style.display = 'block';
                selectedMarker = m;
                return;
            }
        });

        this.setState({
            selectedMarker
        });
    }

    shrinkMarker() {
        const { selectedMarker } = this.state;
        if(selectedMarker) {
            const { _element, _offset } = selectedMarker;

            _offset.y = -(45 / 2);

            _element.style.width = '36px';
            _element.style.height = '45px';

            _element.children[0].style.width = '36px';
            _element.children[0].style.height = '45px';
            _element.children[1].style.display = 'none';
        }
    }

    zoomToStore(coord, animation) {
        if(animation) {
            this.map.flyTo({ center: coord, zoom: 15, offset: [0, -110] });
            return
        }
        this.map.setCenter(coord)
        this.map.panBy([0, 9], { animate: false });
        this.map.setZoom(15);
    }

    zoomOut() {
        this.map.flyTo({zoom: 11.5});
        // this.map.setZoom({ zoom: 15 });
    }

    getUserLocation() {
        this.shrinkMarker();
        // Get user's location programtically
        this.geolocate._onClickGeolocate.bind(this.geolocate);
        this.getUserCoordinates();
    }

    render() {
        let mapStyle = {
          transform: `translate3d(0px, -${this.props.transformMap}px, 0px)`,
          transition: '300ms',
          height: `calc(100vh)`
        }
        if (this.props.dragging) {
          mapStyle = {
            transform: `translate3d(0px, -${this.props.transformMap}px, 0px)`,
            transition: '0ms',
            height: `calc(100vh)`
          }
        }

        return (
            <div
                ref={el => this.mapContainer = el}
                className="map-view"
                
                style={mapStyle}
            >
            </div>
        );
    }
}

export default Map;
