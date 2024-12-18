import { Component,OnInit} from '@angular/core';
import { Extension } from '../../../../../helper/common/extension/extension';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtDecoderService } from '../../../../../shared/services/authentication/jwt-decoder.service';

@Component({
  selector: 'app-saved-items',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved-items.component.html',
  styleUrl: './saved-items.component.scss',
})
export class SavedItemsComponent implements OnInit{
  currentUser:any;
  savedItems: any;
  notificationList: any = [];
  constructor(
    private extension: Extension,
    private mainServices: MainServicesService,
    private jwtDecoderService: JwtDecoderService,
  ) {
    this.currentUser = this.jwtDecoderService.decodedToken;
    console.log("V",this.currentUser.id)
  }
  getUserSavedItems(id:any) {
    this.mainServices.wishListProduct(id).subscribe({
      next: (res: any) => {
        this.savedItems = res.data;
        this.savedItems.isAuction =
          this.savedItems.fix_price == null ? true : false;
      },
      error: (err) => {
        console.log("error",err)
      },
    });
  }

  ngOnInit(){
       if (this.currentUser.id) {
      this.getUserSavedItems(this.currentUser.id);  
    }
  }
}
