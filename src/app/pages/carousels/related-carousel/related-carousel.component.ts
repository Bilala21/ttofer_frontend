import { CommonModule, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductCardComponent } from "../../../components/product-card/product-card.component";

@Component({
  selector: 'app-related-carousel',
  standalone: true,
  imports: [NgFor, CommonModule, ProductCardComponent],
  templateUrl: './related-carousel.component.html',
  styleUrl: './related-carousel.component.scss'
})
export class RelatedCarouselComponent {
  showAll:boolean = false;
  @Input() productList:any = []
  images = [
    'assets/images/map.png',
    'assets/images/email-img.png',
    'assets/images/map.png',
    'assets/images/email-img.png',
    'assets/images/map.png',
    'assets/images/email-img.png'
  ];

  addWishLst(item:any){
    this.loading = true;
    let input = {
      user_id:this.currentUserId,
      product_id:item.id
    }
    this.mainServices.addWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      this.loading = false;
    })
  }
  removeWishLst(item:any){
    this.loading = true;
    let input = {
      id:item.id
    }
    this.mainServices.removeWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      res
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      this.loading = false;
    },(err:any) =>{
      this.showSuccessMessage(err)
      this.loading = false;
    })
  }
  showSuccessMessage(message:string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
  ngOnInit(){
    if (this.currentUserId>0) {
      this.items = this.productList
      console.log('reladed ads', this.items)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      // this.firstRowItems = this.firstRowItems
    }
  }
  getAuctionProduct(){
    this.loading = true;

    this.mainServices.getAuctionProduct().subscribe(res =>{

      this.auctionProduct = res.data
      console.log(this.auctionProduct)
      this.loading = false;
    })
  }
  getFeatcherdProduct() {
    this.loading = true;
    this.mainServices.getFeatureProduct().subscribe(res =>{
      this.featuredProducts = res.data
      console.log(this.featuredProducts)
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
  loading = false;
  currentUserId : number = 0;
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.extension.getUserId()
   }
  isVehicle(item: any): boolean {

    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.category_id === 'Vehicles';
    }
    return attributesObject.category_name === 'Vehicles';
  }
  isProperty(item: any): boolean {

    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.category_id === 'Property for Sale';
    }
    return attributesObject.category_name === 'Property for Sale';
  }
  Km(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.mileage;
    }
    return attributesObject.mileage ;
  }
  petrol(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.fuelType;
    }
    return attributesObject.fuelType ;
  }
  bed(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.bedrooms;
    }
    return attributesObject.bedrooms ;
  }
  bath(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.bedrooms;
    }
    return attributesObject.bedrooms ;
  }
  currentIndex = 0;
  visibleImages: string[] = [];
  featuredProducts: any[] = [];
  auctionProduct: any[] = []
  getDisplayedItems() {
    return this.showAll ? this.auctionProduct : this.auctionProduct.slice(0, 8);
  }
  getVisibleItems() {
    let endIndex = this.currentIndex + 4;
    if (endIndex > this.items?.length) {
      endIndex = this.items?.length;
    }
    return this.items?.slice(this.currentIndex, endIndex);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.items.length - 4;
    }
  }

  nextImage() {
    if (this.currentIndex < this.items.length - 4) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }
  items:any
}
