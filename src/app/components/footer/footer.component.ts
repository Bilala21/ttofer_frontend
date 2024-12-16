import { Component } from '@angular/core';
import { BodyComponent } from '../../pages/body/body.component';
import { Extension } from '../../helper/common/extension/extension';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/Auth.service';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentUserId: string = ""
  tempToken: boolean = false
  constructor(private token:JwtDecoderService, private globalStateService: GlobalStateService,private router: Router, private authService: AuthService, private extension: Extension,private toastr: ToastrService, ) {
    this.currentUserId = token.decodedToken?.id;
    globalStateService.currentState.subscribe((state) => {
      this.tempToken = state.temp_token == "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%" ? true : false
    })
  }
  addPost(){
    if (!this.currentUserId) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    } else {    
    this.router.navigate([`/profile/add-post`]);
    }
    
  }

}
