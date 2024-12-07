import { Component, OnInit } from '@angular/core';
import { Extension } from '../../../../../helper/common/extension/extension';
import { AccountSettingDialogeComponent } from '../../../../../pages/account-setting-dialoge/account-setting-dialoge.component';
import { MatDialog } from '@angular/material/dialog';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss',
})
export class AccountSettingComponent implements OnInit {
  currentUserProfile:any
  userSetting: any = {
    name: 'Bilal',
    phone: '1234567',
    email: 'Bilal',
    password: 'Bilal',
    location: 'Bilal',
  };
  icons: any = {
    username: 'fa-user',
    phone: 'fa-phone',
    email: 'fa-envelope',
    password: 'fa-lock',
    location: 'fa-map-marker-alt',
  };
  currentUserId;
  constructor(
    private extension: Extension,
    public dialog: MatDialog,private toastr:ToastrService,
    private mainServices: MainServicesService
  ) {
    this.currentUserId = extension.getUserId();
    this.getCurrentUser()
  }
  getCurrentUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jsonStringGetData = localStorage.getItem('key');
      if (jsonStringGetData) {
        this.currentUserProfile = JSON.parse(jsonStringGetData);
        this.userSettings();
       
      } else {

      }
    }
  }
  userSettings() {
    this.userSetting = 
      {
        username: this.currentUserProfile.username,
        phone: this.currentUserProfile.phone,
        email: this.currentUserProfile.email,
        location: this.currentUserProfile.location?this.currentUserProfile.location:'Location',
        password:'********'
      }
    
  }
  formatUserData() {
    return Object.keys(this.userSetting);
  }
  openDialog(key: string, placeholder: any): void {
    const dialogRef = this.dialog.open(AccountSettingDialogeComponent, {
      width: '470px',
      height: '322px',
      data: { placeholder, key, currentUserProfile: this.userSetting },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          ...this.userSetting,
          [result.key]: result.value,
        };
        //('User Data before update:', data); // Log the data
        this.mainServices.updateUserAccount(data).subscribe(
          (response: any) => {
            //('User account updated successfully', response);
          },
          (error: any) => {
            this.toastr.success(error.error.message, 'Success');

          }
        );
      }
    });
  }

  ngOnInit(): void {}
}
