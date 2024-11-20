import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  constructor(private authService: AuthService, private extension: Extension, private decimalPipe: DecimalPipe, private globalStateService: GlobalStateService, private mainServices: MainServicesService, private toastr: ToastrService) { }
  @Input() postData: any = {}
  @Input({ required: true }) postDetialUrl: string = ""
  currentUserId: any = this.extension.getUserId();
  @Output() handlesUserWishlist: EventEmitter<any> = new EventEmitter<any>();
  getYear(date: string) {
    return new Date(date).getFullYear();
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';

  }

  // wishlistWithProductType(productType: any, item: any) {
  //   productType.map((prod: any) => {
  //     if (item.id == prod.id) {
  //       if (!item.user_wishlist) {
  //         prod.user_wishlist = {
  //           user_id: this.currentUserId,
  //           product_id: item.id,
  //         }
  //       }
  //       else {
  //         prod.user_wishlist = null
  //       }
  //     }
  //   })
  // }

  toggleWishlist(item: any) {
    
    console.log(item, "item");
    if (!this.currentUserId) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    let input = {
      user_id: this.currentUserId,
      product_id: item.id
    };

    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.status) {
          this.handlesUserWishlist.emit(item)
          // this.globalStateService.currentState.subscribe((state) => {
          //   if (state.isFilterActive) {
          //     this.wishlistWithProductType(state.filteredProducts, item)
          //   }
          //   else if (item.product_type == 'auction') {
          //     this.wishlistWithProductType(state.auctionProducts, item)
          //   }
          //   else {
          //     this.wishlistWithProductType(state.featuredProducts, item)
          //   }
          // })
          this.toastr.success(res.message, 'Success');
        }
      },
      error: (err) => {
        const error = err.error.message;
        this.toastr.error(error, 'Error');
      }
    });
  }

  getUserWishListItem(item: any) {
    if (item) {
      return item.user_id === this.currentUserId ? true : false
    }
    return false
  }
}
