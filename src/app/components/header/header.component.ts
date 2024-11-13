import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { LoaderComponent } from "../loader/loader.component";
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { LoginModalComponent } from "../../pages/login-modal/login-modal.component";
import { SharedDataService } from '../../shared/services/shared-data.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Extension } from '../../helper/common/extension/extension';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, LoaderComponent, LoginModalComponent, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderNavigationComponent implements OnInit {
  currentUser: any = {};
  loading: boolean = false;
  apiData: any = [];
  categoryLimit: number = 12;
  categories: any = [];
  showSearch: boolean = false;
  private imageUrlSubscription: Subscription | undefined;
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  imgUrl: string | null = null;
  tempToken: boolean = false
  cartItems: any = [];
  notificationList: any = [];
  unReadNotification: any = 0;
  searchTerm: any
  currentUserid: any = null
  constructor(
    private globalStateService: GlobalStateService,
    private mainServicesService: MainServicesService,
    private authService: AuthService,
    private router: Router, private toastr: ToastrService,
    public extension: Extension,
    private service: SharedDataService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('key') as string);
    globalStateService.currentState.subscribe((state) => {
      this.tempToken = state.temp_token == "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%" ? true : false
    })
    this.currentUserid = extension.getUserId();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenSize();
  }

  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenWidth < 1024 && this.screenWidth > 768) {
      this.categoryLimit = 4;
    }
    else if (this.screenWidth < 768) {
      this.categoryLimit = 2;
    }
    else {
      this.categoryLimit = 12;
    }
  }

  showSearchBar() {
    this.showSearch = !this.showSearch;
  }

  login() {
    this.authService.triggerOpenModal()
  }
  logout() {

    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("key");
      this.authService.signOut();
      this.loading = false;
      this.currentUser = ""
      this.notificationList = [];
      this.unReadNotification = 0;
      this.router.navigate(['']).then(() => {
        this.toastr.success('Logged out successfully', 'Success');
      });

    } catch (error) {

      this.toastr.error('An error occurred while logging out. Please try again.', 'Error');
    } finally {

    }
  }

  subTotal() {
    return this.cartItems.reduce((acc: any, item: any) => {
      return acc + item.fix_price * item.quantity;
    }, 0);
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
    }else {
      const userData = JSON.parse(storedData);
      const userId = userData?.id;
      if (userId) {
        this.router.navigate([`/selling/${userId}`]);
        localStorage.setItem('currentTab', "savedItems");
        this.router.navigate(['/profilePage', `${userId}`])  
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
  goOnCart(){
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      this.router.navigate(['/cart'])
    }
  }
  cart() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      this.mainServicesService.getCartPorduct().subscribe({
        next: (value: any) => {
          this.globalStateService.updateCart(value.data)
          console.log(value);
        },
        error: (err) => {
          console.log(err);
        },
      })
      // this.router.navigate(['/cart'])
    }
  }
  goOnNotification() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      localStorage.setItem('currentTab', "notification");
      this.router.navigate(['/profilePage', `${this.currentUser.id}`])
    }
  }
  getNotification() {
    this.loading = true;
    this.mainServicesService
      .getNotification(this.currentUser?.id)
      .subscribe((res: any) => {
        this.notificationList = res.data
        this.notificationList = res.data.sort((a: any, b: any) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        this.unReadNotification = this.notificationList.filter((item: any) => item.status == "unread")
        this.loading = false;
      });
  }
  navigateToSearch(): void {
    this.router.navigate(['post/post-category'], {
      queryParams: { name: 'featured', search: this.searchTerm }
    });
  }
  ngOnInit(): void {
    this.imageUrlSubscription = this.service.currentImageUrl.subscribe(
      (url: string | null) => {
        this.imgUrl = url;
      }
    );

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
      }
    });

    // ADD TO CARD FUNCTIONALITY
    this.globalStateService.currentState.subscribe((state) => {
      this.cartItems = state.cartState

    })
    if (this.currentUser?.id) {
      this.getNotification()
    }
    if (this.currentUserid) {
      this.cart()
    }
  }
}
