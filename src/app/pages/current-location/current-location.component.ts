import { Component, ElementRef, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

declare var google: any;

@Component({
  selector: 'app-current-location',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './current-location.component.html',
  styleUrls: ['./current-location.component.scss']
})
export class CurrentLocationComponent implements OnInit, AfterViewInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default location (San Francisco)
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral = this.center;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  address: string = '';

  @ViewChild('searchBox') searchInput!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  ngAfterViewInit(): void {
    this.initializeAutocomplete();
  }

  initializeAutocomplete() {
    if (google && google.maps && google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement);

      if (this.map?.googleMap) {
        autocomplete.bindTo('bounds', this.map.googleMap);
        this.map.googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchInput.nativeElement);
      }

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) return;

         this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          this.zoom = 15;

          this.markerPosition = { lat: this.center.lat, lng: this.center.lng };

          this.markerOptions = {
            ...this.markerOptions,
            position: this.markerPosition
          };

          // Re-center the map to the new position
          if (this.map.googleMap) {
            this.map.googleMap.panTo(this.center);
          }

          // Get the address for the new location
          this.getAddress(this.center.lat, this.center.lng);
        });
      });
    } else {
      console.error('Google Maps Places library is not loaded.');
    }
  }

  // Function to get the user's current location
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markerPosition = this.center;
          this.getAddress(this.center.lat, this.center.lng);
        },
        (error) => {
          console.error('Error getting location', error);
          this.address = 'Location access denied or unavailable';
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.address = 'Geolocation is not supported by this browser';
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
    }
  }
  getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results:any, status:any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.address = results[0].formatted_address;
      } else {
        console.error('Geocoder failed due to:', status);
        this.address = 'No address found';
      }
    });
  }
}
