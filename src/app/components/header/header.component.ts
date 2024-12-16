import { CommonModule, DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { LoginModalComponent } from '../../pages/login-modal/login-modal.component';
import { SharedDataService } from '../../shared/services/shared-data.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Extension } from '../../helper/common/extension/extension';
import { sideBarItems } from '../../profilemodule/modules/profile-sidebar/json-data';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    LoginModalComponent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderNavigationComponent implements OnInit {
  notification: any = null;
  loading: boolean = false;
  cartLoading: boolean = false;
  notificationLoading: boolean = false;
  apiData: any = [];
  categoryLimit: number = 12;
  categories: any = [];
  showSearch: boolean = false;
  private imageUrlSubscription: Subscription | undefined;
  screenWidth: number;
  imgUrl: string | null = null;
  cartItems: any = [];
  notificationList: any = [];
  unReadNotification: any = 0;
  city: any;
  searchTerm: any = '';
  currentUserid: any = null;
  activeCategory: any = 0;
  isSearched: boolean = false;
  searched: boolean = false;
  sideBarItemss: any[] = [];
  private searchSubject: Subject<string> = new Subject<string>();
  private getCartSubject: Subject<void> = new Subject<void>();
  private getNotificationsSubject: Subject<void> = new Subject<void>();
  suggestions: any = [];
  activeRoute: any;
  isHideCart: boolean = false;
  totalAmount: number = 0;
  token: any = '';
  protected currentUser: any = {};

  constructor(
    private globalStateService: GlobalStateService,
    private mainServicesService: MainServicesService,
    private authService: AuthService,
    private extension: Extension,
    private router: Router,
    private toastr: ToastrService,
    private service: SharedDataService,
    private jwtDecoderService: JwtDecoderService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser = this.jwtDecoderService.decodedToken;
    this.sideBarItemss = sideBarItems;
    this.globalStateService.currentState.subscribe((state) => {
      console.log(state, 'user');
      this.currentUser = state.currentUser
        ? state.currentUser
        : this.currentUser;
      this.cartItems = state.cartState;
    });
    this.globalStateService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.globalStateService.logoutEvent$.subscribe((response) => {
      this.logout()
    });
    this.currentUserid = extension.getUserId();
    this.screenWidth = window.innerWidth;
    this.router.events.subscribe(() => {
      const privateRoute = ['/cart', '/checkout'];
      if (!privateRoute.includes(this.router.url)) {
        this.isHideCart = false;
      } else {
        this.isHideCart = true;
      }
    });
    this.getCartSubject.pipe(debounceTime(300)).subscribe(() => {
      this.getCartItems();
    });
    this.getNotificationsSubject.pipe(debounceTime(300)).subscribe(() => {
      this.getHeaderNotifications();
    });
  }

  calculateTotal(data: any): void {
    this.totalAmount = data.reduce(
      (acc: any, item: any) =>
        acc + item.product.fix_price * item.product.quantity,
      0
    );
    this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
  }
  getCartItems() {
    if (!this.cartItems.length && this.currentUser.id) {
      this.mainServicesService.getCartProducts(this.currentUserid).subscribe({
        next: (value: any) => {
          this.globalStateService.updateCart(value.data);
          this.cartItems = value.data;
          this.cartLoading = false;
          this.calculateTotal(this.cartItems);
        },
        error: (err) => {
          this.cartLoading = false;
          console.error('Error fetching cart products', err);
        },
      });
    }
  }
  getHeaderNotifications() {
    if (!this.notificationList.length && this.currentUser.id) {
      this.mainServicesService
        .getNotification(this.currentUserid, 'unread')
        .subscribe({
          next: (value: any) => {
            this.notificationList = value.data;
            this.notificationLoading = false;
          },
          error: (err) => {
            this.cartLoading = false;
            console.error('Error fetching notifications', err);
          },
        });
    }
  }
  getHeaderState() {
    if (this.currentUserid) {
      this.mainServicesService
        .getHeaderNotifications(this.currentUserid)
        .subscribe({
          next: (res: any) => {
            this.notification = res;
          },
          error: (err) => {
          },
        });
    }
  }
  getCartItemsOnMouseOver() {
    this.cartLoading = true;
    this.getCartSubject.next();
  }
  getNotificationsOnMouseOver() {
    this.notificationLoading = true;
    this.getNotificationsSubject.next();
  }
  navigateToSearch(): void {
    if (!this.searched && this.searchTerm) {
      this.router.navigate([], {
        queryParams: { search: this.searchTerm },
        queryParamsHandling: 'merge',
      });
      localStorage.setItem('isSearch', this.searchTerm);
    }
  }
  getCityFromCoordinates(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        const cityComponent = addressComponents.find((component: any) =>
          component.types.includes('locality')
        );
        this.city = cityComponent ? cityComponent.long_name : 'City not found';
      } else {
        console.error('Geocoder failed:', status);
        this.city = 'Unable to fetch city';
      }
    });
  }
  getCurrentCity(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.getCityFromCoordinates(lat, lng);
        },
        (error) => {
          this.handleLocationDenied();
        }
      );
    } else {
      this.city = 'Geolocation not supported';
    }
  }
  handleSearch(event: any) {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }
  searchMessages(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.isSearched = false;
    this.mainServicesService.getSuggestions(searchTerm).subscribe({
      next: (res: any) => {
        this.suggestions = res.data;
      },
      error: (err) => {
        //(err);
      },
    });
  }
  performSearch() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.searchMessages(searchTerm);
      });
  }
  setupSearchSubscription() {
    this.performSearch();
  }
  handleLocationDenied(): void {
    this.city = 'Belarus';
  }
  handleSuggestion(data: any) {
    this.searchTerm = data.name;
    this.isSearched = true;
    this.searched = false;
  }
  onBodyClick(event: any) {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains('empty-search')
    ) {
      if (this.searchTerm) {
        this.searchTerm = '';
        this.isSearched = false;
      }
    }
    if (
      event.target instanceof HTMLElement &&
      !event.target.classList.contains('not-hide')
    ) {
      this.isSearched = true;
    } else if (event.target.tagName.toLowerCase() === 'input') {
      this.isSearched = false;
    }
  }
  login() {
    this.authService.triggerOpenModal();
  }
  logout() {
    try {
      this.loading = true; // Start loading
      this.authService.logOut().subscribe({
        next: () => {
          // Clear local storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('key');
           this.globalStateService.clearCurrentUser()
          // Clear global state
          this.globalStateService.updateState({
            authToken: '', // Clear token if managed globally
            cartState: [], // Clear any related cart data
          });
  
          // Reset component variables
          this.authService.signOut();
          this.currentUser = '';
          this.token = '';
          this.notificationList = [];
          this.unReadNotification = 0;
  
          // Navigate to home and show success toast
          this.router.navigate(['']).then(() => {
            this.toastr.success('Logged out successfully', 'Success');
          });
        },
        error: (error) => {
          // Handle logout API errors
          this.toastr.error(
            'An error occurred while logging out. Please try again.',
            'Error'
          );
        },
        complete: () => {
          this.loading = false; // Stop loading
        },
      });
    } catch (error) {
      // Handle unexpected errors
      this.toastr.error(
        'An unexpected error occurred while logging out. Please try again.',
        'Error'
      );
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.getScreenSize();
  }
  getScreenSize() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 1024) {
      this.categoryLimit = 12;
    } else if (this.screenWidth <= 1024 && this.screenWidth > 768) {
      this.categoryLimit = 6;
    } else if (this.screenWidth <= 768) {
      this.categoryLimit = 2;
    }
  }
  showSearchBar() {
    this.showSearch = !this.showSearch;
  }
ngOnInit(): void {
    document.body.addEventListener('click', this.onBodyClick.bind(this));
    this.setupSearchSubscription();
    if (JSON.parse(localStorage.getItem('categoryId') as string)) {
      this.activeCategory = JSON.parse(
        localStorage.getItem('categoryId') as string
      );
    }
    this.imageUrlSubscription = this.service.currentImageUrl.subscribe(
      (url: string | null) => {
        this.currentUser.img = url;
      }
    );
    this.getHeaderState();
    this.getCurrentCity();
    
    this.loading = true;
    this.getScreenSize();
    this.mainServicesService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loading = false;
        this.globalStateService.setCategories(res.data);
      },
      error: (err) => {
        this.loading = false;
      },
    });
    const value = JSON.parse(localStorage.getItem('filters') || '{}').search;
    this.searchTerm = value ? value : '';
    if (this.searchTerm) {
      this.isSearched = true;
    }
  }
  ngOnDestroy() {
    document.body.addEventListener('click', this.onBodyClick.bind(this));
  }
}
