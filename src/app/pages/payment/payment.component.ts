import { Component, OnInit, AfterViewInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeServiceService } from '../../shared/services/stripe-service.service';
@Component({
  selector: 'app-payment',
  standalone:true,
  schemas:[NO_ERRORS_SCHEMA],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  loading = false;
  errorMessage: any | null = null;
  successMessage: string | null = null;
  constructor(private stripeService: StripeServiceService) {}
  async ngOnInit(): Promise<void> {   
    this.stripe = this.stripeService.getStripe();
    if (this.stripe) {
      this.elements = this.stripe.elements();
    }
  }
  ngAfterViewInit(): void {
    this.mountCardElement();
  }
  private mountCardElement(): void {
    if (this.elements) {
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }
  async handleForm(event: Event): Promise<void> {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    if (this.stripe && this.card) {
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        this.errorMessage = error.message;
      } else if (token) {
        this.processPayment(token, 10); 
      }
    }
    this.loading = false;
  }
  async processPayment(token: any, amount: number): Promise<void> {
    try {
      const response = await this.stripeService.processPayment(token, amount).toPromise();
      if (response) {
        this.successMessage = 'Payment successful!';
      }
    } catch (error) {
      this.errorMessage = 'Payment failed. Please try again.';
    }
  }
  pay(amount: number): void {   
    if (this.stripe && this.card) {
      this.loading = true;
      this.stripe.createToken(this.card).then(({ token, error }) => {
        if (error) {
          this.errorMessage = error.message;
        } else if (token) {
          this.processPayment(token, amount);
        }
        this.loading = false;
      });
    }
  }
}
