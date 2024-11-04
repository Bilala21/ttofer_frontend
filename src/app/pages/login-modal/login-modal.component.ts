import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
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

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, EmailSignInComponent, PhoneSignInComponent, RegisterComponent],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
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
  private intervalId: any;
  loading = false;
  currentUserId:string="";
  errorMessage!:string;
  private modalSubscription!: Subscription;
  // categories! : category []
  @ViewChild('loginModal') loginModal!: ElementRef;
  constructor(
    private router: Router, private mainServices: MainServicesService, private extention: Extension,
    private snackBar: MatSnackBar,
    private authService: AuthService) {
    // this.inputFields = new Array(6);
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.checkRoute(event.url);
    //   }
    // });
    // 
    this.currentUserId = extention.getUserId();
    // 
   this.authService.openModal$.subscribe((result:any) => {
      this.openLoginModal();
    });
  }

  updateOnlineCount() {
    // this.onlineCount = Math.floor(Math.random() * 100);
    const min = 700;
  const max = 13000;
  this.onlineCount = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
  ngOnInit() {
    
  }

  onSubmit() {
    if (this.phone && this.password) {
      console.log('Phone:', this.phone);
      console.log('Password:', this.password);
    }
  }
   openLoginModal() {
    // 
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

  isOTPComplete(): boolean {
    return this.otp.every(value => value.trim() !== '');
  }

  verifyOTP() {
    if (this.isOTPComplete()) {
      console.log('OTP:', this.otp.join(''));
    }
  }

  focusNextInput(index: number) {
    if (index < this.otp.length - 1 && this.otp[index].trim() !== '') {
      this.inputFields[index + 1].nativeElement.focus();
    }
  }



  signIn() {
    if (this.isFormValid()) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);
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
        const user = result.user;
        if (user) {

          let input = {
            name: user.displayName,
            username: user.email?.split('.com')[0],
            email: user.email,
            password: user.email
          }
          this.googleAccountRegister(input,user);
          console.log('User signed in:', user);
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
        // Proceed with login processing if response is not null
        localStorage.setItem('authToken', res.data.token);
        const jsonString = JSON.stringify(res.data.user);
        localStorage.setItem("key", jsonString);
        const jsonStringGetData = localStorage.getItem('key');
        this.currentUser = jsonStringGetData ? JSON.parse(jsonStringGetData) : [];
        this.loading = false;
        // this.location.go(this.location.path());
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
    // Check if the click is outside the dropdown
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
  }
  private isClickInsideDropdown(event: MouseEvent): boolean {
    // Check if the click target is the dropdown or a child of it
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
      // this.location.go  (this.location.path());
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
      email:this.email
    }
    this.mainServices.forgetPassword(input).subscribe((res:any) => {

      this.otpVerify = res.otp
      console.log(this.otpVerify)
      this.showSuccessMessage(res.msg)
      this.showOTPBox = true
      this.showForgotPhoneBox = false
      this.showForgotBox = false
    },
    (err:any)=>{

      this.showSuccessMessage(err.error.msg)
      this.loading = false
    }
  )
  }
  openForgot() {
    this.showForgotPhoneBox = true
    this.showPhoneBox = false
  }
  openForgotEmail() {
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

      if (backdrop) {
        document.body.removeChild(backdrop);
      }
      this.resetForm();

    }
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
  // logout(){
  //   this.router.navigate(['/body']);
  //   this.loading = true
  //   localStorage.clear();
  //    this.location.go  (this.location.path());
  //   this.authService.signOut();
  //   window.location.reload();
  //   this.loading = false

  // }
  logout() {
    this.loading = true;


    localStorage.clear();
    this.authService.signOut();


    this.router.navigate(['/body']).then(() => {

        // this.location.go(this.location.path());


        window.location.reload();
    });


    this.loading = false;
}


}
