import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-out-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './check-out-page.component.html',
  styleUrls: ['./check-out-page.component.scss']
})
export class CheckOutPageComponent implements OnInit {
  stripe: any;
  elements: any;
  card: any;
  paymentHandler: any = null;
  stripeAPIKey: string = 'pk_test_51O7mVXJayAXqf3Vq8gnj64IGw9woyYdaSUTgkdh07uYy22MN6qg8VEMzJZvhdV4HnANed3rqsN4crMBBy6CkH8eo00u6HHRwj0'
  // // 
  
  // 'pk_test_51KYostE8QrqFGDryFAGuteKleAUUz2lVDCM7RWCuSPPMj4A82H1fpaYoS3Za6yE12RHpPtXqtE9FWWBN0kmGB7bk00Gu3R9WRh';

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
    { img: 'assets/images/Applelogo.svg', detail1: 'Apple Pay', id: 'paymentApplePay' },
    { img: 'assets/images/visalogo.svg', detail1: 'Visa', id: 'paymentVisa' },
    { img: 'assets/images/StripLogo.svg', detail1: 'Mastercard', id: 'paymentMastercard' },
    { img: 'assets/images/GPay.svg', detail1: 'Google Pay', id: 'paymentGooglePay' }
  ];

  cartItems: any[] = [
    { title: 'Diamond of Expo', description: '2.07 CTW Round Cut Lab Created Diamond', price: 1385.00, imageUrl: '/assets/images/silder-1.jpg', seller: 'Diamond Expo', rating: 4.5 },
    { title: 'Sage Designs L.A.', description: 'Lab Grown Oval Diamond Engagement Ring', price: 1799.00, imageUrl: '/assets/images/silder-2.jpg', seller: 'Sage Designs L.A.', rating: 4.8 }
  ];

  quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  ngOnInit() {
    this.invokeStripe();
  }

  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Stripe token generated!');
      }
    });

    paymentHandler.open({
      name: 'ttoffer.com',
      description: 'This is for Testing',
      amount: amount * 100
    });
  }
  trackById(index: number, item: any): any {
    return item.id; // Use item.id if your items have a unique id property
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successful!');
          }
        });
      };
      window.document.body.appendChild(script);
    }
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

