import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
declare var google: any;

@Component({
  selector: 'app-current-location',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './current-location.component.html',
  styleUrls: ['./current-location.component.scss']
})
export class CurrentLocationComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral = this.center;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  address: string = '';
  @ViewChild('searchBox') searchInput!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @Output() locationChange = new EventEmitter<{
    latitude: number;
    longitude: number;
    location: string;
  }>();
  @Input() location: { latitude: number; longitude: number; location: string } = { latitude: 0, longitude: 0, location: '' };
  ngOnInit(): void {
    this.getCurrentLocation();
  }
  constructor(private ngZone: NgZone) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && changes['location'].currentValue) {
      
      this.updateLocationFromInput();
    }
  }
  updateLocationFromInput(): void {
    if (this.location) {
      debugger
      this.center = { lat: this.location.latitude, lng: this.location.longitude };
      this.markerPosition = this.center;
      this.address = this.location.location;
      this.zoom = 15;

      if (this.map?.googleMap) {
        this.map.googleMap.panTo(this.center);
      }
    }
  }

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
          console.warn('Geolocation not available or denied:', error);
          // Use default static location if live location is unavailable
          this.getAddress(this.center.lat, this.center.lng);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.getAddress(this.center.lat, this.center.lng);
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent | any): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  getAddress(lat: number, lng: number): void {
    // 
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results:any, status:any) => {
      if (status === 'OK' && results[0]) {
        this.address = results[0].formatted_address;
      } else {
        console.error('Geocoder failed due to:', status);
        this.address = 'No address found';
      }
      // Emit the location and address to the parent component
      this.emitLocation(lat, lng, this.address);
    });
  }

  emitLocation(latitude: number, longitude: number, location: string): void {
    this.locationChange.emit({ latitude, longitude, location });
  }
  ngAfterViewInit(): void {
    this.initializeAutocomplete();
  }

  // Initialize the autocomplete functionality
  initializeAutocomplete() {
    // 
    if (google && google.maps ) {
      // 
      const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement);

      if (this.map?.googleMap) {
        autocomplete.bindTo('bounds', this.map.googleMap);
        this.map.googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchInput.nativeElement);
      }

      // Listen for when the user selects a place from the autocomplete dropdown
      autocomplete.addListener('place_changed', () => {
        // 
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // Check if the selected place has geometry and location data
          if (!place.geometry || !place.geometry.location) return;

          // Update the center based on the place's coordinates
          this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          // Set the zoom level for the map
          this.zoom = 15;

          // Move the marker to the new location
          this.markerPosition = { lat: this.center.lat, lng: this.center.lng };

          // Update the marker options
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
}
