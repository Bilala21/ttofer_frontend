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
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

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
  sellerRating: any = {};
  constructor(
    private globalStateService: GlobalStateService,
    private mainService: MainServicesService,
    private toastr: ToastrService,
    private token: JwtDecoderService
  ) {
    this.userId = token.decodedToken?.id;
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
    let saved_for_later_count: any = document.getElementById(
      'saved_for_later_count'
    );
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
          if (item.product.save_for_later) {
            saved_for_later_count.innerHTML =
              +saved_for_later_count.innerHTML + 1;
          }
          else {
            saved_for_later_count.innerHTML =
              +saved_for_later_count.innerHTML - 1;
          }
        },
        error: (err) => {
          this.toastr.success(err.message, 'Success');
        },
      });

    console.log(saved_for_later_count?.innerHTML);
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
    this.updateTotalLenght();
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
          //(err);
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
    const payload = item?.all
      ? item
      : {
          user_id: this.userId,
          product_id: item == null ? null : item.product.id,
          all: item == null ? 1 : 0,
        };
    this.mainService.buyProduct(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        item.product.is_should_buy = item?.all
          ? true
          : !item.product.is_should_buy;
        this.SelectAll();
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      },
    });
  }

  toggleSelect() {
    this.isAllChecked = !this.isAllChecked;
    if (!this.isAllChecked) {
      this.cartItems.map((prod) => (prod.product.is_should_buy = 0));
      this.totalLength = 0;
      this.buyProduct(null);
      this.calculateTotal();
    } else {
      this.cartItems.map((prod) => (prod.product.is_should_buy = true));
      this.totalLength = this.cartItems.length;
      this.buyProduct({ user_id: this.userId, all: 1 });
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
          try {
            if (
              item.product?.inventory?.id &&
              item.product.inventory.available_stock
            ) {
              this.quantities[item.product.inventory.id] = Array.from({
                length: item.product.inventory.available_stock,
              });
            }
            if (item?.seller.rating) {
              item.sellerRating = Array.from({
                length: Math.round(item?.seller.rating),
              }).fill(1);
            }
          } catch (error) {
            console.error('Error processing item:', item, error);
          }
        });

        this.loading = false;
      }
    });
    this.getCartItems();
  }
}
