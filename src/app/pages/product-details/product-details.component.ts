import { LoginModalComponent } from './../login-modal/login-modal.component';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/shared-components/header/header.component';
import { FooterComponent } from "../../shared/shared-components/footer/footer.component";
import { ProductCarouselComponent } from "../carousels/product-carousel/product-carousel.component";
import { RelatedCarouselComponent } from "../carousels/related-carousel/related-carousel.component";
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from "../../shared/shared.module";
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { SideProductDetailsComponent } from "./sideProductDetail/side-product-details.component";

@Component({
    selector: 'app-product-details',
    standalone: true,
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
    imports: [
    HeaderComponent,
    FooterComponent,
    ProductCarouselComponent,
    RelatedCarouselComponent,
    NgIf,
    FormsModule,
    GoogleMapsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    LoginModalComponent,
    SideProductDetailsComponent
]
})
export class ProductDetailsComponent {
  dummy =[{src:"/assets/images/no-img.png"}]
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ]
  productId:any;
  auctionProduct: any[] = [];
  featuredProducts: any[] = []
  featuredProductsTemp: any[] = []
  currentUserid: number = 0
  offerPrice: number = 0;
  center!: google.maps.LatLngLiteral;
  zoom = 4;
  parsedAttributes:any
  attributesObject:any
  loading = false;
  idSendOfferDisabled:boolean = false;
  allowedToMakeOffer:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    private authService:AuthService,
    private extension: Extension,
    private snackBar: MatSnackBar,
    private router:Router,
  ){
    this.currentUserid = extension.getUserId()
  }
  ngOnInit(){
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.getAuctionProduct();
    this.getCurrentLocation();
    this.getFeatcherdProduct();
    this.loadMap();
  }
  showSuccessMessage(message:string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
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
  getUserId() {

    const jsonStringGetData = localStorage.getItem('key');
    if (jsonStringGetData) {
      const user = JSON.parse(jsonStringGetData);
      this.currentUserid = user.id;
    }
  }
    openModal() {
      if (!localStorage.getItem('key')) {
        // 
        this.authService.triggerOpenModal();
      }
        const modal = document.getElementById('offerModal');
        if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-modal', 'true');
          modal.removeAttribute('aria-hidden');
          document.body.classList.add('modal-open');
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }

      closeModal() {
        const modal = document.getElementById('offerModal');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            document.body.removeChild(backdrop);
          }
        }
      }
      openChat() {
        if (!localStorage.getItem('key')) {
          // 
          this.authService.triggerOpenModal();
          return
        }
        else{
          const userId = this.featuredProducts[0].user.id;
          this.router.navigate([`/chatBox/${userId}`]);
        }
       
      }
      getAuctionProduct(){
      
        this.mainServices.getAuctionProduct().subscribe(res =>{
      
          this.auctionProduct = res.data
          this.auctionProduct.filter(item => this.auctionProduct.includes(this.productId))
          // console.log(this.auctionProduct)
          this.auctionProduct = this.auctionProduct.filter((item) => {
            return item.id == this.productId;
        });
        console.log(this.auctionProduct)
        })
      }
    
    makeOffer(){
      this.idSendOfferDisabled = true;
      let input = {
        product_id: this.productId,
        seller_id: this.featuredProducts[0].user.id,
        buyer_id:this.currentUserid ,
        offer_price:this.offerPrice,
      }
      this.mainServices.makeOffer(input).subscribe(res =>{
      this.idSendOfferDisabled = false;
        this.closeModal();
      });
    }
      getFeatcherdProduct() {
      this.loading = true;
      this.mainServices.getFeatureProduct().subscribe(res =>{
        this.featuredProducts = res.data
        this.featuredProductsTemp = res.data
        this.featuredProducts = this.featuredProducts.filter((item) => {
          return item.id == this.productId;
        });
        this.allowedToMakeOffer = this.featuredProducts.filter((item) => {
          return item.user_id == this.currentUserid;
        }).length <= 0;
       if (this.featuredProducts[0].attributes) {
        this.attributesObject = JSON.parse(this.featuredProducts[0].attributes);
        this.parsedAttributes = this.attributesObject?.attributes;
        console.log("product",this.featuredProducts[0].photo)
       }
       
        this.loading = false;
      },
      (error) => {
        if (error.status === 401) {

        this.loading = false;
          // console.error('Unauthorized access. Redirecting to login...');
        } else {
          this.loading = false;
          // console.error('Error fetching feature product:', error);
        }
      })
    }

  loadMap(): void {
    this.loading = true;
    const mapProperties = {
      center: new google.maps.LatLng(35.6895, 139.6917),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Ensure the map div exists before initializing the map
    const mapDiv = document.getElementById('map-div');
    if (mapDiv) {
      const map = new google.maps.Map(mapDiv as HTMLElement, mapProperties);
      this.loading = false;
    }
  }
  addWishLst(item:any){
    this.loading = true
    let input = {
      user_id:this.currentUserid,
      product_id:item.id
    }
    this.mainServices.addWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.loading = false
    })
  }
  removeWishLst(item:any){
    this.loading = true
    let input = {
      id:item.id
    }
    this.mainServices.removeWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.loading = false
    },(err:any) =>{
      this.showSuccessMessage(err)
      this.loading = false
    })
  }
}
