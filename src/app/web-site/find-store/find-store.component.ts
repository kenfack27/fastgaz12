import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BottomSheetOverviewComponent } from '../bottom-sheet-overview/bottom-sheet-overview.component';
import { NotificationService } from 'src/app/service/notification.service';
import { LoadingService } from 'src/app/service/loading.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-find-store',
  templateUrl: './find-store.component.html',
  styleUrls: ['./find-store.component.css']
})
export class FindStoreComponent implements OnInit {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  map: google.maps.Map;
  service: google.maps.places.PlacesService;
  center: google.maps.LatLngLiteral = {
    lat: 3.817470,
    lng: 11.478039
  };
  zoom = 12;
  display: google.maps.LatLngLiteral;

  /**Set current position.
  * Current position mean where user is current located.
  * Yes because we will alwas ask to user to confirm he current position.
 */
  currentUserPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  private userLocation: { lat: number; lng: number };
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  /**
  * List of store.
  * The list hold a Store Object.
  * Each object has properties like: latitude and logitude.
  * We will loop on list and find wish store is near the current user.
  */
  storeList: google.maps.LatLngLiteral[] = [
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
    },
    {
      lat: 3.8225062595372084,
      lng: 11.472043991088867
    }
  ];
  
  // List of marker positions.
  markerPositions: google.maps.LatLngLiteral[] = [];
  @Output() newItemEvent = new EventEmitter<google.maps.MapMouseEvent>();
  errorState: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private notifier: NotificationService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getUserLocation();
  }

  onGoBack(): void {
    this.location.back();
  }

  onFindStore(): void {
    this.router.navigate(["/service/stores"])
  }

  
  onGoToStore(event: google.maps.MapMouseEvent): void {
    const matBottomConfig = new MatBottomSheetConfig();
    matBottomConfig.data = event;
    const bottomSheetRef = this._bottomSheet.open(BottomSheetOverviewComponent,matBottomConfig).afterDismissed().subscribe(() => { });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    // this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }


  /**Use JavaScript navaigator object to retrive current position.*/
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
        console.log(" lan :" + this.center.lat + "lon :" + this.center.lng)
        this.initMap(); //Init Map and process to calculation of distance of each store.

      },
      (error) => {
        console.error('Error getting user location:', error);
        this.notifier.onWarning('Error getting user location: ' + error);
      }
    );
  }


  public initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    this.calculateAndDisplayRoute(directionsService, directionsRenderer);
  }

  public calculateAndDisplayRoute
    (
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
    ) {

    let markerPosition: google.maps.LatLngLiteral = {
      lat: 0,
      lng: 0
    };
    let markerPositionsResult: google.maps.LatLngLiteral[] = [];
    // Create an array to store the directions results
    let directionsResults = [];
    // Loop through the destinations and get the directions
    this.loadingService.loadingOn();
    for (let i = 0; i < this.storeList.length; i++) {
      let directionsRequest = {
        origin: this.currentUserPosition,
        destination: this.storeList[i],
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService
        .route(directionsRequest)
        .then((response) => {
          directionsResults.push(response);
          let custormDirectionsRenderer: google.maps.DirectionsResult;
          // Check if we have processed all destinations
          if (directionsResults.length === this.storeList.length) {
            // All directions have been retrieved, find the shortest distance
            let shortestDistance = Number.MAX_SAFE_INTEGER;
            let shortestDestination;
            for (let i = 0; i < directionsResults.length; i++) {
              let distance = directionsResults[i].routes[0].legs[0].distance.value;
              if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestDestination = this.storeList[i];
                custormDirectionsRenderer = directionsResults[i];
                directionsRenderer.setDirections(directionsResults[i]);
              }
            }

            console.log('Shortest distance is to', shortestDestination, 'at', shortestDistance, 'meters');
            markerPosition = {
              lat: this.storeList[i].lat,
              lng: this.storeList[i].lng
            };
            this.loadingService.loadingOff();
            markerPositionsResult.push(markerPosition);

            this.center = {
              lat: markerPosition.lat,
              lng: markerPosition.lng
            }
            this.markerPositions = markerPositionsResult;
            this.notifier.onDefault("One store found near you");

          }
          // Pusch user position on Map.
          this.markerPositions.push(this.userLocation); //Not need.
        })
        .catch((e) => {
          this.errorState = true;
          this.loadingService.loadingOff();
          this.notifier.onWarning("Directions request failed due to" + status);
          window.alert("Directions request failed due to " + status)
        });
    }
  }

}
