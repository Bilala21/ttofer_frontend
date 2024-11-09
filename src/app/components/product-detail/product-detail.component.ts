import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { ToastrService } from 'ngx-toastr';
import { GoogleMapsModule } from '@angular/google-maps';
import { MakeOfferModalComponent } from '../modals/make-offer-modal/make-offer-modal.component';
import { CardShimmerComponent } from '../card-shimmer/card-shimmer.component';
import { GalleriaModule } from 'primeng/galleria';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, GalleriaModule, SharedModule, NgIf, GoogleMapsModule, RouterLink, MakeOfferModalComponent, NgIf, CardShimmerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  constructor(private router: Router, private globalStateService: GlobalStateService, private toastr: ToastrService, private authService: AuthService,
    private route: ActivatedRoute, public extension: Extension,
    private mainServices: MainServicesService,
  ) {
    this.currentUserid = extension.getUserId();

  }

  @ViewChild(MakeOfferModalComponent) MakeOfferModalComponent!: MakeOfferModalComponent;
  center!: google.maps.LatLngLiteral;
  zoom = 4;
  productId: any = null
  product: any = {};
  wishList: any = []
  attributes: any = {}
  currentUser: any = {}
  loading: boolean = false
  imgIndex: number = 0
  currentUserid: any;
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ]
  images: any = [

  ];
  position: string = 'left';
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  ngOnInit(): void {
    this.getCurrentLocation();
    this.loadMap();
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true
    this.mainServices.getProductById({ product_id: this.productId }).subscribe({
      next: (value) => {
        console.log(value);
        this.product = value.data
        this.attributes = JSON.parse(value.data.attributes)
        this.loading = false
        console.log(JSON.parse(value.data.attributes), 'attributes');
      },
      error: (err) => {
        this.loading = false
      },
    })

  }


  toggleWishlist(item: any) {
    let input = {
      user_id: this.currentUserid,
      product_id: item.id
    };

    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success');

          if (this.wishList.includes(item.id)) {
            this.wishList = this.wishList.filter((itemId: any) => itemId !== item.id);
          } else {
            this.wishList = [...this.wishList, item.id];
          }
        }
      },
      error: (err) => {
        const error = err.error.message;
        this.toastr.error(error, 'Error');
      }
    });
  }

  getUserWishListItem(item: any) {
    const matched = item.user_wishlist.find((prod: any) => prod.user_id == this.currentUserid)
    return matched ? true : false
  }

  // toggleWishlist(item: any) {
  //   const storedData = localStorage.getItem('key');
  //   if (!storedData) {
  //     this.toastr.warning('Plz login first than try again !', 'Warning');

  //     this.authService.triggerOpenModal();
  //     return;
  //   }

  //   this.globalStateService.wishlistToggle(item.id);
  //   this.globalStateService.currentState.subscribe(state => {
  //     this.wishList = state.wishListItems
  //     this.currentUser = state.currentUser
  //   });
  //   let input = {
  //     user_id: this.currentUser.id,
  //     product_id: item.id
  //   }
  //   this.mainServices.addWishList(input).subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         this.toastr.success('Product added to wishlist successfully', 'Success');
  //       }
  //       console.log(res, "toggleWishlist");
  //     },
  //     error: (err) => {
  //       const error = err.error.message
  //       this.toastr.error(error, 'Error');
  //     },
  //   })
  // }


  buyProduct(product: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
  }
  addToCart(product: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
    else {
      this.globalStateService.updateCart(product)
    }
  }
  handleProductQty(event: any, product: any) {
    this.globalStateService.updateCart({ ...product, quantity: event.value })
  }
  contactSeller(product: any, user: any): void {
    // Store the data in sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(product));
    sessionStorage.setItem('userData', JSON.stringify(user));

    // Navigate to the chat route with userId as a parameter
    this.router.navigate([`/chatBox/${this.currentUserid}`], {
      state: { product, user },
    });
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
  showOfferModal(modal_type: string) {
    this.globalStateService.setOfferModal(modal_type)
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
