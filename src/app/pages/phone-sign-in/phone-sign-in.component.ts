import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import necessary classes for reactive forms
import { ToastrService } from 'ngx-toastr';

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

  phoneSignInForm!: FormGroup;  // Declare the FormGroup for the form

  loading = false;
  currentUser: any = [];

  constructor(
    private mainServices: MainServicesService,
    private snackBar: MatSnackBar,private toastr:ToastrService,
    private location: Location,
    private fb: FormBuilder // Inject FormBuilder
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
    debugger
    if (this.isFormValid()) {
      this.getAuth();
    } 
  }

  getAuth() {
    this.loading = true;
    const input = {
      phone: this.phoneSignInForm.value.phone,
      password: this.phoneSignInForm.value.password
    };
    this.mainServices.getAuthByLoginNumber(input).subscribe(
      (res) => {
        localStorage.setItem('authToken', res.data.token);
        const jsonString = JSON.stringify(res.data.user);
        localStorage.setItem('key', jsonString);
        const jsonStringGetData = localStorage.getItem('key');
        this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
        this.loading = false;
        this.location.go(this.location.path());
        // window.location.reload();
        this.closeModalEvent.emit();
      },
      (err: any) => {
        this.showErrorMessage(err.error.message);
        this.loading = false;
      }
    );
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}
