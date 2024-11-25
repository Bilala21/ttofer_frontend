import { Component } from '@angular/core';
import { BodyComponent } from '../../pages/body/body.component';
import { Extension } from '../../helper/common/extension/extension';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BodyComponent,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentUserId: string = ""
  tempToken: boolean = false
  constructor(private extention: Extension, private globalStateService: GlobalStateService,private router: Router, private authService: AuthService, private extension: Extension,private toastr: ToastrService, ) {
    this.currentUserId = extention.getUserId();
    globalStateService.currentState.subscribe((state) => {
      this.tempToken = state.temp_token == "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%" ? true : false
    })
  }
  addPost(){
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {
      const userData = JSON.parse(storedData);
      const userId = userData?.id;
     if (userId) {
        localStorage.setItem('currentTab',"addPost")
        this.router.navigate([`/profilePage/${userId}`]);
      }
    }
    
  }

}
