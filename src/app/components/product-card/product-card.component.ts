import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { Extension } from '../../helper/common/extension/extension';
import { AuthService } from '../../shared/services/authentication/Auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  constructor(
    private authService: AuthService,
    private extension: Extension,
    private decimalPipe: DecimalPipe,
    private globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private toastr: ToastrService
  ) {}
  @Input() postData: any = {};
  @Input({ required: true }) postDetialUrl: string = '';
  currentUserId: any = this.extension.getUserId();
  parsedAttributes: any[] = [];

  @Output() handlesUserWishlist: EventEmitter<any> = new EventEmitter<any>();
  getYear(date: string) {
    return new Date(date).getFullYear();
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }

  toggleWishlist(item: any) {
    console.log(item)
    const data = this.extension.getUserId();
    if (!this.extension.getUserId()) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    let input = {
      user_id: this.extension.getUserId(),
      product_id: item.id,
    };

    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        if (res.status) {
          item.is_in_wishlist=!item.is_in_wishlist
          this.handlesUserWishlist.emit(item);
          this.toastr.success(res.message, 'Success');
        }
      },
      error: (err) => {
        const error = err.error.message;
        this.toastr.error(error, 'Error');
      },
    });
  }


  // handlesUserWishlist(item: any) {
  //   console.log(item)
  //   if (item.product_type !== 'auction') {
  //     const found= this.featuredPosts.find((cate:any)=> cate.id == item.id)
  //     found.is_in_wishlist= !found.is_in_wishlist
  //   } else {
  //     const found= this.auctionPosts.find((cate:any)=> cate.id == item.id)
  //     found.is_in_wishlist= !found.is_in_wishlist

  //   }
  // }


  getUserWishListItem(item: any) {
    if (item) {
      return item.user_id === this.currentUserId ? true : false;
    }
    return false;
  }

  iconMapping: any = {
    brand: 'fa-tag', // Icon for brand
    condition: 'fa-cogs', // Icon for condition
    storage: 'fa-hdd', // Icon for storage
    color: 'fa-paint-brush', // Icon for color
    mileage: 'fa-road', // Icon for mileage
    fuelType: 'fa-gas-pump', // Icon for fuelType
    delivery: 'fa-truck', // Icon for delivery
    engineCapacity: 'fa-car', // Icon for engineCapacity
    model: 'fa-cogs', // Icon for model
    year: 'fa-calendar', // Icon for year
    bedrooms: 'fa-bed',
    yearBuilt: 'fa-calendar-alt', // Icon for bedrooms
    area: 'fa-expand', // Icon for area/size
    bathRoom: 'fa-bath', // Icon for bathRoom
    completion: 'fa-check-circle', // Icon for completion status
    fearture: 'fa-star', // Icon for features
    furnisheable: 'fa-couch', // Icon for furnished
    make_and_model: 'fa-car', // Icon for make and model
    type: 'fa-tshirt', // Icon for fashion type
    age: 'fa-child', // Icon for age
    breed: 'fa-paw', // Icon for breed
    toy: 'fa-toy', // Icon for toy
    positionType: 'fa-briefcase', // Icon for position type
    companyName: 'fa-building', // Icon for company name
    salary: 'fa-money-bill-wave', // Icon for salary
    salaryPeriod: 'fa-calendar-alt', // Icon for salary period
    careerLevel: 'fa-level-up-alt', // Icon for career level
  };

  private parseAttributes(value: any): any {
    try {
      let attributes = JSON.parse(value);
      if (typeof attributes === 'string') {
        const attributes2 = JSON.parse(attributes);
        let parsedAttributes: any = [];
        for (const [key, val] of Object.entries(attributes2)) {
          parsedAttributes.push({
            key,
            value:
              typeof val === 'string' && this.isJson(val)
                ? JSON.parse(val)
                : val,
            icon: this.iconMapping[key] || 'fa-question-circle', // Default icon if no match
          });
        }
        return parsedAttributes;
      } else if (typeof attributes != 'string') {
        let parsedAttributes: any = [];
        for (const [key, val] of Object.entries(attributes)) {
          parsedAttributes.push({
            key,
            value:
              typeof val === 'string' && this.isJson(val)
                ? JSON.parse(val)
                : val,
            icon: this.iconMapping[key] || 'fa-question-circle', // Default icon if no match
          });
        }
        return parsedAttributes;
      }
    } catch (error) {
      console.error('Error parsing attributes 1234:', error);
      return [];
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postData'] && this.postData?.attributes) {
       
      this.parsedAttributes = this.parseAttributes(this.postData.attributes).slice(0, 3);
    }
  }
  ngOnInit(): void {
    //  //(this.postData, 'attributes');
  }
}
