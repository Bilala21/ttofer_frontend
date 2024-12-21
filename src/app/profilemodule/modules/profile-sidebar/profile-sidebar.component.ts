import { Component, OnInit } from '@angular/core';
import { Extension } from '../../../helper/common/extension/extension';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { sideBarItems } from './json-data';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css'],
  standalone: true,
  imports: [NgFor, RouterModule, UserDetailComponent, NgStyle],
})
export class ProfileSidebarComponent implements OnInit {
  selectedTab!: string;
  selectedTabItem: string = '';
  sidebarItems: any = [];
  activeRoute: boolean = false;
  constructor(private route: ActivatedRoute) {
    this.sidebarItems = sideBarItems;
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.query) {
        this.activeRoute = true;
      }
      else{
        this.activeRoute=false
      }
    });

    if (this.selectedTabItem != null) {
      this.selectTab(this.selectedTabItem);
    } else {
      this.selectTab('purchasesSales');
    }
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  get(){
  
  }
}
