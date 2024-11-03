import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-out-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './check-out-page.component.html',
  styleUrl: './check-out-page.component.scss'
})
export class CheckOutPageComponent {
  paymentMethod: string = '';
  orderTotal: number = 3681.24;
  itemTotal: number = 3186.00;
  itemDescription: string = '2.07 CT H VS2 Round Cut Lab Created Diamond Halo Engagement Ring 14K White Gold';
  quantity: number = 1;
  shippingAddress = {
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  };
  paymentDeposit: any[] = [
    {
      img: 'assets/images/Applelogo.svg',
      detail1: 'Apply Pay',
      detail2: 'Default',
      id: 'flexRadioDefault1',
    },
    {
      img: 'assets/images/visalogo.svg',
      detail1: 'Visa',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
    {
      img: 'assets/images/StripLogo.svg',
      detail1: 'Mastercard',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
    {
      img: 'assets/images/GPay.svg',
      detail1: 'Google Pay',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
  ];
  cartItems = [
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
  quantities = Array.from({ length: 10 }, (_, i) => i + 1);
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
}

