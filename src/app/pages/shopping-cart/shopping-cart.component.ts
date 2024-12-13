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
  sellerRating: any = [];

  constructor(
    private globalStateService: GlobalStateService,
    private mainService: MainServicesService,
    private extension: Extension,
    private toastr: ToastrService
  ) {
    this.userId = extension.getUserId();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((acc, item) => {
      return item.product.is_should_buy
        ? acc + item.product.fix_price * item.product.quantity
        : acc;
    }, 0);
    this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
  }

  saveForLater(item: any): void {
    this.mainService
      .toggleSaveItem({
        product_id: item.product.id,
        user_id: this.userId,
      })
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            item.product.save_for_later = !item.product.save_for_later;
          }
          this.toastr.success(res.message, 'Success');
        },
        error: (err) => {
          this.toastr.success(err.message, 'Success');
        },
      });
  }

  removeItem(item: any): void {
    this.mainService
      .removeCartItem({ product_id: item.product.id, user_id: item.user.id })
      .subscribe({
        next: (res: any) => {
          this.totalLength = this.totalLength - 1;
          this.cartItems = this.cartItems.filter(
            (prod) => prod.product.id !== item.product.id
          );
          this.globalStateService.updateCart(this.cartItems);
          this.calculateTotal();
          this.toastr.success(res.message, 'Success');
        },
        error: (err) => {
          console.error('Error removing item:', err);
          this.toastr.error(err.message, 'Error');
        },
      });
  }

  SelectAll(): void {
    this.updateTotalLenght();
    const found = this.cartItems.find((prod) => !prod.product.is_should_buy);
    if (!found) {
      this.isAllChecked = true;
    } else {
      this.isAllChecked = false;
    }
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
    this.updateTotalLenght()
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
            this.toastr.success(
              'Items quantity updated successfully',
              'Success'
            );
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCartItems() {
    if (!this.cartItems.length) {
      this.loading = true;
      this.mainService.getCartProducts(this.userId).subscribe({
        next: (value: any) => {
          this.globalStateService.updateCart(value.data);
          this.cartItems = value.data;
          this.loading = false;
          this.calculateTotal();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetching cart products', err);
        },
      });
    }
  }

  buyProduct(item: any) {
    this.mainService
      .buyProduct({ user_id: this.userId, product_id: item.product.id })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, 'Success');
          item.product.is_should_buy = !item.product.is_should_buy;
          this.SelectAll();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.message, 'Error');
        },
      });
  }

  toggleSelect() {
    this.isAllChecked = !this.isAllChecked;
    if (!this.isAllChecked) {
      this.cartItems.map((prod) => (prod.product.is_should_buy = 0));
      this.totalLength = 0;
      this.calculateTotal();
    } else {
      this.cartItems.map((prod) => (prod.product.is_should_buy = true));
      this.totalLength = this.cartItems.length;
      this.calculateTotal();
    }
  }

  updateTotalLenght() {
    this.totalLength = this.cartItems.filter(
      (item) => item.product.is_should_buy
    ).length;
  }

  ngOnInit() {
    this.loading = true;
    this.globalStateService.currentState.subscribe((state) => {
      this.cartItems = state.cartState;
      if (this.cartItems.length) {
        if (Array.isArray(this.cartItems) && this.cartItems.length) {
          this.SelectAll();
        }

        this.cartItems.forEach((item) => {
          this.quantities[item.product.inventory.id] = Array.from({
            length: item.product.inventory.available_stock,
          });
          this.sellerRating[item.seller.id] = Array.from({
            length: item.seller.rating,
          });
        });
        this.loading = false;
      }
    });
    this.getCartItems();
  }
}
