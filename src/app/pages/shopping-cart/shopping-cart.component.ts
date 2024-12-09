import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { Extension } from '../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  imports: [
    MatCheckboxModule,
    CommonModule,
    RouterLink,
    FormsModule,
    CardShimmerComponent,
  ],
  standalone: true,
})
export class ShoppingCartComponent {
  onCheckboxChange() {
    throw new Error('Method not implemented.');
  }
  quantities: any = {};
  cartItems: any[] = [];
  totalAmount: number = 0;
  totalLength: number = 0;
  isAllChecked: boolean = false;
  loading = true;
  userId;
  selectedItems: any = [];
  isCartRoute: boolean = false;
  sellerRating: any = [];

  constructor(
    private globalStateService: GlobalStateService,
    private mainService: MainServicesService,
    private extension: Extension,
    private toastr: ToastrService
  ) {
    this.userId = extension.getUserId();
    this.loading = true;
    this.globalStateService.currentState.subscribe((state) => {
      this.cartItems = state.cartState;
      if (this.cartItems.length) {
        setTimeout(() => {
          this.loading = false;
        }, 100);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((acc, item) => {
      return item.selected
        ? acc + item.product.fix_price * item.product.quantity
        : acc;
    }, 0);
    this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
  }

  saveForLater(item: any): void {
    //(item);
    // // save-for-later/toggle
    // this.mainService.toggleSaveItem({product_id:item.id,user_id:})
    // this.cartItems.forEach((prod) => {
    //   if (prod.id === item.id) {
    //     if (!prod.save_for_later) {
    //       prod.save_for_later = true;
    //     } else {
    //       prod.save_for_later = false;
    //     }
    //   }
    // });

    this.loading = false;
    this.mainService
      .toggleSaveItem({
        product_id: item.product.id,
        user_id: this.userId,
      })
      .subscribe({
        next: (res: any) => {
          //(res);
          const found = this.cartItems.find(
            (prod) => prod.product.id == item.product.id
          );
          found.product.save_for_later = !found.product.save_for_later;
          this.toastr.success(res.message, 'Success');
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  removeItem(item: any): void {
    this.mainService
      .removeCartItem({ product_id: item.product.id, user_id: item.user.id })
      .subscribe({
        next: () => {
          this.totalLength = this.totalLength - 1;
          this.globalStateService.updateCart(item.product.id);
          this.calculateTotal();
        },
        error: (err) => {
          console.error('Error removing item:', err);
        },
      });
  }

  toggleSelectAll(): void {
    this.isAllChecked = !this.isAllChecked;
    this.cartItems.forEach((item) => {
      item.selected = this.isAllChecked;
    });
    this.isAllChecked
      ? (this.totalLength = this.cartItems.length)
      : (this.totalLength = 0);
    this.calculateTotal();
  }

  updateSelectAll(prod: any): void {
    prod.selected = !prod.selected;
    let allSelected = true;
    prod.selected
      ? (this.totalLength = this.totalLength + 1)
      : (this.totalLength = this.totalLength - 1);

    this.cartItems.forEach((item) => {
      if (!item.selected) {
        allSelected = false;
      }
    });
    this.calculateTotal();
    this.isAllChecked = allSelected;
  }
  updateQuantity(item: any) {
    this.mainService
      .updateItemQty({
        product_id: item.product.id,
        user_id: item.user.id,
        quantity: Number(item.product.quantity),
      })
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.calculateTotal();
          }
        },
        error: (err) => {},
      });
  }

  ngOnInit() {
    setTimeout(() => {
      if (Array.isArray(this.cartItems) && this.cartItems.length) {
        this.toggleSelectAll();
      }

      this.cartItems.forEach((item) => {
        this.quantities[item.product.inventory.id] = Array.from({
          length: item.product.inventory.available_stock,
        });
        this.sellerRating[item.seller.id] = Array.from({
          length: item.seller.rating,
        });
      });
    }, 2000);
  }
}
