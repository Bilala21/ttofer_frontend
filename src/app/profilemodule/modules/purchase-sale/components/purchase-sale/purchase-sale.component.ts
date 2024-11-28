import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { notFoundData } from '../../../json-data';
import { NotfoundComponent } from '../notfound/notfound.component';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ShimmerDesignComponent } from '../shimmer-design/shimmer-design.component';
import { ActivatedRoute } from '@angular/router';

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
  tabs: any = ['buying', 'selling', 'history'];
  sellingListTemp: any = [];
  activeIndex: number = 1;
  notFoundData: any = {};
  data: any = [];
  notfoundData = notFoundData['buying'];
  loading: boolean = false;
  constructor(
    private decimalPipe: DecimalPipe,
    private mainServices: MainServicesService,
    private route: ActivatedRoute
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
        console.log(res);
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {
    let isSelling = false;
    this.route.queryParams.subscribe((params: any) => {
      if (params.query) {
        this.activeIndex = 2;
        isSelling = true;
      }
      else{
        this.activeIndex = 1;
        isSelling = false;
      }
    });
    if (isSelling) {
      this.fecthData('selling');
    } else {
      this.fecthData('buying');
    }
  }
}
