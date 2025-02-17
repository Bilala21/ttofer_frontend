import { Component, HostListener, OnInit,AfterViewInit } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { Extension } from '../../helper/common/extension/extension';
import { NgIf } from '@angular/common';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { ToastrService } from 'ngx-toastr';
import { GoogleMapsModule } from '@angular/google-maps';
import { MakeOfferModalComponent } from '../modals/make-offer-modal/make-offer-modal.component';
import { CardShimmerComponent } from '../card-shimmer/card-shimmer.component';
import { GalleriaModule } from 'primeng/galleria';
import { RightSideComponent } from './right-side/right-side.component';
import { FeedbackCardComponent } from '.././feedback-card/feedback-card.component';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RightSideComponent,
    RouterLink,
    GalleriaModule,
    NgIf,
    GoogleMapsModule,
    RouterLink,
    MakeOfferModalComponent,
    NgIf,
    CardShimmerComponent,
    FeedbackCardComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit,AfterViewInit {
  protected currentUser: any = {};
  inCart: boolean = false;
  screenWidth: number;
  screenHeight: number;
  productId: any = null;
  product: any = {};
  attributes: any = {};
  loading: boolean = false;
  similarLoading: boolean = false;
  similarProductsData: any = [];
  parsedAttributes: { [key: string]: string | number } = {};
  isFullScreen = false;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  images: any = [];
  position: string = 'left';
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 4,
    },
    {
      breakpoint: '560px',
      numVisible: 4,
    },
  ];
  constructor(
    private router: Router,
    private globalStateService: GlobalStateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public extension: Extension,
    private mainServices: MainServicesService,
    private jwtDecoderService: JwtDecoderService
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.currentUser = this.jwtDecoderService.decodedToken;
    this.globalStateService.currentState.subscribe((state) => {
      this.currentUser = this.currentUser
        ? this.currentUser
        : state.currentUser;
    });
  }
  fetchData(productId: number) {
    this.mainServices
      .getProductById({ product_id: productId, user_id: this.currentUser.id })
      .subscribe({
        next: (value) => {
          this.product = value.data;
          this.product.in_cart = this.inCart;
          this.attributes = value.data.attributes;
          if (typeof this.attributes === 'string') {
            this.attributes = JSON.parse(value.data.attributes);
          }
          this.parsedAttributes = this.parseAttributes(this.attributes);
          const lat = Number(this.product.latitude);
          const lng = Number(this.product.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            this.center = { lat, lng };
            this.markerPosition = this.center;
          } else {
            console.error('Invalid latitude or longitude:', { lat, lng });
          }

          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }
  fetchSimilarProducts(productId: number) {
    this.mainServices.getSimilarProduct({ product_id: productId }).subscribe({
      next: (value) => {
        //(value)
        this.similarProductsData = value.data;
        this.similarLoading = false;
      },
      error: (err) => {
        this.similarLoading = false;
      },
    });
  }
  ngOnInit(): any {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.fetchData(this.productId);
    this.fetchSimilarProducts(this.productId);
    this.productView();
    this.globalStateService.currentState.subscribe((state) => {
      state.cartState.find((item) => {
        if (Number(item.product.id) === Number(this.productId)) {
          this.inCart = true;
        }
      });
    });
  }
  ngAfterViewInit(): void {
    // Use a timeout to delay the operation (if needed)
    setTimeout(() => {
      // Select the button element by its class name
      const button = document.querySelector('.p-galleria-thumbnail-next') as HTMLButtonElement;
      const buttonPrev = document.querySelector('.p-galleria-thumbnail-prev') as HTMLButtonElement;
  
      // Log the button for debugging
      console.log("Changes in many files...", button);
  
      // Check if the button exists and remove the 'disabled' attribute
      if (button) {
        button.removeAttribute('disabled');
        buttonPrev.removeAttribute('disabled');
      }
    }, 3000);
  }
  
  productView() {
    const productViewDetail = {
      product_id: this.productId,
      user_id: this.currentUser.id,
    };
    this.mainServices.storeProductView(productViewDetail).subscribe({
      next: (value) => {},
    });
  }
  toggleWishlist(item: any) {
    if (!this.currentUser.id) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    let input = {
      user_id: this.currentUser.id,
      product_id: item.id,
    };
    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        if (res.status) {
          item.is_in_wishlist = !item.is_in_wishlist;
          item.wishlist_count = item.is_in_wishlist
            ? item.wishlist_count + 1
            : item.wishlist_count - 1;
          this.toastr.success(res.message, 'Success');
        }
      },
      error: (err) => {
        const error = err.error.message;
        this.toastr.error(error, 'Error');
      },
    });
  }
  buyProduct(product: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
  }
  handleProductQty(event: any, product: any) {
    this.globalStateService.updateCart({ ...product, quantity: event.value });
  }
  contactSeller(product: any, user: any): void {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    sessionStorage.setItem('productData', JSON.stringify(product));
    sessionStorage.setItem('userData', JSON.stringify(user));

    // Navigate to the chat route with userId as a parameter
    this.router.navigate([`/chatBox/${this.currentUser.id}`], {
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
    this.globalStateService.setOfferModal(modal_type);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = event.target.innerHeight;
  }
  private parseAttributes(value: any): any {
    try {
      if (typeof value === 'string') {
        let attributes = JSON.parse(value);
        let parsedAttributes: any = {};
        for (const [key, val] of Object.entries(attributes)) {
          if (key.includes('_')) {
            continue;
          }
          parsedAttributes[key] =
            typeof val === 'string' && this.isJson(val) ? JSON.parse(val) : val;
        }
        return parsedAttributes;
      } else if (typeof value != 'string') {
        let parsedAttributes: any = {};
        for (const [key, val] of Object.entries(value)) {
          if (key.includes('_')) {
            continue;
          }
          parsedAttributes[key] =
            typeof val === 'string' && this.isJson(val) ? JSON.parse(val) : val;
        }
        return parsedAttributes;
      }
    } catch (error) {
      return {};
    }
  }
  private isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }
}
