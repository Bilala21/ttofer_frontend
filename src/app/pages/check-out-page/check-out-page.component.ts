import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutModalComponent } from './checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-check-out-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CardShimmerComponent,
    NgFor,
  ],
  templateUrl: './check-out-page.component.html',
  styleUrl: './check-out-page.component.scss',
})
export class CheckOutPageComponent {
  cartItems: any[] = [];
  totalAmount: number = 0;
  totalLength: number = 0;
  isAllChecked: boolean = false;
  loading = true;
  userId;
  paymentMethod: string = '';
  itemDescription: string =
    '2.07 CT H VS2 Round Cut Lab Created Diamond Halo Engagement Ring 14K White Gold';
  quantity: number = 1;

  constructor(
    private mainService: MainServicesService,
    private extension: Extension,
    private toastr: ToastrService,
    private globalStateService: GlobalStateService,
    public dialog: MatDialog,
    private mainServices: MainServicesService
  ) {
    this.userId = extension.getUserId();
  }

  shippingAddress = {
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  };

  paymentDeposit: any[] = [
    {
      img: 'assets/images/Applelogo.svg',
      detail1: 'Apple Pay',
      id: 'paymentApplePay',
    },
    {
      img: 'assets/images/visalogo.svg',
      detail1: 'Visa',
      id: 'paymentVisa',
    },
    {
      img: 'assets/images/StripLogo.svg',
      detail1: 'Mastercard',
      id: 'paymentMastercard',
    },
    {
      img: 'assets/images/GPay.svg',
      detail1: 'Google Pay',
      id: 'paymentGooglePay',
    },
  ];

  trackById(index: number, item: any): number {
    return item.id;
  }

  openNewCardModal() {
    const modal = document.getElementById('newCardModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CheckoutModalComponent, {
      width: '500px',
      data: { amount: this.totalAmount },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  closeNewCardModal() {
    const modal = document.getElementById('newCardModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((acc, item) => {
      return item.product.is_should_buy
        ? acc + item.product.fix_price * item.product.quantity
        : acc;
    }, 0);
    this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
  }

  getCartItems() {
    if (!this.cartItems.length) {
      this.loading = true;
      this.mainService.getCartProducts(this.userId).subscribe({
        next: (value: any) => {
          this.cartItems = value.data.filter(
            (item: any) => item.product.is_should_buy
          );
          this.loading = false;
          this.totalLength = this.cartItems.length;
          this.calculateTotal();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetching cart products', err);
        },
      });
    }
  }

  ngOnInit() {
    this.loading = true;
    this.globalStateService.currentState.subscribe((state) => {
      this.cartItems = state.cartState.filter(
        (item: any) => item.product.is_should_buy
      );
      if (this.cartItems.length) {
        this.loading = false;
        this.totalLength = this.cartItems.length;
        this.calculateTotal();
      }
    });
    this.getCartItems();
  }
}
