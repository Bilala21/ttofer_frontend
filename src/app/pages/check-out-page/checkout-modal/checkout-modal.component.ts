import {
  Component,
  Optional,
  Inject,
  NO_ERRORS_SCHEMA,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import {
  Stripe,
  StripeElements,
  StripeCardCvcElement,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import { Extension } from '../../../helper/common/extension/extension';
import { StripeService } from '../../../shared/services/stripe-service.service';

@Component({
  selector: 'app-account-setting-dialoge',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatDialogModule, FormsModule, MatButtonModule, NgIf],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss'],
})
export class CheckoutModalComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('cardNumberElement') cardNumberElementRef!: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryElementRef!: ElementRef;
  @ViewChild('cardCvcElement') cardCvcElementRef!: ElementRef;
  private stripe!: Stripe;
  private elements!: StripeElements;
  cardNumberElement!: StripeCardNumberElement;
  cardExpiryElement!: StripeCardExpiryElement;
  cardCvcElement!: StripeCardCvcElement;
  private amount!: number;
  protected cardBrand: string = '';

  brands: any = {
    visa: 'assets/images/visalogo.svg',
    mastercard: 'assets/images/StripLogo.svg',
  };

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CheckoutModalComponent>,
    private toastr: ToastrService,
    private extension: Extension,
    private stripeService: StripeService
  ) {
    const { stripe, elements } = this.stripeService.getStripeInstance();
    this.stripe = stripe;
    this.elements = elements;
    this.amount = this.data.amount;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close({ name: 'bilal' });
  }

  ngAfterViewInit(): void {
    if (this.cardNumberElementRef.nativeElement && this.stripe) {
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
    this.cardNumberElement.on('change', (event) => {
      this.cardBrand = this.brands[event.brand];
    });
  }

  async handleAddCard() {
    const cardNumber = this.elements.getElement('cardNumber');
    if (!cardNumber) {
      console.error('Card element not found');
      return;
    }

    const paymentMethod = await this.createPaymentMethod(cardNumber);
    this.stripeService.savePaymentMethod(paymentMethod.id).subscribe({
      next: (res: any) => {
        if (paymentMethod.id) {
          this.toastr.success('Card save successfully');
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Card not successfully saved');
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
  ngOnDestroy(): void {
    ['cardNumber', 'cardExpiry', 'cardCvc'].forEach((type) => {
      const element = this.elements?.getElement(type as any);
      if (element) {
        element.unmount();
        element.destroy();
      }
    });
  }
}
