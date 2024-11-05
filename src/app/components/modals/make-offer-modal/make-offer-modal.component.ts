import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-make-offer-modal',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,NgIf],
  templateUrl: './make-offer-modal.component.html',
  styleUrls: ['./make-offer-modal.component.scss'] // Corrected to `styleUrls`
})
export class MakeOfferModalComponent {
  showConfirmModal: boolean = false;
  offerForm: FormGroup;
  router = inject(Router); // Correct way to inject Router in standalone component

  constructor(private fb: FormBuilder) {
    this.offerForm = this.fb.group({
      offer_price: ['', [Validators.required]],
      description: [''],
    });
  }

  handleFirstStep() {
    this.showConfirmModal = !this.showConfirmModal;
  }

  onSubmit(): void {
    this.showConfirmModal = !this.showConfirmModal;
    if (this.offerForm.valid) {
      // Handle form submission, e.g., navigate or send data to the server
      console.log('Form submitted successfully', this.offerForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
