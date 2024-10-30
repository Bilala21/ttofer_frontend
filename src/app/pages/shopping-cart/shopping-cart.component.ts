import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CartItem {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: string;
  rating: number;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  imports:[MatCheckboxModule,CommonModule,RouterLink,FormsModule],
  standalone: true,
})
export class ShoppingCartComponent {
  quantities = Array.from({ length: 10 }, (_, i) => i + 1);
  cartItems: CartItem[] = [
    {
      title: 'Diamond of Expo',
      description: '2.07 CTW Round Cut Lab Created Diamond',
      price: 1385.00,
      imageUrl: '/assets/images/silder-1.jpg',
      seller: 'Diamond Expo',
      rating: 4.5,
    },
    {
      title: 'Sage Designs L.A.',
      description: 'Lab Grown Oval Diamond Engagement Ring',
      price: 1799.00,
      imageUrl: '/assets/images/silder-2.jpg',
      seller: 'Sage Designs L.A.',
      rating: 4.8,
    }
  ];
constructor(private router: Router){}
  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  buyNow(item: CartItem) {
    alert(`Purchasing ${item.title}`);
  }

  saveForLater(item: CartItem) {
    alert(`${item.title} saved for later`);
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
    // alert('Proceeding to checkout');
  }
}
