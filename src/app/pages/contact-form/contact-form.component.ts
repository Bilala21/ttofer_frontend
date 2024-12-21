import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getter to access form controls safely
  get f() {
    return this.contactForm;
  }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    // Handle form submission logic here
    //('Form Submitted', this.contactForm.value);

    // Reset the form after submission if desired
    this.contactForm.reset();
    this.submitted = false;
  }
}
