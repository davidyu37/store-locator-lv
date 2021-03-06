import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import './Map.css';
import MJPIN from '../../assets/images/pins/Pin-MJ.png';
import EATPIN from '../../assets/images/pins/Pin-Eats.png';
import MUSICPIN from '../../assets/images/pins/Pin-Music.png';
import SIGHTSPIN from '../../assets/images/pins/Pin-Sights.png';

import NavBtn from '../../assets/images/map-controls/icon-location.svg';

// TODO: Should pass access token through environment variable
const accessToken = 'pk.eyJ1IjoiZGF2aWR5dTM3IiwiYSI6ImNqY2ZzMHBhZjJnZnEycWxsOThjd3UwMDcifQ.Ige72JF8lv9Sm2BfxH2KzA';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        // longitude: -73.98872145388043,
        // latitude: 40.72663800497543,
        longitude: 121.4737,
        latitude: 31.2304,
      },
      zoom: 11.5,
      markers: [],
      selectedMarker: null,
    };
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

    if (this.props.stores[0]) {
      markers = this.props.stores.concat(this.props.pois);
    }

    this.renderMultipleMarkers(markers);
  }

  componentWillUnmount() {
    // This removes the binding between parent component if this component unmounts
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trayOverflowHeight !== this.props.trayOverflowHeight || nextProps.infoTrayHeight !== this.props.infoTrayHeight) {
      if (nextProps.trayOverflowHeight > nextProps.infoTrayHeight) {
        this.setNavBtnPosition(`${nextProps.trayOverflowHeight - 10}px`);
      }

      if (nextProps.infoTrayHeight > nextProps.trayOverflowHeight) {
        this.setNavBtnPosition(`${nextProps.infoTrayHeight - 10}px`);
      }
    }

    if (nextProps.transformMap) {
      // Whenever there are new store data, this update the markers
    }

    if (nextProps.isDragging !== this.props.isDragging) {
      // Whenever there are new store data, this update the markers
      // console.log(nextProps.isDragging);
    }
  }

  // Fetch user city with coordinate
  // fetchPlaceData = async (lng, lat) => {
  //   // await response of fetch call
  //   const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?type=country,region,district&access_token=${accessToken}`);
  //   // only proceed once promise is resolved
  //   const data = await response.json();
  //   // only proceed once second promise is resolved
  //   return data;
  // }

  // getCityAndCountry = (data) => {
  //   const { features } = data;
  //   const location = {};
  //   if (features[0]) {
  //     features.forEach((feature) => {
  //       if (feature.place_type && feature.place_type[0] === 'region') {
  //         location.city = feature.text;
  //       }
  //       if (feature.place_type && feature.place_type[0] === 'country') {
  //         location.country = feature.text;
  //       }
  //       if (feature.place_type && feature.place_type[0] === 'place') {
  //         location.city = feature.text;
  //       }
  //     });
  //   }
  //   this.props.updateUserCityAndCountry(location);
  // }

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
    mapboxgl.accessToken = accessToken;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/davidyu37/cjchb25zf74i72rqyryiiq1hf',
      zoom,
      center: [center.longitude, center.latitude],
    });

    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    this.map.addControl(this.geolocate, 'bottom-left');
    this.setNavBtnImage(this.geolocate._geolocateButton);

    if (this.props.goToUserLocation) {
      this.getLocationTimeout = setTimeout(this.geolocate._onClickGeolocate.bind(this.geolocate), 100);
    }

    this.map.on('load', () => {
      const mapCenter = this.map.getCenter();
      this.props.getMapCenter(mapCenter);
    });

    this.map.on('dragstart', () => {
      this.props.deselectStore();
    });

    this.map.on('moveend', () => {
      const mapCenter = this.map.getCenter();
      this.props.getMapCenter(mapCenter);
    });

    // Listen to zoom events
    // Event types: zoomstart, zoom, zoomend
    // this.map.on('zoomend', (e) => {
    // });

    // Event types: dragstart, drag, dargend, dragqueen. jk about the dragqueen
    // this.map.on('dragend', (e) => {
    // });


    // Use this to get coordinates on map
    // this.map.on('click', (e) => {
    //   const { lngLat } = e;
    //   console.log('Click on map', lngLat);
    // });
  }

  setNavBtnImage = (elem) => {
    if (elem) {
      elem.style.backgroundImage = `url('${NavBtn}')`;
    }
  }

  setNavBtnPosition = (px) => {
    const btnElems = document.getElementsByClassName('mapboxgl-ctrl-bottom-left');
    if (btnElems[0]) {
      btnElems[0].style.bottom = px;
    }
  }

  getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.props.updateUserLocation(null, [longitude, latitude]);
        // this.fetchPlaceData(longitude, latitude)
        //   .then(data => this.getCityAndCountry(data))
        //   .catch(reason => console.log(reason.message));
      }, err => this.props.updateUserLocation(err, []),
      {
        enableHighAccuracy: true,
      },
    );
  }

  fitToBound(point1, point2) {
    if (point1 && point2) {
      const bounds = new mapboxgl.LngLatBounds();
      const roundPt1Lng = Math.floor(point1[0] * 1000000) / 1000000;
      const roundPt1Lat = Math.floor(point1[1] * 1000000) / 1000000;
      const roundPt2Lng = Math.floor(point2[0] * 1000000) / 1000000;
      const roundPt2Lat = Math.floor(point2[1] * 1000000) / 1000000;

      let standardSWNEbound = false;

      if (roundPt1Lat > roundPt2Lat && roundPt1Lng > roundPt2Lng) {
        bounds.extend([
          [
            roundPt2Lng,
            roundPt2Lat,
          ],
          [
            roundPt1Lng,
            roundPt1Lat,
          ],
        ]);
        standardSWNEbound = true;
      } else if (roundPt2Lat > roundPt1Lat && roundPt2Lng > roundPt1Lng) {
        bounds.extend([
          [
            roundPt1Lng,
            roundPt1Lat,
          ],
          [
            roundPt2Lng,
            roundPt2Lat,
          ],
        ]);
        standardSWNEbound = true;
      }

      if (standardSWNEbound) {
        this.map.fitBounds(bounds, { offset: [0, -150] });
      } else {
        this.map.setCenter([roundPt2Lng, roundPt2Lat]);
      }
    }
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
      markers,
    });
  }

  getImage = (category) => {
    // store, restaurant, music, sight, mall
    switch (category) {
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
        return MJPIN;
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
    container.id = store.id ? store.id : store.store_id;
    container.style.transition = 'width 300ms, height 300ms';

    shadow.className = 'shadow';

    markerImage.src = image;

    markerImage.style.width = '36px';
    markerImage.style.height = '45px';
    markerImage.style.transition = 'width 300ms, height 300ms';
    shadow.style.display = 'none';


    container.appendChild(markerImage);
    container.appendChild(shadow);


    markerImage.addEventListener('click', () => {
      self.onMarkerClick(store, coord);
    });

    const marker = new mapboxgl.Marker(container, {
      offset: [0, -offset],
    })
      .setLngLat(coord)
      .addTo(this.map);

    return marker;
  }

  onMarkerClick(store, coord) {
    if (this.state.selectedMarker) {
      this.shrinkMarker();
    }

    this.props.selectStore(store);
    this.props.infoTrayStatusChange(false);
    this.props.infoTrayHeightChange(210);
    this.props.trayStatusChange(false);


    this.enlargeMarker(store);
  }

  enlargeMarker(store) {
    const { markers } = this.state;

    let selectedMarker;

    markers.forEach((m) => {
      const { _element, _offset } = m;
      const id = store.id ? store.id : store.store_id;
      // To make we compare string to string
      if (`${_element.id}` === `${id}`) {
        // console.log('marker', _element);
        // _offset make the it centers on the bottom of the pin
        _offset.y = -(65 / 2);
        // _element is the container of the marker
        _element.style.width = '52px';
        _element.style.height = '65px';
        // children[0] is the image itself
        _element.children[0].style.width = '52px';
        _element.children[0].style.height = '65px';
        // children[1] is the shadow
        _element.children[1].style.display = 'block';
        selectedMarker = m;
      }
    });

    this.setState({
      selectedMarker,
    });
  }

  shrinkMarker() {
    const { selectedMarker } = this.state;
    if (selectedMarker) {
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
    if (animation) {
      this.map.flyTo({ center: coord, zoom: 15, offset: [0, -110] });
      return;
    }
    this.map.setCenter(coord);
    this.map.panBy([0, 9], { animate: false });
    this.map.setZoom(15);
  }

  zoomOut() {
    this.map.flyTo({ zoom: 11.5 });
    // this.map.setZoom({ zoom: 15 });
  }

  render() {
    let mapStyle = {
      transform: `translate3d(0px, -${this.props.transformMap}px, 0px)`,
      transition: '300ms',
      height: 'calc(100vh)',
    };
    if (this.props.dragging) {
      mapStyle = {
        transform: `translate3d(0px, -${this.props.transformMap}px, 0px)`,
        transition: '0ms',
        height: 'calc(100vh)',
      };
    }

    return (
      <div
        ref={el => this.mapContainer = el}
        className="map-view"
        style={mapStyle}
      />
    );
  }
}

export default Map;
