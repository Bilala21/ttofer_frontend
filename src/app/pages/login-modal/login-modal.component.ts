import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, of, Subscription } from "rxjs";
import { LookupService } from "../../shared/services/lookup/lookup.service";
import { MainServicesService } from "../../shared/services/main-services.service";
import { NavigationEnd, Router } from "@angular/router";
import { Extension } from "../../helper/common/extension/extension";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../shared/services/authentication/Auth.service";
import { EmailSignInComponent } from "../email-sign-in/email-sign-in.component";
import { PhoneSignInComponent } from "../phone-sign-in/phone-sign-in.component";
import { RegisterComponent } from "../register/register.component";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, EmailSignInComponent, PhoneSignInComponent, RegisterComponent,ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  showResetpassword:any=false
  isMenuDropdownOpen = false;
  @ViewChild('inputFields')
  isMobileMenuVisible: boolean = false;
  inputFields: ElementRef[] = [];
  showEmailBox: boolean = false;
  showMainBox: boolean = false;
  showRegisterBox: boolean = false;
  showForgotBox: boolean = false;
  showForgotPhoneBox: boolean = false;
  showOTPBox: boolean = false;
  showPhoneBox: boolean = false;
  isMobileMenuOpen = false;
  isMoreMenuOpen = false;
  featuredProducts: any;
  image: any
  showCarousel: boolean = true;
  showBanner: boolean = true;
  hideHeader: boolean = true;
  email: string = '';
  phone: string = '';
  password: string = '';
  otp: string[] = ['', '', '', '', '', ''];
  otpVerify: number = 0
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  emailOrPhone: string = '';
  confirmPassword: string = '';
  openMenu: boolean = false;
  currentUser: any = [];
  imgUrl: any;
  onlineCount: number = 0;
  dropdownVisible = false;
  phoneNumber:any
  private intervalId: any;
  loading = false;
  errorMessage!:string;
  emailForForgotPassword:any
  resetPassword!:FormGroup;
  resending:boolean=false
  private modalSubscription!: Subscription;
  @ViewChild('loginModal') loginModal!: ElementRef;
  @ViewChildren('otpField') otpFields!: QueryList<ElementRef>;
  constructor(
    private router: Router, private mainServices: MainServicesService, private extention: Extension,private toastr:ToastrService,
    private snackBar: MatSnackBar,
    private authService: AuthService) {
   this.authService.openModal$.subscribe((result:any) => {
      this.openLoginModal();
    });
  }
  updateOnlineCount() {
    const min = 700;
  const max = 13000;
  this.onlineCount = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
  ngOnInit() {
    this.resetPassword = new FormGroup({
      email: new FormControl({ value: '', disabled: true }),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required])
    }); 
  }
  onSubmit() {
    if (this.phone && this.password) {     
    }
  }
   openLoginModal() {
    const modal = this.loginModal.nativeElement; 
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = '';
      document.body.appendChild(backdrop);
      document.body.style.overflow = 'hidden';
    }
  }
  openMobileMenu() {
    this.openMenu = !this.openMenu
  }
  resetForm() {
    this.email = '';
    this.phone = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.emailOrPhone = '';
    this.confirmPassword = '';
  }
  verifyOTP() {
    const otp = this.getOtpValue();
    if (otp.length === this.otpInputs.length) {
      const payload = {
        otp:otp,
        email: this.emailForForgotPassword,
      };
   this.loading=true
      this.mainServices.otpVerify(payload).subscribe(
        (response:any) => {
          this.toastr.success(response.msg, 'Success');
          this.loading=false
          this.resetPassword.get('email')?.setValue(this.emailForForgotPassword);
          this.showResetpassword = true;
          this.showOTPBox = false;
          this.showForgotPhoneBox = false;
          this.showForgotBox = false;
          this.showEmailBox = false;
          this.showPhoneBox = false;
          this.showRegisterBox = false;
        },
        (error) => {
          this.loading=false
          this.toastr.error(error.error.msg, 'Error');
        }
      );
    } else {
    }
  }
  isFormValidforgot(): boolean {
    return this.resetPassword.valid;
  }
  forgotPasswordChange() {
    this.loading = true;
    this.resetPassword.get('email')?.enable();
    const formData = this.resetPassword.value;
      this.mainServices.newPassword(formData).subscribe(
        (response:any) => {
          this.toastr.success(response.msg, 'Success');
          this.loading = false;
          this.showResetpassword = false;
          this.showOTPBox = false;
          this.showForgotPhoneBox = false;
          this.showForgotBox = false;
          this.showEmailBox = false;
          this.showPhoneBox = false;
          this.showRegisterBox = false;
        },
        (error) => {
          this.toastr.error(error.error.msg, 'Error');
          this.loading = false;
        }
      );
  }
  focusNextInput(index: number) {
    if (index < this.otp.length - 1 && this.otp[index].trim() !== '') {
      this.inputFields[index + 1].nativeElement.focus();
    }
  }
  signIn() {
    if (this.isFormValid()) {
     
    }
  }
  ValidFor(): boolean {
    return (
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.username.trim() !== '' &&
      this.emailOrPhone.trim() !== '' &&
      this.password.trim() !== '' &&
      this.confirmPassword.trim() !== '' &&
      this.confirmPassword == this.password
    )
  }
  isFormValid(): boolean {
    return (
      this.email.trim() !== '' && this.password.trim() !== ''
    );
  }
  confirmRegistration() {
    let input = {
      name: this.firstName + this.lastName,
      username: this.username,
      email: this.emailOrPhone,
      password: this.password
    }
    this.mainServices.getSignUp(input).pipe(
      catchError((error) => {
        this.errorMessage = error.error.message.username!=undefined ?error.error.message.username[0]:error.error.message.password!=undefined?error.error.message.password[0]:error.error.message ;
        return '';
      })
    ).subscribe((res: any) => {
      if (res != null) {
          this.showRegisterBox = false;
          this.showSuccessMessage("Account Registered Successfully");
      }
    });
  }
  googleSignIn() {
    this.authService.signInWithGoogle().subscribe({
      next: (result:any) => {
        // 
        const user = result.user;
        if (user) {
          let input = {
            name: user.displayName,
            username: user.email?.split('.com')[0],
            email: user.email,
            password: user.email
          }
          this.googleAccountRegister(input,user);
        }
      },
      error: (error:any) => {
        console.error('Error signing in:', error);
      }
    });
  }
  googleAccountRegister(input: any,user:any) {
    this.mainServices.getSignUp(input).pipe(
      catchError((error: any) => {
        if (error.error.message === "Email address already taken.") {
          let loginInput = {
            email: user.email,
            password: user.email
          }
          this.Login(loginInput);
        }
        else{
          this.showSuccessMessage(error.error.error)
          this.loading=false;
        }
        return of(null);
      })
    ).subscribe((res:any) => {
      if (res != null) {
        let loginInput = {
          email: user.email,
          password: user.password
        }
        this.Login(loginInput);
      }
    });
  }
  Login(loginInput: any) {
    this.mainServices.getAuthByLogin(loginInput).pipe(
      catchError((error: any) => {
        this.showSuccessMessage(error.error.error)
      this.loading=false
        return of(null);
      })
    ).subscribe((res:any) => {
      if (res) {
        localStorage.setItem('authToken', res.data.token);
        const jsonString = JSON.stringify(res.data.user);
        localStorage.setItem("key", jsonString);
        const jsonStringGetData = localStorage.getItem('key');
        this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
        this.loading = false;
        window.location.reload();
        this.closeModal();
      }
    });
  }
  isDropdownOpen = false;
  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }
  toggleDropdown1(event: MouseEvent) {
    this.dropdownVisible = !this.dropdownVisible;
    event.stopPropagation();
  }
  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    if (this.isDropdownOpen && !this.isClickInsideDropdown(event)) {
      this.isDropdownOpen = false;
    }
    if (this.dropdownVisible && !this.isClickInsideDropdown(event)) {
      this.dropdownVisible=false;
    }
  }
  backButton(){
    this.showRegisterBox=false;
    this.showPhoneBox=false;
    this.showEmailBox=false;
    this.showForgotPhoneBox=false;
    this.showForgotBox=false;
    this.showOTPBox=false;
    this.showResetpassword=false;
  }
  forgotPhoneBack(){
    this.showRegisterBox=false;
    this.showPhoneBox=true;
    this.showEmailBox=false;
    this.showForgotPhoneBox=false;
    this.showForgotBox=false;
    this.showOTPBox=false;
    this.showResetpassword=false;
  }
  forgotEmailBack(){
    this.showRegisterBox=false;
    this.showPhoneBox=false;
    this.showEmailBox=true;
    this.showForgotPhoneBox=false;
    this.showForgotBox=false;
    this.showOTPBox=false;
    this.showResetpassword=false;
  }
  private isClickInsideDropdown(event: MouseEvent): boolean {
    const dropdownElement = document.querySelector('.dropdown-menu');
    return dropdownElement?.contains(event.target as Node) || false;
  }
  checkRoute(url: string): void {
    if (url === '/productDetails') {
      this.showCarousel = false;
    }
    else
     if (url === '/profilePage') {
      this.showBanner = false;
      this.showCarousel = false;
      this.hideHeader = false;
    }
    else
     if (url === '/chatBox') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else if (url === '/selling') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else if (url === '/whoBoughtAd') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else
     if (url === '/reviewPage') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else if (url === '/auctionProduct') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else if (url === '/auctionUserProfile') {
      this.showBanner = false;
      this.showCarousel = false;
    }
    else {
      this.showBanner = true;
      this.showCarousel = true;
      this.hideHeader = true;
    }
  }
  showSuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 100000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
  getAuth() {
    this.loading = true
    let input = {
      email: this.email,
      password: this.password
    }
    this.closeModal();
    this.mainServices.getAuthByLogin(input).subscribe(res => {
      res
      localStorage.setItem('authToken', res.data.token);
      const jsonString = JSON.stringify(res.data.user);
      localStorage.setItem("key", jsonString);
      const jsonStringGetData = localStorage.getItem('key');
      this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
      this.loading = false;
      window.location.reload();
      this.closeModal()
    },
    (err:any)=>{
      this.showSuccessMessage(err.error.message)
      this.loading=false
    }
  )
  }
  getAuthPhone() {
    this.loading = true
    let input = {
      phone: this.phone,
      password: this.password
    }
    this.closeModal();
    this.mainServices.loginWithPhone(input).subscribe((res:any) => {
      res
      localStorage.setItem('authToken', res.data.token);
      const jsonString = JSON.stringify(res.data.user);
      localStorage.setItem("key", jsonString);
      const jsonStringGetData = localStorage.getItem('key');
      this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
      this.loading = false
    },
    (err:any)=>{

      this.showSuccessMessage(err.error.message)
      this.loading=false
    }
  )
  }
  openEmail() {
  this.showEmailBox = true
  }
  openRegister() {
    this.showRegisterBox = true
  }
  openOTP() {
    let input = {
      email:this.emailForForgotPassword
    }
    this.loading=true
    this.mainServices.forgetPassword(input).subscribe((res:any) => {
      this.loading=false
      this.otpVerify = res.otp
      this.toastr.success(res.message, 'Success');
      this.showOTPBox = true
      this.showForgotPhoneBox = false
      this.showForgotBox = false
    },
    (err:any)=>{
      // 
      this.toastr.error(err.error.errors?.email?.[0] || 'An error occurred', 'Error');
      this.loading = false
    }
  )
  }
  resendCodeToEmail(){
    let input = {
      email:this.emailForForgotPassword
    }
    this.resending=true
    this.mainServices.forgetPassword(input).subscribe((res:any) => {
      this.resending=false
      this.otpVerify = res.otp
      this.toastr.success(res.message, 'Success'); 
    },
    (err:any)=>{
      // 
      this.toastr.error(err.error.errors?.email?.[0] || 'An error occurred', 'Error');
      this.resending = false
    }
  )
  }
  openOTPNumber(){
    let input = {
      phone:this.phoneNumber
    }
    this.loading=true
    this.mainServices.forgetPasswordNumber(input).subscribe((res:any) => {
      this.loading=false
      this.otpVerify = res.otp
      this.toastr.success(res.msg, 'Success');
      this.showOTPBox = true
      this.showForgotPhoneBox = false
      this.showForgotBox = false
    },
    (err:any)=>{
      // 
      this.toastr.error(err.error.msg, 'Error');
      this.loading = false
    }
  )
  }
  openForgot() {
    this.showForgotPhoneBox = true
    this.showPhoneBox = false
  }
  openForgotEmail() {
    // 
    this.showForgotBox = true
    this.showEmailBox = false
  }
  back() {
  }
  openPhone() {
    this.showPhoneBox = true
  }
  openModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = '';
      document.body.appendChild(backdrop);
    }
  }
  closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      this.showEmailBox = false;
      this.showMainBox = false;
      this.showRegisterBox = false;
      this.showPhoneBox = false;
      this.showForgotBox = false;
      this.showOTPBox = false;
      this.showForgotPhoneBox=false;
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
      this.resetForm();
    }
    document.body.style.overflow = 'auto'
  }
  userInfo() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jsonStringGetData = localStorage.getItem('key');
      this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
      this.imgUrl = this.currentUser.img;
    } else {
      this.currentUser = [];
      this.imgUrl = null;
      console.warn('localStorage is not available.');
    }
  }
  signInWithEmail() {
    if (this.isFormValid()) {
      this.getAuth();
    }
  }
  loginWithPhone() {
    if (this.isFormValid()) {
      this.getAuth();
    }
  }
  navigateToProfilePage(userId: string) {
    this.router.navigate([`/profilePageBy/${userId}/addPost`]);
  }
  logout() {
    this.loading = true;
    localStorage.clear();
    this.authService.signOut();
    this.router.navigate(['/body']).then(() => {
        window.location.reload();
    });
    this.loading = false;
}
otpInputs: any[] = new Array(6).fill('');
onInputChange(event: any, index: number) {
  const input = event.target;
  if (input.value.length === 1) {
    const nextInput = this.otpFields.toArray()[index + 1];
    nextInput?.nativeElement.focus();
  }
}
onBackspace(event: any, index: number) {
  const input = event.target;
  if (input.value.length === 0 && index > 0) {
    const previousInput = this.otpFields.toArray()[index - 1];
    previousInput?.nativeElement.focus();
  }
}
onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text') || '';
  this.otpFields.forEach((field, index) => {
    field.nativeElement.value = pastedData[index] || '';
  });
  const lastFilledField = this.otpFields.toArray()[
    Math.min(pastedData.length, this.otpInputs.length) - 1
  ];
  lastFilledField?.nativeElement.focus();
}
getOtpValue(): string {
  return this.otpFields.toArray().map(field => field.nativeElement.value).join('');
}

}
