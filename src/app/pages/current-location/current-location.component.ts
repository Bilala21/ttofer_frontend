import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';

@Component({
  selector: 'app-current-location',
  standalone: true,
  imports: [NgIf],
  templateUrl: './current-location.component.html',
  styleUrl: './current-location.component.scss'
})
export class CurrentLocationComponent implements OnInit {
  latitude: number | undefined;
  longitude: number | undefined;
  error: string | undefined;
  @Output() locationFound = new EventEmitter<string>();
  locationName: string = "";
  constructor(private locationService: MainServicesService) {}

  ngOnInit(): void {

    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      
      const position = await this.getLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const geocodeResult = await this.locationService.getGeocodedLocation(lat, lng);
      if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
        const locationId = geocodeResult.results[0].formatted_address;
        this.locationFound.emit(locationId);
      }
    } catch (error) {
      console.error(error);
    }
  }

  getLocation(): Promise<GeolocationPosition> {

    return new Promise((resolve, reject) => {

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation not supported by this browser.'));
      }
    });
  }
  // ngOnInit() {
  //   this.getCurrentLocation();
  // }

  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         this.latitude = position.coords.latitude;
  //         this.longitude = position.coords.longitude;
  //       },
  //       (err) => {
  //         this.error = 'Geolocation is not supported by this browser or permission denied.';
  //         console.error(err);
  //       }
  //     );
  //   } else {
  //     this.error = 'Geolocation is not supported by this browser.';
  //   }
  // }
}
