import { Component, EventEmitter, Output } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common'; // Ensure you import Location from @angular/common
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone-sign-in',
  standalone: true,
  imports:[FormsModule],
  templateUrl: './phone-sign-in.component.html',
  styleUrl: './phone-sign-in.component.scss'
})
export class PhoneSignInComponent {
  @Output() closeModalEvent = new EventEmitter<void>(); // Define event emitter
  @Output() backEvent = new EventEmitter<void>(); // Event emitter for back button


  email: string = '';
  phone: string = '';
  password: string = '';
  loading = false;
  currentUser: any = [];
  constructor(
    private mainServices: MainServicesService, private extention: Extension,
    private location: Location, private snackBar: MatSnackBar){

    }
  backButton() {
    this.backEvent.emit();
  }
 
  isFormValid(): boolean {
    return (
      this.email.trim() !== '' && this.password.trim() !== ''

    );
  }
  loginWithPhone() {
    if (this.isFormValid()) {
      this.getAuth();
    }
  }
  getAuth() {
    this.loading = true
    let input = {
      email: this.email,
      password: this.password
    }
    // this.closeModal();
    this.mainServices.getAuthByLogin(input).subscribe(res => {
      res
      localStorage.setItem('authToken', res.data.token);
      const jsonString = JSON.stringify(res.data.user);
      localStorage.setItem("key", jsonString);
      const jsonStringGetData = localStorage.getItem('key');
      this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
      this.loading = false;
      this.location.go  (this.location.path());
      window.location.reload();
      // this.closeModal()
    this.closeModalEvent.emit();

    },
    (err:any)=>{
      this.showSuccessMessage(err.error.message)
      this.loading=false
    }
  )
  }
  showSuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 100000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
