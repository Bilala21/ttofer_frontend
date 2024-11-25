import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { CountdownTimerService } from '../../../shared/services/countdown-timer.service';
import { Subscription } from 'rxjs';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';

@Component({
  selector: 'app-make-offer-modal',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './make-offer-modal.component.html',
  styleUrls: ['./make-offer-modal.component.scss']
})
export class MakeOfferModalComponent implements OnInit {
  showConfirmModal: string = "";
  currentUserId:any;
  productId:any
  countdownSubscriptions: Subscription[] = [];
  isFinalStep: boolean = false;
  offerForm: FormGroup;
  bidForm: FormGroup;
  router = inject(Router);
  liveBids:any
  @Input() product: any

  constructor(private extension:Extension,private fb: FormBuilder, private globalStateService: GlobalStateService, private cdr: ChangeDetectorRef,private mainServices:MainServicesService,
    private countdownTimerService: CountdownTimerService) {
      this.currentUserId=this.extension.getUserId()
    this.offerForm = this.fb.group({
      offer_price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$')
        ]
      ],
      bid_price: [''],
      description: [''],
    });
    this.bidForm = this.fb.group({
      bid_price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$')
        ]
      ]
    });
  }
  ngOnInit(): void {
   
    if (this.product.product_type == 'auction') {
      this.startCountdowns()
    }
    this.globalStateService.currentState.subscribe((state:any) => {
      
      this.showConfirmModal = state.offerModal;
      this.liveBids=state.liveBids
    })
  }
  handleFirstStep() {
    this.showConfirmModal = "";
  }

  onSubmit(): void {
    if (this.showConfirmModal == 'offer') {
      this.offerForm.markAllAsTouched();
      if (this.offerForm.valid) {
        this.isFinalStep = true;
      }

      else {
        console.log('Form is invalid');
      }
    }
    else {
      this.bidForm.markAllAsTouched();
      if (this.bidForm.valid) {
        this.isFinalStep = true;
      }

      else {
        console.log('Form is invalid');
      }
    }
  }

  closeModal(event: any) {
    if (event === 'close-modal' || event.target.classList.contains('close-modal')) {
      this.isFinalStep = false
      this.globalStateService.setOfferModal("")
      this.offerForm.reset()
      this.bidForm.reset()
    }

  }
  finalStemSubmit() {
  }
  placeBid() { 
    const input = {
      user_id: this.currentUserId,
      product_id: this.product.id,
      price: this.bidForm.value.bid_price,
    };
    try {
      this.mainServices.placeBid(input).subscribe({
        next: (res: any) => {
          
          // this.toastr.success(
          //   `Bid Placed for AED ${input.price} successfully`,
          //   'Success'
          // );
          this.closeModal('close-modal')

         
        },
        error: (err: any) => {
          // const errorMessage =
          //   err?.error?.message ||
          //   'Failed to place bid. Please try again later.';
          // this.toastr.error(errorMessage, 'Error');
          // this.loading = false;
          // console.error(err);
        },
      });
    } catch (error) {
      // this.toastr.error(
      //   'An unexpected error occurred. Please try again later.',
      //   'Error'
      // );
      // this.loading = false;
    }
  }
  startCountdowns() {
    
    const datePart = this.product.auction_ending_date.split('T')[0];
    const endingDateTime = `${datePart}T${this.product.auction_ending_time}.000Z`;
    console.log(endingDateTime)

    const subscription = this.countdownTimerService
      .startCountdown(endingDateTime)
      .subscribe((remainingTime) => {
        this.product.calculateRemaningTime = remainingTime;
        this.cdr.detectChanges();
      });

    this.countdownSubscriptions.push(subscription);
  }


 
}