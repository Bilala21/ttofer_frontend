import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { Extension } from '../../helper/common/extension/extension';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) postDetialUrl: string = '';
  currentUserId: any;
  parsedAttributes: any[] = [];
  @Output() handlesUserWishlist: EventEmitter<any> = new EventEmitter<any>();
  @Input() postData: any = {};
  constructor(
    private authService: AuthService,
    private extension: Extension,
    private decimalPipe: DecimalPipe,
    private globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private toastr: ToastrService,
    private token:JwtDecoderService
  ) {
    this.currentUserId= this.token.decodedToken?.id;
  }
  toggleWishlist(item: any) {
    if (!this.currentUserId) {
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
          item.is_in_wishlist = !item.is_in_wishlist;
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
  iconMapping: any = {
    brand: 'fa-tag', 
    condition: 'fa-cogs', 
    storage: 'fa-hdd',
    color: 'fa-paint-brush', 
    mileage: 'fa-road', 
    fuelType: 'fa-gas-pump', 
    delivery: 'fa-truck', 
    engineCapacity: 'fa-car', 
    model: 'fa-cogs', 
    year: 'fa-calendar', 
    bedrooms: 'fa-bed',
    yearBuilt: 'fa-calendar-alt', 
    area: 'fa-expand', 
    bathRoom: 'fa-bath', 
    completion: 'fa-check-circle', 
    fearture: 'fa-star', 
    furnisheable: 'fa-couch', 
    make_and_model: 'fa-car', 
    type: 'fa-tshirt', 
    age: 'fa-child', 
    breed: 'fa-paw', 
    toy: 'fa-toy', 
    positionType: 'fa-briefcase', 
    companyName: 'fa-building', 
    salary: 'fa-money-bill-wave', 
    salaryPeriod: 'fa-calendar-alt', 
    careerLevel: 'fa-level-up-alt', 
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
            icon: this.iconMapping[key] || 'fa-question-circle', 
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
            icon: this.iconMapping[key] || 'fa-question-circle', 
          });
        }
        return parsedAttributes;
      }
    } catch (error) {
      return [];
    }
  }
  login() {
    this.toastr.warning('Plz login first than try again !', 'Warning');
    this.authService.triggerOpenModal();
  }
  addToCart(item: any) {
    this.mainServices
      .adToCartItem({
        product_id: item.id,
        user_id: this.currentUserId,
        quantity: 1,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, 'success');
          this.mainServices.getCartProducts(this.currentUserId).subscribe({
            next: (value: any) => {
              this.globalStateService.updateCart(value.data);
            },
            error: (err) => {
              this.toastr.error(err.message, 'error');
            },
          });
        },
        error: (err) => {
          if (err.error.code == 422) {
            this.toastr.error('This product is already in your cart', 'error');
          }
        },
      });
  }
  private isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }
  ngOnInit(): void {
    if (this.postData && this.postData.product_type === 'auction') {    
      if (this.postData?.attributes) {
        this.parsedAttributes = this.parseAttributes(this.postData.attributes).slice(0, 3);
      }
          const price = this.postData?.auction_initial_price ?? this.postData?.fix_price ?? 0;
      this.postData.price = this.decimalPipe.transform(price, '1.0-0') || '0';
      this.postData.postedAt = 12;
    }
    
  }
}
