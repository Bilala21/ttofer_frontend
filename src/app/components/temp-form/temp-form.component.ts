import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalStateService } from '../../shared/services/state/global-state.service';

@Component({
  selector: 'app-temp-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './temp-form.component.html',
  styleUrl: './temp-form.component.scss'
})
export class TempFormComponent {
  emailForm: FormGroup;
  error: boolean = false

  constructor(private formBuilder: FormBuilder, private stateService: GlobalStateService) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Validators for required and email
    });
  }

  handleSubmit() {
    if (this.emailForm.valid) {
      this.error = false
      const email = this.emailForm.get('email')?.value;
      fetch("https://ttoffer.com/backend/public/api/temp-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          "Accept": "application/json", // Ensure the server accepts JSON
        },
        body: JSON.stringify({ 'email': email }) // Convert the email object to a JSON string
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json(); // Convert the response to JSON
        })
        .then(data => {
          if (data.token) {
            this.stateService.updateTempToken(data.token)
            localStorage.setItem("tempToken", data.token)
            this.error = false
          }
          else {
            this.error = true
          }
        })
        .catch(error => {
          console.error('Error:', error); // Handle any errors
        });
      console.log('Email entered:', email);
    }
  }
}
