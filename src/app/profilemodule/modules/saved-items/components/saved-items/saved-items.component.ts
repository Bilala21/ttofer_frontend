import { Component } from '@angular/core';
import { Extension } from '../../../../../helper/common/extension/extension';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-items',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './saved-items.component.html',
  styleUrl: './saved-items.component.scss'
})
export class SavedItemsComponent {
  currentUserId:any;
  savedItems:any
  notificationList:any=[]
  constructor(private extension:Extension,private mainServices:MainServicesService){
    this.currentUserId = this.extension.getUserId();
  this.wishListProduct()
  }
  wishListProduct() {
    var input = {
      user_id: this.currentUserId,
    };
    this.mainServices.wishListProduct(input).subscribe(
      (res: any) => {
        debugger
        this.savedItems = res.data;
        this.savedItems.isAuction =
        this.savedItems.fix_price == null ? true : false;
      },
      (err: any) => {}
    );
  }
}
