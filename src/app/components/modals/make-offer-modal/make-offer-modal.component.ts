import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { CountdownTimerService } from '../../../shared/services/countdown-timer.service';
import { Subscription } from 'rxjs';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-make-offer-modal',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf,NgFor],
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
  highBid:any
  bidPrice:any
  liveBidsSubscription:any
  liveAuction:any
  highestBid:any
  @Input() product: any
   forPercentageBid = [
    {
    id:1,
    percentage:20
   },
   {
    id:2,
    percentage:40
   },
   {
    id:3,
    percentage:60
   }
  ]
  constructor(private extension:Extension,private fb: FormBuilder, private globalStateService: GlobalStateService, private cdr: ChangeDetectorRef,private mainServices:MainServicesService,
    private countdownTimerService: CountdownTimerService,private toastr: ToastrService,) {
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
    this.bidForm = this.fb.group({
      bid_price: [
        '',
        [
            Validators.required,
            this.bidCheckValidator.bind(this) // Custom validator
          ],
      ]
    });
  }
    // Custom validator to check bid price
    bidCheckValidator(control: any) {
      if (!control.value) return null; // No error if the field is empty
      return control.value >= (this.calculatePercentageIncrease((this.highBid || this.product.auction_final_price),20))
        ? null
        : { 'bid-check': true };
    }

  getHighBid(ProductId:any){
if(this.product.product_type == 'auction'){
  this.mainServices.getHighBid({product_id:ProductId}).subscribe({
    next:(res:any)=>{
      this.globalStateService.setHighestBid(res.data.price)
      console.log("res",res.data.price)
      this.highestBid = this.globalStateService.hightBids$.subscribe(
        (highestBid) => {
          this.highBid = highestBid;
        }
      );
    },
    error:(err:any)=>{
      this.toastr.error(
        err.message,
              'error'
            );
    }
  })
}
  }

  calculatePercentageIncrease(baseValue:any, percentage:any) {
      const data = baseValue + (baseValue * (percentage / 100));
      return Math.trunc(data)
  }

  ngOnInit(): void {
    if (this.product.product_type == 'auction') {
      this.getHighBid(this.product.id)
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

  setBidPrice(price: number): void {
    console.log("price",price)
    if (this.bidForm && this.bidForm?.get('bid_price')) {
      this.bidForm?.get('bid_price')?.setValue(price); 
      }
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
          this.toastr.success(
            `Bid Placed for AED ${input.price} successfully`,
            'Success'
          );
          this.closeModal('close-modal')
          this.getBid()
          this.getHighBid(this.product.id)
          // this.getHighBid(this.product.id)
        },
        error: (err: any) => {
          this.closeModal('close-modal')
          const errorMessage =
            err?.errors?.message ||
            'Failed to place bid. Please try again later.';
          this.toastr.error(errorMessage, 'Error');
          // this.loading = false;
          console.error("error1",err.errors.price);
        },
      });
    } catch (error) {
    }
  }

  startCountdowns() {
    
    const datePart = this.product.auction_ending_date.split('T')[0];
    const endingDateTime = `${datePart}T${this.product.auction_ending_time}.000Z`;
    const subscription = this.countdownTimerService
      .startCountdown(endingDateTime)
      .subscribe((remainingTime) => {
        this.product.calculateRemaningTime = remainingTime;
        this.cdr.detectChanges();
      });

    this.countdownSubscriptions.push(subscription);
  }

  getBid() {
    let input = {
      product_id: this.product.id,
    };
    this.mainServices.getPlacedBids(input).subscribe((res: any) => {
      this.globalStateService.setLiveBids(res.data)
    });
  }
 
}