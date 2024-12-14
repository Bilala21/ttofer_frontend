import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GlobalStateService } from '../../shared/services/state/global-state.service';

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
  @Output() forgetEvent = new EventEmitter<void>(); // Event emitter for back button
  constructor(
    private mainServices: MainServicesService,
    private toaster: ToastrService,private globalStateService:GlobalStateService
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
  backButton() {
    this.backEvent.emit();
  }
 openForgot(){
    this.forgetEvent.emit();
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
  getAuth() {
    this.loading = true;
    const input = this.emailForm.value;
    this.mainServices.getAuthByLogin(input).subscribe({
      next: (res) => {
        this.loading = false;
          const token = res.data.token;
        const user = res.data.user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('key', JSON.stringify(user));
        this.globalStateService.updateCurrentUser(user);

          this.globalStateService.updateState({
          authToken: token, 
        });
          this.toaster.success('You are logged in successfully', 'Success');
        this.closeModalEvent.emit();
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'An error occurred during login';
        this.toaster.error(errorMessage, 'Error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
}
