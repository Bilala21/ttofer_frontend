import { Component, OnInit } from '@angular/core';
import { Extension } from '../../../helper/common/extension/extension';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgClass, NgFor } from '@angular/common';
import { sideBarItems } from './json-data';
import { RouterModule } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css'],
  standalone: true,
  imports:[NgFor,RouterModule,UserDetailComponent]
})
export class ProfileSidebarComponent implements OnInit {
  selectedTab!: string;
  selectedTabItem: string = '';
  sidebarItems:any=[]
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,
    private http: HttpClient
  ) {
    this.sidebarItems=sideBarItems
  }

  ngOnInit() {
    if (this.selectedTabItem != null) {
      this.selectTab(this.selectedTabItem);
    } else {
      this.selectTab('purchasesSales');
    }
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    // this.showDiv = false;
    // this.showMore = false
  }
}
