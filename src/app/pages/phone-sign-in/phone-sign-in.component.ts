import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import necessary classes for reactive forms
import { ToastrService } from 'ngx-toastr';
import { GlobalStateService } from '../../shared/services/state/global-state.service';

@Component({
  selector: 'app-phone-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,NgIf], // Add ReactiveFormsModule here
  templateUrl: './phone-sign-in.component.html',
  styleUrl: './phone-sign-in.component.scss'
})
export class PhoneSignInComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() backEvent = new EventEmitter<void>();
  @Output() forgetEvent = new EventEmitter<void>(); // Event emitter for back button

  phoneSignInForm!: FormGroup;  // Declare the FormGroup for the form

  loading = false;
  currentUser: any = [];

  constructor(
    private mainServices: MainServicesService,
    private fb: FormBuilder, // Inject FormBuilder
    private toaster: ToastrService,
    private globalStateService:GlobalStateService
  ) {
    // Initialize the form with validations
    this.phoneSignInForm = this.fb.group({
      phone: ['', [Validators.required,]],  // Example for phone number validation (10 digits)
      password: ['', [Validators.required,]],  // Password must be at least 6 characters long
    });
  }

  backButton() {
    this.backEvent.emit();
  }

  // Check if the form is valid
  isFormValid(): boolean {
    return this.phoneSignInForm.valid;
  }

  loginWithPhone() {
    // 
    if (this.isFormValid()) {
      this.getAuth();
    } 
  }
  openForgot(){
    this.forgetEvent.emit();
  }
  getAuth() {
    this.loading = true;
    const input = {
      phone: this.phoneSignInForm.value.phone,
      password: this.phoneSignInForm.value.password
    };
    this.mainServices.getAuthByLoginNumber(input).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('authToken', res.data.token);
        this.globalStateService.updateCurrentUser(res.data.user)
        this.globalStateService.updateState({
          authToken: res.data.token, 
        });
        this.toaster.success(res.message, 'Success');
        this.closeModalEvent.emit();
        // window.location.reload();
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

  // showErrorMessage(message: string) {
  //   this.snackBar.open(message, '', {
  //     duration: 3000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: ['error-snackbar'],
  //   });
  // }

  // showSuccessMessage(message: string) {
  //   this.snackBar.open(message, '', {
  //     duration: 3000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: ['success-snackbar'],
  //   });
  // }
}
