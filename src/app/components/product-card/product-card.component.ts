import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() handlesUserWishlist: EventEmitter<any> = new EventEmitter<any>();
  getYear(date: string) {
    return new Date(date).getFullYear();
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }

  toggleWishlist(item: any) {
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

  getUserWishListItem(item: any) {
    if (item) {
      return item.user_id === this.currentUserId ? true : false;
    }
    return false;
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
  getParsedAttributes() {
    if (this.postData.attributes) {
      const parsedAttributes = this.parseAttributes(this.postData.attributes);
      return parsedAttributes.slice(0, 3); // Limit to first 3 attributes
    }
  }
}
