import { CommonModule, DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
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
import { GlobalSearchService } from '../../shared/services/state/search-state.service';

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
  currentUser: any = {};
  loading: boolean = false;
  apiData: any = [];
  categoryLimit: number = 12;
  categories: any = [];
  showSearch: boolean = false;
  private imageUrlSubscription: Subscription | undefined;
  screenWidth: number;
  screenHeight: number;
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
  private searchSubject: Subject<string> = new Subject<string>();
  suggestions: any = [];
  isHideCart: boolean = false;
  constructor(
    private globalStateService: GlobalStateService,
    private mainServicesService: MainServicesService,
    private authService: AuthService,
    private extension: Extension,
    private router: Router,
    private toastr: ToastrService,
    private service: SharedDataService,
    private activatedRoute: ActivatedRoute,
    private globalSearchService: GlobalSearchService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('key') as string);
    globalStateService.currentState.subscribe((state) => {
      this.cartItems = state.cartState;
    });
    this.currentUserid = extension.getUserId();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.suggestions = [
      {
        id: 1,
        name: 'Mobile',
      },
      {
        id: 2,
        name: 'Cars',
      },
      {
        id: 3,
        name: 'Mobile',
      },
      {
        id: 4,
        name: 'Mobile',
      },
      {
        id: 4,
        name: 'Mobile',
      },
      {
        id: 4,
        name: 'Mobile',
      },
      {
        id: 4,
        name: 'Mobile',
      },
    ];
    this.router.events.subscribe(() => {
      const privateRoute = ['/cart', '/checkout'];
      if (!privateRoute.includes(this.router.url)) {
        this.isHideCart = false;
      } else {
        this.isHideCart = true;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = event.target.innerHeight;
    this.getScreenSize();
  }

  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

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

  login() {
    this.authService.triggerOpenModal();
  }
  logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('key');
      this.authService.signOut();
      this.loading = false;
      this.currentUser = '';
      this.notificationList = [];
      this.unReadNotification = 0;
      this.router.navigate(['']).then(() => {
        this.toastr.success('Logged out successfully', 'Success');
      });
    } catch (error) {
      this.toastr.error(
        'An error occurred while logging out. Please try again.',
        'Error'
      );
    } finally {
    }
  }

  openChat() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      const userData = JSON.parse(storedData);
      const userId = userData?.id;
      if (userId) {
        this.router.navigate([`/chatBox/${userId}`]);
      }
    }
  }

  savedItems() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      const userData = JSON.parse(storedData);
      const userId = userData?.id;
      if (userId) {
        this.router.navigate([`/selling/${userId}`]);
        localStorage.setItem('currentTab', 'savedItems');
        this.router.navigate(['/profilePage', `${userId}`]);
      }
    }
  }

  openSelling() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      const userData = JSON.parse(storedData);
      const userId = userData?.id;
      if (userId) {
        this.router.navigate([`/selling/${userId}`]);
      }
    }
  }
  getCartItems() {
    if (!this.currentUserid) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      this.mainServicesService.getCartProducts(this.currentUserid).subscribe({
        next: (value: any) => {
          this.globalStateService.updateCart(value.data);
          this.cartItems = value.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  goOnNotification() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      // localStorage.setItem('currentTab', 'notification');
      // this.router.navigate(['/profilePage', `${this.currentUser.id}`]);
      // // localStorage.setItem('currentTab', "notification");
      // // this.router.navigate(['/notifications', `${this.currentUser.id}`])
      this.router.navigate(['/profile/notifications']);
    }
  }
  getNotification() {
    // this.loading = true;
    // this.mainServicesService
    //   .getNotification(this.currentUser?.id, 'all')
    //   .subscribe((res: any) => {
    //     this.notificationList = res.data;
    //     this.notificationList = res.data.sort((a: any, b: any) => {
    //       return (
    //         new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    //       );
    //     });
    //     this.unReadNotification = this.notificationList.filter(
    //       (item: any) => item.status == 'unread'
    //     );
    //     this.loading = false;
    //   });
  }
  navigateToSearch(): void {
    if (!this.searched && this.searchTerm) {
      this.globalSearchService.setFilterdProducts({ search: this.searchTerm });
      // this.globalSearchService.setQueryValue(
      //   this.searchTerm.toLowerCase().trim()
      // );
    }
  }

  handleFilter(filter: any) {
    localStorage.setItem('filters', JSON.stringify({}));
    this.globalSearchService.setFilterdProducts({
      ...filter,
      first_call: true,
    });
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
        this.imgUrl = url;
      }
    );
    this.getCurrentCity();
    if (this.currentUser && this.currentUser.img) {
      this.imgUrl = this.currentUser.img;
    }

    this.loading = true;
    this.getScreenSize();
    this.mainServicesService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loading = false;
        this.globalStateService.setCategories(res.data);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });

    if (this.currentUser?.id) {
      this.getNotification();
      this.getCartItems();
    }
    const value = JSON.parse(localStorage.getItem('filters') || '{}').search;
    this.searchTerm = value ? value : '';
    if (this.searchTerm) {
      this.isSearched = true;
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
          console.warn('Geolocation permission denied or error:', error);
          this.handleLocationDenied();
        }
      );
    } else {
      console.error('Geolocation not supported by the browser.');
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
      !event.target.classList.contains('not-hide')
    ) {
      this.isSearched = true;
    } else if (event.target.tagName.toLowerCase() === 'input') {
      this.isSearched = false;
    }
  }

  ngOnDestroy() {
    document.body.addEventListener('click', this.onBodyClick.bind(this));
  }
}
