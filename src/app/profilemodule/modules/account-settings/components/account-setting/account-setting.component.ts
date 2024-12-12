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
    username: 'fa-user',
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
    this.globalStateService.currentState.subscribe((state) => {
      
      this.currentUserProfile = state.currentUser;
      this.userSettings()
    });
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
        // Prepare the data object dynamically
        const data: any = {};
  
        // Check if result has multiple keys
        if (result.key === 'password' && result.old_password) {
          data['old_password'] = result.old_password;
          data['password'] = result.password;
          data['password_confirmation'] = result.password;
        } else {
          data[result.key] = result.value;
        }
  
        // Pass the data to the API
        this.mainServices.updateUserAccount(data).subscribe(
          (response: any) => {
            if (response.status) {
              if (result.key === 'password' && result.old_password) {
                this.globalStateService.triggerLogout();
                this.toastr.success('Password changed successfully. Please log in again.', 'Success');
              }else{
                const currentUser = response.data;
                this.globalStateService.updateState({ currentUser });
                this.toastr.success(response.message, 'Success');
              }
              
            }
          },
          (error: any) => {
            this.toastr.error(error.error.message, 'Error');
          }
        );
      }
    });
  }
  

}
