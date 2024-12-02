import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  imports: [MatCheckboxModule, CommonModule, RouterLink, FormsModule],
  standalone: true,
})
export class ShoppingCartComponent implements OnInit {
onCheckboxChange() {
throw new Error('Method not implemented.');
}
  quantities = Array.from({ length: 10 }, (_, i) => i + 1); // Generate quantities 1-10
  checkAll: boolean = false;
  isManual: boolean = false;
  cartItems: any[] = [];
  totalAmount: number = 0;
  totalLength: number = 0;

  constructor(
    private router: Router,
    private globalStateService: GlobalStateService,
    private mainService: MainServicesService
  ) {}

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (acc, item) => acc + item.product.fix_price * item.qty,
      0
    );
  }

  buyNow(item: any): void {
    alert(`Purchasing ${item.product.title}`);
  }

  saveForLater(item: any): void {
    alert(`${item.product.title} saved for later`);
  }

  removeItem(item: any): void {
    this.mainService.removeCartItem({ product_id: item.id }).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
        this.calculateTotal();
        this.totalLength = this.cartItems.length;
        this.globalStateService.updateCart(item, true);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  toggleSelectAll(): void {
    this.checkAll = !this.checkAll;
    this.isManual = false;
  }

  cartList(): void {
    this.mainService.getCartProducts().subscribe((state: any) => {
      this.cartItems = state?.data || [];
      this.totalLength = this.cartItems.length;
      this.calculateTotal();
    });
  }

  ngOnInit(): void {
    this.cartList();
  }
}


