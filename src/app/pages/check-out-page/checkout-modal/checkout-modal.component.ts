import {
  Component,
  Optional,
  Inject,
  NO_ERRORS_SCHEMA,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardCvcElement,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';

@Component({
  selector: 'app-account-setting-dialoge',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss'],
})
export class CheckoutModalComponent implements AfterViewInit {
  @ViewChild('cardNumberElement') cardNumberElementRef!: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryElementRef!: ElementRef;
  @ViewChild('cardCvcElement') cardCvcElementRef!: ElementRef;
  private stripe!: Stripe;
  private elements!: StripeElements;
  cardNumberElement!: StripeCardNumberElement;
  cardExpiryElement!: StripeCardExpiryElement;
  cardCvcElement!: StripeCardCvcElement;
  private amount!: number;
  private userId!: number;

  constructor(
    private mainService: MainServicesService,
    public dialogRef: MatDialogRef<CheckoutModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    private http: HttpClient,
    private extension: Extension
  ) {
    loadStripe(
      'pk_test_51KYostE8QrqFGDryFAGuteKleAUUz2lVDCM7RWCuSPPMj4A82H1fpaYoS3Za6yE12RHpPtXqtE9FWWBN0kmGB7bk00Gu3R9WRh'
    ).then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
        this.elements = stripe.elements();
      }
    });
    console.log(this.data);
    this.amount = this.data.amount;
    this.userId = this.extension.getUserId();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close({ name: 'bilal' });
  }

  ngAfterViewInit(): void {
    if (this.cardNumberElementRef.nativeElement) {
      this.initializeStripe();
    } else {
      console.error('cardNumberElementRef is not available');
    }
  }

  initializeStripe() {
    const style: StripeCardNumberElementOptions = {
      classes: {
        base: 'px-2 rounded-2 py-15 border-1 mb-3',
      },
    };
    this.cardNumberElement = this.elements.create('cardNumber', style);
    this.cardExpiryElement = this.elements.create('cardExpiry', style);
    this.cardCvcElement = this.elements.create('cardCvc', style);

    this.cardNumberElement.mount(this.cardNumberElementRef.nativeElement);
    this.cardExpiryElement.mount(this.cardExpiryElementRef.nativeElement);
    this.cardCvcElement.mount(this.cardCvcElementRef.nativeElement);
  }

  async handlePayment() {
    const cardNumber = this.elements.getElement('cardNumber');
    console.log(cardNumber, 'cardNumber');

    if (!cardNumber) {
      console.error('Card element not found');
      return;
    }
    const paymentMethod = await this.createPaymentMethod(cardNumber);
    console.log(paymentMethod, 'paymentMethod');
    const payload = {
      user_id: this.userId,
      paymentMethod_id: paymentMethod.id,
      amount: this.amount,
    };
    this.mainService.createPaymentIntent(payload).subscribe({
      next: (res: any) => {
        const clientSecret = res.clientSecret;
        this.stripe
          .confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          })
          .then((result) => {
            if (result.error) {
              alert('Payment failed: ' + result.error.message);
            } else {
              alert('Payment successful!');
            }
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async createPaymentMethod(cardElement: any) {
    const stripe = await this.stripe;
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      throw new Error(error.message);
    }
    return paymentMethod;
  }
}
