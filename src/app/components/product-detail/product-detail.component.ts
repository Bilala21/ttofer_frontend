import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { RightSideComponent } from './right-side/right-side.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RightSideComponent, RouterLink, GalleriaModule, SharedModule, NgIf, GoogleMapsModule, RouterLink, MakeOfferModalComponent, NgIf, CardShimmerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  screenWidth: number;
  screenHeight: number;
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private globalStateService: GlobalStateService, private toastr: ToastrService, private authService: AuthService,
    private route: ActivatedRoute, public extension: Extension,
    private mainServices: MainServicesService,
  ) {
    this.currentUserid = extension.getUserId();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @ViewChild(MakeOfferModalComponent) MakeOfferModalComponent!: MakeOfferModalComponent;
  center!: google.maps.LatLngLiteral;
  zoom = 14;
  productId: any = null
  product: any = {};
  wishList: any = []
  attributes: any = {}
  currentUser: any = {}
  loading: boolean = false
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
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 4
    },
    {
      breakpoint: '560px',
      numVisible: 4
    }
  ];
  isFullScreen = false


  ngOnInit(): void {
    // this.getCurrentLocation();
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true
    this.mainServices.getProductById({ product_id: this.productId }).subscribe({
      next: (value) => {
        this.product = value.data;
        this.attributes = JSON.parse(value.data.attributes)
        this.loading = false
        this.productView()

        console.log(JSON.parse(value.data.attributes), 'attributes');
      },
      error: (err) => {
        this.loading = false
      },
    })

  }

  productView() {
    debugger
    const productViewDetail = {
      product_id: this.productId,
      user_id: this.currentUserid
    }
    debugger
    this.mainServices.storeProductView(productViewDetail).subscribe({
      next: (value) => {

      }

    })
  }
  toggleWishlist(item: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
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
    // const matched = item.user_wishlist.find((prod: any) => prod.user_id == this.currentUserid)
    // return matched ? true : false
    return false
  }


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
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    // Store the data in sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(product));
    sessionStorage.setItem('userData', JSON.stringify(user));

    // Navigate to the chat route with userId as a parameter
    this.router.navigate([`/chatBox/${this.currentUserid}`], {
      state: { product, user },
    });
  }

  showOfferModal(modal_type: string) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    this.globalStateService.setOfferModal(modal_type)
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges(); // Trigger change detection if needed
  }

  getCurrentLocation(): void {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.loading = false;
          // this.initializeMap(); // Initialize the map once location is set
          // this.cdRef.detectChanges(); // Detect changes to update view
        },
        (error) => {
          console.error("Geolocation failed:", error);
          this.loading = false;
        }
      );
    } else {
      console.error("Browser doesn't support geolocation.");
    }

  }

  loadMap(): void {
    this.loading = true;
    const mapProperties = {
      center: this.center,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    const mapDiv = document.getElementById('map-div');
    if (mapDiv) {
      new google.maps.Map(mapDiv as HTMLElement, mapProperties);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = event.target.innerHeight;
    console.log(this.screenWidth);
  }
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }
}
