import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../shared/services/authentication/Auth.service';

@Component({
  selector: 'app-side-product-details',
  standalone: true,
  templateUrl: './side-product-details.component.html',
  styleUrl: './side-product-details.component.scss',
  imports: [
    NgIf,
    FormsModule,
    GoogleMapsModule,
    CommonModule,
    SharedModule,
    RouterModule,
  ],
})
export class SideProductDetailsComponent {
  loading =false
  center!: google.maps.LatLngLiteral;
  zoom = 4;
  @Input() featuredProducts: any[] = [];
  @Input() attributesObject: any;
  @Input() allowedToMakeOffer: any;
  @Input() makeOfferFn!: () => void;       // Function to make offer
  @Input() openChatFn!: () => void;   // Function to remove product
  @Input() openModalFn!: () => void;
  @Input() addWishLstFn!: (item:any) => void;
  @Input() removeWishLstFn!: (item:any) => void;

  makeOfferF(item:any){
    this.makeOfferFn()
  }

  openChatF(){
    this.openChatFn()
  }

  openModalF(){
    this.openModalF()
  }

  addWishLstF(item:any){
    this.addWishLstFn(item)
  }

  removeWishLstF(item:any){
    this.removeWishLstFn(item)
  }

  ngOnInit() {
    this.getCurrentLocation();
    this.loadMap();
  }

  getCurrentLocation() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.loading = false;
      });
    } else {
      // Browser doesn't support Geolocation
      console.error("Browser doesn't support geolocation.");
    }
  }

  loadMap(): void {
    this.loading = true;
    const mapProperties = {
      center: new google.maps.LatLng(35.6895, 139.6917),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    // Ensure the map div exists before initializing the map
    const mapDiv = document.getElementById('map-div');
    if (mapDiv) {
      const map = new google.maps.Map(mapDiv as HTMLElement, mapProperties);
      this.loading = false;
    }
  }
}
