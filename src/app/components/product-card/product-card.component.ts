import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { Extension } from '../../helper/common/extension/extension';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  constructor(private extension: Extension, private decimalPipe: DecimalPipe, private globalStateService: GlobalStateService, private mainServices: MainServicesService, private toastr: ToastrService) { }
  @Input() postData: any = {}
  @Input({ required: true }) postDetialUrl: string = ""
  wishList: any = []
  currentUserId: any = this.extension.getUserId();

  getYear(date: string) {
    return new Date(date).getFullYear();
  }
  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';

  }

  toggleWishlist(item: any) {
    let input = {
      user_id: this.currentUserId,
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
}
