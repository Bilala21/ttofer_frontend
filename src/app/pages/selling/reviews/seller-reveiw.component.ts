import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../components/selling/card/card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-seller-reveiw',
  standalone: true,
  templateUrl: './seller-reveiw.component.html',
  styleUrl: './seller-reveiw.component.scss',
  imports: [RouterLink, NgFor, CardComponent, NgIf, NgFor,ReactiveFormsModule]
})

export class SellerReveiwComponent {
  reviewForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      rating: [0, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reviewForm.valid) {
       //('Review Submitted:', this.reviewForm.value);
      // Perform further actions (e.g., API call)
      this.reviewForm.reset();
      this.submitted = false;
    }
  }
  

  
}
