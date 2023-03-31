import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from '../services/location.service';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { map } from 'rxjs/operators';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  routePoints: L.LatLng[] = [];
  animatedCircleIcon = {
    icon: L.divIcon({
      className: 'gps_marker_icon',
      html: '<div class="gps_marker"></div>',
      iconSize: [18, 22],
    }),
  };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    const fixedLocation = L.latLng(42.42776393283172, -71.07075907661864);
    this.initMap(fixedLocation);

    this.getPosition().subscribe(
      (position) => {
        if (this.map && this.marker) {
          this.marker.setLatLng([position.latitude, position.longitude]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  boundary: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          -71.1058313,
          42.4138324,
          0 - 71.0366555,
          42.4141492,
          0 - 71.0365697,
          42.4405666,
          0 - 71.1066037,
          42.4405033,
          0 - 71.1058313,
          42.4138324,
          0,
        ],
      ],
    },
  };

  downtownMalden: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0678645, 42.4322655, 0.0],
          [-71.0696241, 42.4321071, 0.0],
          [-71.0713836, 42.4320755, 0.0],
          [-71.0730278, 42.432067, 0.0],
          [-71.0750234, 42.4320354, 0.0],
          [-71.0741436, 42.4288203, 0.0],
          [-71.0740148, 42.4283135, 0.0],
          [-71.0743662, 42.4273716, 0.0],
          [-71.0763189, 42.4271973, 0.0],
          [-71.0766971, 42.4241478, 0.0],
          [-71.0767051, 42.4233167, 0.0],
          [-71.0748168, 42.4232217, 0.0],
          [-71.0735723, 42.4232059, 0.0],
          [-71.072148, 42.4234351, 0.0],
          [-71.0699379, 42.4235776, 0.0],
          [-71.0677143, 42.4240295, 0.0],
          [-71.0672852, 42.4232534, 0.0],
          [-71.0645386, 42.4244572, 0.0],
          [-71.0665476, 42.4270622, 0.0],
          [-71.0668937, 42.4273673, 0.0],
          [-71.0672342, 42.4293113, 0.0],
          [-71.0676285, 42.4310777, 0.0],
          [-71.0678645, 42.4322655, 0.0],
        ],
      ],
    },
  };

  jacksonGarage: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0721521, 42.4263297, 0.0],
          [-71.0721199, 42.4256031, 0.0],
          [-71.0716478, 42.425607, 0.0],
          [-71.0716827, 42.4263475, 0.0],
          [-71.0721521, 42.4263297, 0.0],
        ],
      ],
    },
  };

  cbdGarage: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0695906, 42.4261456, 0.0],
          [-71.0696254, 42.4255001, 0.0],
          [-71.0688127, 42.4254645, 0.0],
          [-71.0687591, 42.4261079, 0.0],
          [-71.0695906, 42.4261456, 0.0],
        ],
      ],
    },
  };

  pleasantLot: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0698873, 42.4275204, 0.0],
          [-71.0697947, 42.4271353, 0.0],
          [-71.0694192, 42.4270749, 0.0],
          [-71.0695372, 42.4276055, 0.0],
          [-71.069902, 42.4275639, 0.0],
          [-71.0698873, 42.4275204, 0.0],
        ],
      ],
    },
  };

  mountainGarage: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0739822, 42.4294625, 0.0],
          [-71.0732848, 42.4295912, 0.0],
          [-71.0733438, 42.4297417, 0.0],
          [-71.0740305, 42.4296189, 0.0],
          [-71.0739822, 42.4294625, 0.0],
        ],
      ],
    },
  };

  charlesLot: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-71.0764981, 42.4238279, 0.0],
          [-71.076537, 42.4234755, 0.0],
          [-71.0759348, 42.4234349, 0.0],
          [-71.0759161, 42.4234953, 0.0],
          [-71.0758557, 42.4235636, 0.0],
          [-71.0757752, 42.4237814, 0.0],
          [-71.0764981, 42.4238279, 0.0],
        ],
      ],
    },
  };

  mbtaIcon = L.icon({
    iconUrl: '/assets/mbta.png',
    iconSize: [24, 24],
  });

  parkingIcon = L.icon({
    iconUrl: '/assets/px.png',
    iconSize: [12, 12],
  });

  siteIcon = L.icon({
    iconUrl: '/assets/pin.png',
    iconSize: [18, 18],
  });

  mbtaLocation = L.latLng(42.426805472046574, -71.0743360438534);
  parkingLocation = L.latLng(42.425975443978984, -71.0718938849104);
  parkingLocation2 = L.latLng(42.42582169320731, -71.06920539120226);
  parkingLocation3 = L.latLng(42.42736925795241, -71.06963010050883);
  siteLocation = L.latLng(42.42441381692272, -71.07474704629118);
  siteLocation2 = L.latLng(42.42692761673888, -71.0696227170959);
  siteLocation3 = L.latLng(42.42669003531347, -71.06854446906613);
  siteLocation4 = L.latLng(42.42681684393761, -71.0689951863814);
  siteLocation5 = L.latLng(42.430009097442955, -71.07384847748972);
   
  initMap(fixedLocation: L.LatLng) {
    this.map = L.map('map').setView(fixedLocation, 16);
    L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      {
        minZoom: 14,
        maxNativeZoom: 20,
        maxZoom: 20,
        crossOrigin: true,
      }
    ).addTo(this.map);
    L.geoJSON(this.downtownMalden).addTo(this.map);
    L.geoJSON(this.jacksonGarage).addTo(this.map);
    L.geoJSON(this.cbdGarage).addTo(this.map);
    L.geoJSON(this.pleasantLot).addTo(this.map);
    L.geoJSON(this.mountainGarage).addTo(this.map);
    L.geoJSON(this.charlesLot).addTo(this.map);
    const mbtaMarker = L.marker(this.mbtaLocation, { icon: this.mbtaIcon }).addTo(this.map);
    const parkingMarker = L.marker(this.parkingLocation, { icon: this.parkingIcon }).addTo(this.map);
    const parkingMarker2 = L.marker(this.parkingLocation2, { icon: this.parkingIcon }).addTo(this.map);
    const parkingMarker3 = L.marker(this.parkingLocation3, { icon: this.parkingIcon }).addTo(this.map);
    
    const popupMessage = "<b>Idle Hands Craft Ales</b><br><a href='https://www.idlehandscraftales.com/'>idlehandscraftales.com</a> ";
    const siteMarker = L.marker(this.siteLocation, { icon: this.siteIcon }).addTo(this.map);
    siteMarker.bindPopup(popupMessage).openPopup();

    const popupMessage2 = "<b>Boda Borg</b><br><a href='https://www.bodaborg.com/'>bodaborg.com</a> ";
    const siteMarker2 = L.marker(this.siteLocation2, { icon: this.siteIcon }).addTo(this.map);
    siteMarker2.bindPopup(popupMessage2).openPopup();

    const popupMessage3 = "<b>Faces Brewing</b><br><a href='https://www.facesbrewing.com/'>facesbrewing.com</a> ";
    const siteMarker3 = L.marker(this.siteLocation3, { icon: this.siteIcon }).addTo(this.map);
    siteMarker3.bindPopup(popupMessage3).openPopup();

    const popupMessage4 = "<b>All Seasons Table</b><br><a href='https://www.astrestaurant.com/'>astrestaurant.com</a> ";
    const siteMarker4 = L.marker(this.siteLocation4, { icon: this.siteIcon }).addTo(this.map);
    siteMarker4.bindPopup(popupMessage4).openPopup();

    const popupMessage5 = "<b>Malden Center for Arts & Culture</b><br><a href='https://www.cityofmalden.org/'>www.cityofmalden.org</a> ";
    const siteMarker5 = L.marker(this.siteLocation5, { icon: this.siteIcon }).addTo(this.map);
    siteMarker5.bindPopup(popupMessage5).openPopup();

    this.marker = L.marker([0, 0], this.animatedCircleIcon).addTo(this.map);

    this.getPosition().subscribe(
      (position) => {
        const latLng = L.latLng(position.latitude, position.longitude);
        const isInsideBoundary = booleanPointInPolygon(
          turf.point([position.longitude, position.latitude]),
          this.boundary
        );
        if (this.map && this.marker) {
          if (isInsideBoundary) {
            this.marker.setLatLng(latLng);
            this.map.setView(latLng, 16);
          } else {
            this.marker.setLatLng([0, 0]);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getPosition(): Observable<{ latitude: number; longitude: number }> {
    return new Observable<{ latitude: number; longitude: number }>(
      (observer) => {
        if (navigator.geolocation) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              this.locationService.setPosition({ latitude, longitude });
              if (this.map && this.marker) {
                this.marker.setLatLng([latitude, longitude]);
              }
              observer.next({ latitude, longitude });
            },
            (error) => {
              observer.error(error);
            }
          );
        } else {
          observer.error('Geolocation is not supported by this browser.');
        }
      }
    );
  }
}
