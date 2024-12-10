import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { Constants } from '../../../../../public/constants/constants';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  currentUserProfile: any;
  imageUrl: any;
  constructor(private mainServicesService: MainServicesService,private toastr:ToastrService,    public service: SharedDataService
  ) {
    // this.getCurrentUser();
    this.getProfile()
  }
  // getCurrentUser() {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     const jsonStringGetData = localStorage.getItem('key');
  //     if (jsonStringGetData) {
        
  //       this.currentUserProfile = JSON.parse(jsonStringGetData);
  //       this.getProfile()
  //       this.imageUrl = this.currentUserProfile.img;
  //     } else {
  //     }
  //   }
  // }
  onImageUpload(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const File = event.target.files[0];
      this.updateProfile(File);

    }
  }
  updateProfile(file:any): void {
    if (file) {
      let formData = new FormData();
      formData.append('user_id', this.currentUserProfile.id.toString());
      formData.append('image', file);
      let token = localStorage.getItem('authToken')
      fetch(`${Constants.baseApi}/profile/update-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response: any) => {
          return response.json();
        })
        .then((data) => {
          
          if(data.status){
            this.toastr.success(
              data.message,
              'Success'
            );
            this.imageUrl = data.data.profile_link;
            this.service.changeImageUrl(this.imageUrl);
            // this.UpdateLocalUserData(data.data);
          }
         
        })
        .catch((error) => {
          this.toastr.error(
            'Profile update failed. Please try again.',
            'Error'
          );
        });
    }
  }
  UpdateLocalUserData(data: any) {
    const jsonString = JSON.stringify(data);
    localStorage.setItem('key', jsonString);
    // this.getCurrentUser();
    this.getProfile()
  }

  getProfile(){
    this.mainServicesService.getProfileData().subscribe({
      next:(res:any)=>{
        console.log("res data",res.data)
        this.currentUserProfile = res.data
      },
      error:(err:any)=>{
        console.log("error ====>",err)
      }
    })
  }
  // OnInit(){
  //   this.getProfile(this.currentUserProfile?.id)
  // }
}
