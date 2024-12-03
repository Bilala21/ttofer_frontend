import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  currentUserProfile:any;
  imageUrl:any
constructor(){
this.getCurrentUser();
}
getCurrentUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const jsonStringGetData = localStorage.getItem('key');
    if (jsonStringGetData) {
      this.currentUserProfile = JSON.parse(jsonStringGetData);
      this.imageUrl = this.currentUserProfile.img;
    } else {

    }
  }
}
}
