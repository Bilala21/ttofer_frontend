import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() backEvent = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage!: string;
  loading = false;

  constructor(
    private mainServices: MainServicesService,
    private extention: Extension,
    private location: Location,
    private toastr: ToastrService, // Inject ToastrService
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator() });
  }

  backButton() {
    this.backEvent.emit();
  }

  isLoading = false;

  confirmRegistration() {
    try {
      if (this.registerForm.valid) {
        this.isLoading = true; 
  
        const input = {
          name: `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`,
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          phone: this.registerForm.value.phone,
          password: this.registerForm.value.password,
          password_confirmation: this.registerForm.value.confirmPassword
        };
  
        this.mainServices.getSignUp(input).pipe(
          catchError((error) => {
            if (error.error.errors) {
              for (const field in error.error.errors) {
                if (error.error.errors[field] && error.error.errors[field].length > 0) {
                  this.toastr.error(error.error.errors[field][0], `${field.charAt(0).toUpperCase() + field.slice(1)} Error`);
                }
              }
            } else {
              this.toastr.error(error.error.message || 'An unexpected error occurred.', 'Error');
            }
            this.isLoading = false; 
            return [];
          })
        ).subscribe((res: any) => {
          if (res != null) {
            this.toastr.success('Registration successful!', 'Success');
            this.closeModalEvent.emit();
          }
          this.isLoading = false; 
        });
      } else {
        this.toastr.error('Please fill out the form correctly.', 'Form Error');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      this.toastr.error('An unexpected error occurred. Please try again.', 'Error');
      this.isLoading = false; 
    }
  }
  
  
}
export function passwordMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}