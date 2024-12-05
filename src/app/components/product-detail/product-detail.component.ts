import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
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
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  inCart: boolean = false;
  screenWidth: number;
  screenHeight: number;
  productId: any = null;
  product: any = {};
  attributes: any = {};
  currentUser: any = {};
  loading: boolean = false;
  similarLoading: boolean = false;
  similarProductsData: any = [];
  currentUserid: any;
  parsedAttributes: { [key: string]: string | number } = {};

  isFullScreen = false;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15; // Adjust zoom level to your preference
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
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private globalStateService: GlobalStateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public extension: Extension,
    private mainServices: MainServicesService
  ) {
    this.currentUserid = extension.getUserId();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  fetchData(productId: number) {
    this.mainServices.getProductById({ product_id: productId }).subscribe({
      next: (value) => {
        // ;
        this.product = value.data;
        this.product.in_cart =this.inCart;
        this.attributes = value.data.attributes;
        console.log(this.product)
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
        console.error('Error fetching product:', err);
        this.loading = false;
      },
    });
  }
  // fetch-similar-product
  fetchSimilarProducts(productId: number) {
    this.mainServices.getSimilarProduct({ product_id: productId }).subscribe({
      next: (value) => {
        // ;
        this.similarProductsData = value.data;
        this.similarLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.similarLoading = false;
      },
    });
  }
  ngOnInit(): any {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.fetchData(this.productId);
    this.fetchSimilarProducts(this.productId)
    this.productView()
    this.globalStateService.currentState.subscribe((state) => {
      console.log(this.productId);
      state.cartState.find((item) => {
        if (Number(item.product.id) === Number(this.productId)) {
          this.inCart = true;
        }
      });
    });
  }

  productView() {
    const productViewDetail = {
      product_id: this.productId,
      user_id: this.currentUserid,
    };
    //
    this.mainServices.storeProductView(productViewDetail).subscribe({
      next: (value) => {},
    });
  }

  toggleWishlist(item: any) {
    if (!this.currentUserid) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    let input = {
      user_id: this.currentUserid,
      product_id: item.id,
    };

    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success');
          this.fetchData(item.id);
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
