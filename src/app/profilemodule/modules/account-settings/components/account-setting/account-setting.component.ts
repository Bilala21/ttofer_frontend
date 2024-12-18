import { Component, OnInit } from '@angular/core';
import { Extension } from '../../../../../helper/common/extension/extension';
import { AccountSettingDialogeComponent } from '../../../../../pages/account-setting-dialoge/account-setting-dialoge.component';
import { MatDialog } from '@angular/material/dialog';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalStateService } from '../../../../../shared/services/state/global-state.service';

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
    name: 'fa-user',
    phone: 'fa-phone',
    email: 'fa-envelope',
    password: 'fa-lock',
    location: 'fa-map-marker-alt',
  };
  constructor(
    private globalStateService:GlobalStateService,
    public dialog: MatDialog,private toastr:ToastrService,
    private mainServices: MainServicesService
  ) {
  }
  ngOnInit(){
      this.globalStateService.currentUser$.subscribe((user) => {
        this.currentUserProfile = user;
        this.userSettings()

      });
  }
  userSettings() {
    
    this.userSetting = 
      {
        name: this.currentUserProfile.name,
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
        const data: any = {};
        if (result.key === 'password' && result.old_password) {
          data['old_password'] = result.old_password;
          data['password'] = result.password;
          data['password_confirmation'] = result.password;
        } else {
          data[result.key] = result.value;
        }
        this.mainServices.updateUserAccount(data).subscribe(
          (response: any) => {
            if (response.status) {
              if (result.key === 'password' && result.old_password) {
                this.globalStateService.triggerLogout();
                this.toastr.success('Password changed successfully. Please log in again.', 'Success');
              } else {
                const currentUser = response.data;
                this.globalStateService.updateCurrentUser(currentUser);
                this.toastr.success(response.message, 'Success');
              }
            }
          },
          (error: any) => {
            if (error.error && error.error.errors) {
              const validationErrors = error.error.errors;
              for (const field in validationErrors) {
                if (validationErrors.hasOwnProperty(field)) {
                  const messages = validationErrors[field];
                  messages.forEach((message: string) => {
                    this.toastr.error(` ${message}`, 'Validation Error');
                  });
                }
              }
            } else {
              this.toastr.error(error.error.message || 'An error occurred.', 'Error');
            }
          }
        );
      }
    });
  }

}
