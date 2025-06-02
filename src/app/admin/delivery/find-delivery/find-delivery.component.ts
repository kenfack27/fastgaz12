import { Location } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-delivery',
  templateUrl: './find-delivery.component.html',
  styleUrls: ['./find-delivery.component.css']
})
export class FindDeliveryComponent {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  map: google.maps.Map;
  service: google.maps.places.PlacesService;
  center: google.maps.LatLngLiteral = {
    lat: 3.817470,
    lng: 11.478039
  };
  zoom = 8;
  display: google.maps.LatLngLiteral;
  currentUserPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  private userLocation: { lat: number; lng: number };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  listOfDeliveryMarkerPosition: google.maps.LatLngLiteral[] = [
    {
      lat: 3.4193590138322456,
      lng: 12.100301778962992
    },
    {
      lat: 3.831712482769784,
      lng: 11.471099853515625
    },
    {
      lat: 3.814541726203261,
      lng: 11.475756168365479
    },
    {
      lat: 3.8356518596669797,
      lng: 11.466379165649414
    }
  ];

  listMarkerPositions: google.maps.LatLngLiteral[] = [];
  @Output() newItemEvent = new EventEmitter<google.maps.MapMouseEvent>();
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerPosition: google.maps.LatLngLiteral;


  constructor(
    private router: Router,
    private location:Location
  ) {
    this.getUserLocation();
  }

  ngOnInit(): void {
  }


  onGoBack() {
    this.location.back();
  }
  goForward() {
    this.location.forward(); // Navigate forward to the next URL
  }

  //
  onGoToDelivery(event: google.maps.MapMouseEvent): void {
    let lat = event.latLng.toJSON().lat;  
    let lng = event.latLng.toJSON().lng;
    this.router.navigate(["/admin/delivery/", lat, lng]);
  }

  moveMap(event: google.maps.MapMouseEvent) {
    // this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
   
    console.log(this.markerPosition)
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }


  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.currentUserPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // this.center = { lat: this.userLocation.lat, lng: this.userLocation.lng };
        // this.initMap();
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }


  public initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    this.calculateAndDisplayRoute(directionsService, directionsRenderer);
  }

  public calculateAndDisplayRoute(directionsService: google.maps.DirectionsService,directionsRenderer: google.maps.DirectionsRenderer) {

    let markerPosition: google.maps.LatLngLiteral = {
      lat: 0,
      lng: 0
    };
    
    let listMarkerPositionsResult: google.maps.LatLngLiteral[] = [];
    // Create an array to store the directions results
    let directionsResults = [];
    // Loop through the destinations and get the directions
    for (let i = 0; i < this.listOfDeliveryMarkerPosition.length; i++) {

      let directionsRequest = {
        origin: this.currentUserPosition,
        destination: this.listOfDeliveryMarkerPosition[i],
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService
        .route(directionsRequest)
        .then((response) => {
          directionsResults.push(response);
          let custormDirectionsRenderer: google.maps.DirectionsResult;
          // Check if we have processed all destinations
          if (directionsResults.length === this.listOfDeliveryMarkerPosition.length) {
            // All directions have been retrieved, find the shortest distance
            let shortestDistance = Number.MAX_SAFE_INTEGER;
            let shortestDestination;
            for (let i = 0; i < directionsResults.length; i++) {
              let distance = directionsResults[i].routes[0].legs[0].distance.value;
              if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestDestination = this.listOfDeliveryMarkerPosition[i];
                custormDirectionsRenderer = directionsResults[i];
                directionsRenderer.setDirections(directionsResults[i]);
              }
            }

            console.log('Shortest distance is to', shortestDestination, 'at', shortestDistance, 'meters');
            markerPosition = {
              lat: this.listOfDeliveryMarkerPosition[i].lat,
              lng: this.listOfDeliveryMarkerPosition[i].lng
            };
            listMarkerPositionsResult.push(markerPosition);
            this.listMarkerPositions = listMarkerPositionsResult;
          }
          // this.listMarkerPositions.push(this.userLocation);
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
    }
  }

}

