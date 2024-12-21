import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { Constants } from '../../../../../public/constants/constants';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { JwtDecoderService } from '../../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  currentUser: any={}
  imageUrl: any;
  constructor(private toastr:ToastrService,public service: SharedDataService,private globalStateService:GlobalStateService
  ){}
  ngOnInit(){
    this.globalStateService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
  onImageUpload(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const File = event.target.files[0];
      this.updateProfile(File); 
    }
  }
  isLoading = false; 
  updateProfile(file: any): void {
      if (file) {
          this.isLoading = true; 
          let formData = new FormData();
          formData.append('user_id', this.currentUser.id.toString());
          formData.append('image', file);
          let token = localStorage.getItem('authToken'); 
          fetch(`${Constants.baseApi}/profile/update-image`, {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              body: formData,
          })
          .then((response: any) => response.json())
          .then((data) => {
              if (data.status) {
                this.isLoading = false; 
                //  
                  this.toastr.success(data.message, 'Success');
                  this.currentUser.img = data.data.profile_link;
                  this.globalStateService.updateCurrentUser(this.currentUser);

                  this.service.changeImageUrl(this.currentUser.img);
              }
          })
          .catch((error) => {
              this.isLoading = false;
              this.toastr.error('Profile update failed. Please try again.', 'Error');
          });
      }
  }
}
