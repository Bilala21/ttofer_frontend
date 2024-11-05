import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';

@Component({
  selector: 'app-make-offer-modal',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './make-offer-modal.component.html',
  styleUrls: ['./make-offer-modal.component.scss']
})
export class MakeOfferModalComponent implements OnInit {
  showConfirmModal: boolean = false;
  isFinalStep: boolean = false;
  offerForm: FormGroup;
  router = inject(Router);

  constructor(private fb: FormBuilder, private globalStateService: GlobalStateService) {
    this.offerForm = this.fb.group({
      offer_price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$')
        ]
      ],
      description: [''],
    });
  }

  handleFirstStep() {
    this.showConfirmModal = !this.showConfirmModal;
  }

  onSubmit(): void {
    this.offerForm.markAllAsTouched();

    if (this.offerForm.valid) {
      this.isFinalStep = true;
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal() {
    this.isFinalStep = false
    this.globalStateService.setOfferModal(false)
    this.offerForm.reset()
  }
  finalStemSubmit() {
    this.closeModal()
  }
  ngOnInit(): void {
    this.globalStateService.currentState.subscribe((state) => {
      this.showConfirmModal = state.offerModal
    })
  }
}
