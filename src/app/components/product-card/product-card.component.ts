import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit {
  constructor(private decimalPipe: DecimalPipe, private globalStateService: GlobalStateService, private mainServices: MainServicesService, private toastr: ToastrService) { }
  @Input() postData: any = {}
  @Input({ required: true }) postDetialUrl: string = ""
  wishList: any = []
  currentUser: any = {}
  getYear(date: string) {
    return new Date(date).getFullYear();
  }
  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';

  }
  toggleWishlist(item: any) {
    this.globalStateService.wishlistToggle(item.id);
    this.globalStateService.currentState.subscribe(state => {
      this.wishList = state.wishListItems
      this.currentUser = state.currentUser
    });
    let input = {
      user_id: this.currentUser.id,
      product_id: item.id
    }
    this.mainServices.addWishList(input).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.success) {
          this.toastr.success(res.message, 'Success');
        }
        console.log(res, "toggleWishlist");
      },
      error: (err) => {
        this.toastr.error('Failed to add product to wishlist', 'Error');
        console.log(err);
      },
    })
  }
  ngOnInit(): void {
    console.log(this.postData, "postData");
    this.globalStateService.currentState.subscribe(state => {
      this.currentUser = state.currentUser
    });
  }
}
