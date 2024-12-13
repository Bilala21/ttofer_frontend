import { Component } from '@angular/core';
import { Extension } from '../../../../../helper/common/extension/extension';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-items',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved-items.component.html',
  styleUrl: './saved-items.component.scss',
})
export class SavedItemsComponent {
  savedItems: any;
  notificationList: any = [];
  constructor(
    private extension: Extension,
    private mainServices: MainServicesService
  ) {
    this.getUserSavedItems();
  }
  getUserSavedItems() {
    this.mainServices.getUserSavedItems().subscribe({
      next: (res: any) => {
        this.savedItems = res.data;
        this.savedItems.isAuction =
          this.savedItems.fix_price == null ? true : false;
      },
      error: (err) => {
         //(err);
      },
    });
  }
}
