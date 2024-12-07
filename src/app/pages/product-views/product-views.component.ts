import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-views',
  standalone: true,
  templateUrl: './product-views.component.html',
  styleUrl: './product-views.component.scss',
  imports: [NgIf, NgFor, CommonModule, FormsModule]
})

export class ProductViewsComponent {
  @Input() progress: number = 30;
  loading = false
  subCatContent:any = [];
  min_price:number = 0
  max_price:number = 0
  categorieId:string = ""
  locations: any = [];
  searchLocation= "";


  trackById(index: number, item: any): number {
    return item.id;
  }
  sellerType:any = [
    {id:'Verified Seller'},
    {id:'Urgents'}
  ]
  conditions:any = [
    {id:'Any'},
    {id:'New'},
    {id:'Used'}
  ]
  locationRadius = [
    { title: 'LOCATION RADIUS', subTitle: '32 miles' },
  ];
  prices = [
    { title: 'PRICES'},
  ];

  activeLocationIndex: number | null = 0;
  activeRadiusIndex: number | null = 0;
  activePriceIndex: number | null = 0;

  toggleRadiusAccordion(index: number): void {
    this.activeRadiusIndex = this.activeRadiusIndex === index ? null : index;
  }

  togglePriceAccordion(index: number): void {
    this.activeRadiusIndex = this.activeRadiusIndex === index ? null : index;
  }

  isLocationActive(index: number): boolean {
    return this.activeLocationIndex === index;
  }

  isRadiusActive(index: number): boolean {
    return this.activeRadiusIndex === index;
  }
  show: boolean = false
  activeButton: number = 1;

  openfilter(){
    this.show = !this.show
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
  getProductCondition(condition:any){

    // this.is_urgert = condition
    if(condition == "Any"){
      this.sort_by =""
    }
    else if(condition == "New"){
      this.sort_by = "newest on top"
    }
    else if(condition == "Used"){
      this.sort_by = "newest on bottom"
    }
    this.getAllProducts()
  }
  getSubCatProducts(row: any) {

    this.sub_category_id = row.id;
    this.getAllProducts();

  }
  search:string = ""
  sub_category_id:any
  limit:string = ""
  locationId:string = ""
  sort_by:string = ""
  is_urgert:string = ""
  auction: any []= []
  feature: any []= []
  currentUserId : number = 0;
  showSuccessMessage(message:string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
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
  getAllProducts() {

    this.loading = true

    let formData = new FormData();
    let input = {
      search: this.search,
      category_id: this.categorieId,
      sub_category_id: this.sub_category_id,
      limit: this.limit,
      location: this.locationId,
      sort_by: this.sort_by,
      is_urgert: this.is_urgert,
      // min_price: this.min_price,
      // max_price: this.max_price
    }
    this.mainServices.getAllProducts(input).subscribe((res: any) => {

      this.categories = res.data
      //('Categories', this.categories)
      if (this.categories.length > 0) {
        this.featuredProducts = []
        this.auctionProduct = []
        this.categories.forEach(category => {
          if (category.fix_price !== null) {
            this.featuredProducts.push(category);
            this.addLocationIfNotExists(category.location);
            // this.filterByLocation();
            // this.filterByPrice();
          }
          else if (category.auction_price !== null) {
            this.auctionProduct.push(category);
            this.auctionProduct[this.auctionProduct.length-1].isAllowedToBid = this.auctionProduct[this.auctionProduct.length-1].user_id != this.currentUserId;
            this.addLocationIfNotExists(category.location);
            // this.filterByLocation();
            // this.filterByPrice();
          }
          else {
          //   this.featuredProducts = []
          //   this.auctionProduct = []
          }
          this.loading = false
        });
        this.featuredProducts = this.featuredProducts.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.auctionProduct = this.auctionProduct.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.filterByLocation();
            this.filterByPrice();
      }
      else {
        this.loading = false
        this.featuredProducts = []
        this.auctionProduct = []
      }
      this.startCountdowns();
    })
  }
  startCountdowns() {
    this.auctionProduct.forEach((item, index) => {
      if(item.title =='14.5'){

      }
      // const endingDateTimeString = `${item.ending_date.split(' ')[0]} ${item.ending_time}`;
      // const endingDateTime = new Date(endingDateTimeString).getTime();
      const datePart = item.ending_date.split('T')[0]; // Extract the date part
      const endingDateTimeString = `${datePart}T${item.ending_time}:00.000Z`; // Combine with the time and format it
      const endingDateTime = new Date(endingDateTimeString).getTime(); // Parse and get the timestamp

      const intervalId = setInterval(() => {
        const nowUTC = Date.now();
        const timeDifference = endingDateTime - nowUTC;
        if (timeDifference <= 0 || Number.isNaN(timeDifference)) {
          clearInterval(intervalId);
          item.calculateRemaningTime='Bid Expired';
          item.IsBit=false
          // this.auction.splice(index, 1); // Remove the item from auction
        } else {
          item.calculateRemaningTime = this.formatTimeDifference(timeDifference);
          // item.remainingTime = this.formatTimeDifference(timeDifference)+ ' remaining';
          item.IsBit=true;
        }
      }, 1000); // Update every second
    });
  }
  formatTimeDifference(timeDifference: number): string {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let formattedTime = '';
    if (days > 0) {
      formattedTime += `${days} days`;
  } else if (hours > 0) {
      formattedTime += `${hours} hours`;
  } else if (minutes > 0) {
      formattedTime += `${minutes} minutes`;
  } else {
      formattedTime += `${seconds} seconds`;
  }

    return formattedTime;
  }
  private addLocationIfNotExists(locationId: string) {
    // Check if the location already exists in the array
    if (locationId != null && !this.locations.some((location: { id: string; }) => location.id === locationId)) {
      // Add the new location if it does not exist
      this.locations.push({ id: locationId });
  }
}
filterByLocation(){
  if(this.searchLocation !== ""){
    this.auctionProduct = this.auctionProduct.filter(x=>x.location == this.searchLocation)
    this.featuredProducts = this.featuredProducts.filter(x=>x.location == this.searchLocation)
  }
}
getProductByLocation(location:any){
  this.searchLocation = location;
  this.getAllProducts()

}
toFLoat(){
  this.featuredProducts.forEach(item => {
    item.fix_price = parseFloat(item.fix_price);
  });

  this.auctionProduct.forEach(item => {
    item.auction_price = parseFloat(item.auction_price);
  });
  // this.min_price = parseFloat(this.min_price);
  // this.max_price = parseFloat(this.max_price);

}
filterByPrice() {
  this.toFLoat();
  if (this.min_price != undefined && this.min_price !== null && this.min_price !== 0) {
      this.featuredProducts = this.featuredProducts.filter(item => item.fix_price !== null && item.fix_price >= this.min_price);
      this.auctionProduct = this.auctionProduct.filter(item => item.auction_price !== null && item.auction_price >= this.min_price);
  }

  if (this.max_price != undefined && this.max_price !== null && this.max_price !== 0) {
      this.featuredProducts = this.featuredProducts.filter(item => item.fix_price !== null && item.fix_price <= this.max_price);
      this.auctionProduct = this.auctionProduct.filter(item => item.auction_price !== null && item.auction_price <= this.max_price);
  }
}
  categories: any[] = []
  featuredProducts:any[] = [];
  auctionProduct:any[] = []
  productType:string="";
constructor(
  private route: ActivatedRoute,
  private mainService: MainServicesService ,
  private mainServices: MainServicesService,
  private extension: Extension,
    private snackBar: MatSnackBar
){
  this.currentUserId = extension.getUserId()
}
  ngOnInit(){
    this.productType = this.route.snapshot.paramMap.get('id')!;
    if (this.productType =="a") {
      this.getAllProducts()
    }
    else{
      this.getAllProducts()
    }
  }
  getFeatcherdProduct() {
    this.loading = true;
    this.mainService.getFeatureProduct().subscribe(res =>{
      this.featuredProducts = res.data
      //(this.featuredProducts)
      this.loading = false;
    },
    (error:any) => {
      if (error.status === 401) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }
  getAuctionProduct(){
    this.loading = true;
    this.mainService.getAuctionProduct().subscribe(res =>{

      this.auctionProduct = res.data
      this.auctionProduct = this.auctionProduct.map((item) => {
        let remainingDays = null;
        if (item.starting_date && item.ending_date) {
          const startDate = new Date(item.starting_date);
          const endDate = new Date(item.ending_date);
          const timeDiff = endDate.getDate() - startDate.getDate();
          // remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
          remainingDays = timeDiff
        }
        return {
          ...item,
          remainingDays: remainingDays
        };
      });
      //(this.auctionProduct)
      this.loading = false;
    })
  }
}
