import { Component } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { notFoundData } from '../../../json-data';
import { NotfoundComponent } from '../notfound/notfound.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-sale',
  standalone: true,
  imports: [TabComponent, NotfoundComponent, NotfoundComponent,NgIf],
  templateUrl: './purchase-sale.component.html',
  styleUrl: './purchase-sale.component.scss',
})
export class PurchaseSaleComponent {
  tabs = ['buying', 'selling', 'history'];
  activeIndex: number = 1;
  notFoundData: any = {};
  data: any = [];
  notfoundData = notFoundData['buying'];

  getTab(tab: any) {
    this.activeIndex = tab.index;
    this.notfoundData = notFoundData[tab.value];
  }
}
