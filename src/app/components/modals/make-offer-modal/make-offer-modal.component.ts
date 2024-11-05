import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { CountdownTimerService } from '../../../shared/services/countdown-timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-make-offer-modal',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './make-offer-modal.component.html',
  styleUrls: ['./make-offer-modal.component.scss']
})
export class MakeOfferModalComponent implements OnInit {
  showConfirmModal: string = "";
  countdownSubscriptions: Subscription[] = [];
  isFinalStep: boolean = false;
  offerForm: FormGroup;
  bidForm: FormGroup;
  router = inject(Router);
  @Input() product: any

  constructor(private fb: FormBuilder, private globalStateService: GlobalStateService, private cdr: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService) {
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

  closeModal() {
    this.isFinalStep = false
    this.globalStateService.setOfferModal("")
    this.offerForm.reset()
    this.bidForm.reset()
  }
  finalStemSubmit() {
    this.closeModal()
  }

  startCountdowns() {
    const datePart = this.product.ending_date.split('T')[0];
    const endingDateTime = `${datePart}T${this.product.ending_time}:00.000Z`;

    const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
      this.product.calculateRemaningTime = remainingTime;
      this.cdr.detectChanges();
    });

    this.countdownSubscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.startCountdowns()
    this.globalStateService.currentState.subscribe((state) => {
      this.showConfirmModal = state.offerModal
    })
  }
}
