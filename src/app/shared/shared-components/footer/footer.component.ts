import { Component } from '@angular/core';
import { BodyComponent } from '../../../pages/body/body.component';
import { Extension } from '../../../helper/common/extension/extension';
import { GlobalStateService } from '../../services/state/global-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BodyComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentUserId: string = ""
  tempToken: boolean = false
  constructor(private extention: Extension, private globalStateService: GlobalStateService) {
    this.currentUserId = extention.getUserId();
    globalStateService.currentState.subscribe((state) => {
      this.tempToken = state.temp_token == "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%" ? true : false
    })
  }

}
