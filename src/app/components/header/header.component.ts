import { NgFor } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { LoaderComponent } from "../loader/loader.component";
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { LoginModalComponent } from "../../pages/login-modal/login-modal.component";
import { SharedDataService } from '../../shared/services/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [RouterLink, NgFor, LoaderComponent, LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderNavigationComponent implements OnInit {
  currentUser: any = {};
  loading: boolean = false;
  apiData: any = [];
  categoryLimit: number = 8;
  categories: any = [];
  showSearch: boolean = false;
  private imageUrlSubscription: Subscription | undefined;
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  imgUrl: string | null = null;

  constructor(
    private globalStateService: GlobalStateService,
    private mainServicesService: MainServicesService,
    private authService: AuthService,
    private router: Router,
    private service: SharedDataService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('key') as string);
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
      this.categoryLimit = 8;
    }

    console.log('Category Limit:', this.categoryLimit, 'Screen Width:', this.screenWidth);
  }

  showSearchBar() {
    this.showSearch = !this.showSearch;
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
        console.log(res,"123bilal");
        this.categories = res;
        this.loading = false;
        this.globalStateService.setCategories(res);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  openChat() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
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

  openSelling() {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
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
}
