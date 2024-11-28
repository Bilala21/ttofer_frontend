import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { notFoundData } from '../../../json-data';
import { NotfoundComponent } from '../notfound/notfound.component';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ShimmerDesignComponent } from '../shimmer-design/shimmer-design.component';

@Component({
  selector: 'app-purchase-sale',
  standalone: true,
  imports: [
    TabComponent,
    NotfoundComponent,
    NotfoundComponent,
    NgIf,
    NgFor,
    ShimmerDesignComponent,
  ],
  templateUrl: './purchase-sale.component.html',
  styleUrl: './purchase-sale.component.scss',
  providers: [DecimalPipe],
})
export class PurchaseSaleComponent implements OnInit {
  tabs = ['buying', 'selling', 'history'];
  sellingListTemp: any = [];
  activeIndex: number = 1;
  notFoundData: any = {};
  data: any = [];
  notfoundData = notFoundData['buying'];
  loading: boolean = false;
  constructor(
    private decimalPipe: DecimalPipe,
    private mainServices: MainServicesService
  ) {}

  getTab(tab: any) {
    this.activeIndex = tab.index;
    this.notfoundData = notFoundData[tab.value];
    if (this.tabs.includes(tab.value)) {
      this.fecthData(tab.value);
    }
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }
  fecthData(tab: string) {
 
    this.loading = true;
    this.mainServices.getSelling().subscribe({
      next: (res: any) => {
        this.data = res.data?.[tab];
        this.loading = false;
        console.log(res)
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {
    this.fecthData('buying');
  }
}
