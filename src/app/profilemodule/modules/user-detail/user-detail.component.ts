import { Component } from '@angular/core';
import { MainServicesService } from '../../../shared/services/main-services.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  profileData :any ={}

  constructor( private mainServicesService: MainServicesService, ) {

  }

  profile(){
    this.mainServicesService.getProfileData().subscribe({
      next: (value: any) => {
        this.profileData = value.data
           console.log(value)
        // this.globalStateService.updateCart(value.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(){
  this.profile()
  }

}
