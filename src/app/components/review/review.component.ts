import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule ]
})
export class ReviewComponent {
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
