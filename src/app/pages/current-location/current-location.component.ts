import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-current-location',
  standalone: true,
  imports: [NgIf,GoogleMapsModule],
  templateUrl: './current-location.component.html',
  styleUrl: './current-location.component.scss'
})
export class CurrentLocationComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral = this.center;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  address: string = '';

  ngOnInit(): void {}

  // Function to handle marker drag end event
  onMarkerDragEnd(event: any) :any{
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  // Function to get address from latitude and longitude
  getAddress(lat: number, lng: number) {
    debugger
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results:any, status) => {
      if (status === 'OK' && results[0]) {
        this.address = results[0].formatted_address;
      } else {
        console.error('Geocoder failed due to:', status);
        this.address = 'No address found';
      }
    });
  }
}