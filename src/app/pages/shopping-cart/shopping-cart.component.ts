import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { MainServicesService } from '../../shared/services/main-services.service';

// interface CartItem {
//   title: string;
//   description: string;
//   fix_price: number;
//   image: string;
//   seller: string;
//   rating: number;
// }

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  imports: [MatCheckboxModule, CommonModule, RouterLink, FormsModule],
  standalone: true,
})
export class ShoppingCartComponent implements OnInit {
  quantities = [1,2,3,4,5,6,7,8,9,10];
  checkAll: boolean = false
  isManual: boolean = false
  cartItems: any[] = [];
  totalAmount:any = 0
  totalLength:any = 0
  constructor(private router: Router, private globalStateService: GlobalStateService, private mainService: MainServicesService) { }
  calculateTotal(): number {
    return this.cartItems.reduce((acc: any, item: any) => {
      return acc + item.product.fix_price * item.qty;
    }, 0);
  }

  buyNow(item: any) {
    alert(`Purchasing ${item.title}`);
  }

  saveForLater(item: any) {
    alert(`${item.title} saved for later`);
  }

  removeItem(item: any) {
    this.mainService.removeCartItem({ product_id: item.id }).subscribe({
      next: (value) => {

      },
      error: (err) => {

      },
    })
    this.globalStateService.updateCart(item, true)
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
    // alert('Proceeding to checkout');
  }

  getCheckboxValue(isAll: boolean) {
    if (isAll) {
      console.log(isAll);
      this.checkAll = true
      this.isManual = false
    }
    else {
      console.log(isAll);
      this.isManual = true
      this.checkAll = false
    }
  }

  cartList(){
    this.mainService.getCartProducts().subscribe((state:any) => {
      this.cartItems = state?.data
      this.totalLength = state?.data.length
      this.totalAmount = this.cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    })
  }

  ngOnInit(): void {
    this.cartList()
    // this.globalStateService.currentState.subscribe((state) => {
    //   console.log(state.cartState, 'state.cartState');
    //   this.cartItems = state.cartState
    // })

    // console.log(JSON.parse(localStorage.getItem("tempCartItem") as string).cartState, "temp cart item");
    // this.cartItems = [
    //   {
    //     "id": 1,
    //     "name": "Test",
    //     "user_id": 39774,
    //     "description": "Test",
    //     "fix_price": "12345",
    //     "image": "https://ttoffer.com/backend/public/storage/ads_imgs/ja548k0Er-d26a3345-9659-4317-8a18-c65456acf61c1730209508.jpg",
    //     "quantity": 1
    //   },
    //   {
    //     "id": 32,
    //     "name": "Ff",
    //     "user_id": 48,
    //     "description": "Gcffff cffffff fffffff fffggg",
    //     "fix_price": "500",
    //     "image": "https://ttoffer.com/backend/public/storage/ads_imgs/iVUTFIQUv-1636d86e-a229-4801-a4d9-2681b0f0eba71730477085.jpg",
    //     "quantity": 1
    //   }
    // ]
  }
}
