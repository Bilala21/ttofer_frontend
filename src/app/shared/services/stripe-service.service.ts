import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { MainServicesService } from './main-services.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private elements!: StripeElements;
  private stripe!: Stripe;

  constructor(private mainServices: MainServicesService) {
    loadStripe(
      'pk_test_51KYostE8QrqFGDryFAGuteKleAUUz2lVDCM7RWCuSPPMj4A82H1fpaYoS3Za6yE12RHpPtXqtE9FWWBN0kmGB7bk00Gu3R9WRh'
    ).then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
        this.elements = stripe.elements();
      }
    });
  }

  createSetupIntent() {
    return this.mainServices.createSetupIntent();
  }

  savePaymentMethod(paymentMethodId: string) {
    return this.mainServices.savePaymentMethod(paymentMethodId);
  }
  getCustomerCards(id:number) {
    return this.mainServices.getCustomerCards(id);
  }

  chargeCustomer(payload:any) {
    return this.mainServices.chargeCustomer(payload);
  }

  getStripeInstance() {
    return { stripe: this.stripe, elements: this.elements };
  }
}
