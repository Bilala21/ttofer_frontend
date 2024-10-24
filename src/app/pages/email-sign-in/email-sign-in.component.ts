import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './email-sign-in.component.html',
  styleUrl: './email-sign-in.component.scss'
})
export class EmailSignInComponent {
  emailForm: FormGroup;
  loading: boolean = false;

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() backEvent = new EventEmitter<void>();

  constructor(
    private mainServices: MainServicesService,
    private location: Location,
    private toaster: ToastrService
  ) {
    // Initialize the reactive form
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  backButton() {
    this.backEvent.emit();
  }

  isFormValid(): boolean {
    return this.emailForm.valid;
  }

  signInWithEmail() {
    if (this.isFormValid()) {
      this.getAuth();
    } else {
      this.toaster.error('Please enter valid details.', 'Invalid Input');
    }
  }
//rana haroon code//
  getAuth() {
    this.loading = true;
    const input = this.emailForm.value;
  
    this.mainServices.getAuthByLogin(input).subscribe({
      next: (res) => {
        this.loading = false;
        // Storing token and user details in local storage
        localStorage.setItem('authToken', res.data.token);
        const jsonString = JSON.stringify(res.data.user);
        localStorage.setItem("key", jsonString);
        
        // Showing success message
        this.toaster.success('You are logged in successfully', 'Success');
        
        // Emitting event to close the modal
        this.closeModalEvent.emit();
        
        // Reloading the page
        window.location.reload();
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'An error occurred during login';
        this.toaster.error(errorMessage, 'Error');
      },
      complete: () => {
        this.loading=false;
      }
    });
  }
  
}
