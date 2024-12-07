import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { notFoundData } from '../../../json-data';
import { NotfoundComponent } from '../notfound/notfound.component';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ShimmerDesignComponent } from '../shimmer-design/shimmer-design.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Extension } from '../../../../../helper/common/extension/extension';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog-component';

@Component({
  selector: 'app-purchase-sale',
  standalone: true,
  imports: [
    TabComponent,
    NotfoundComponent,
    NotfoundComponent,
    NgIf,
    NgFor,RouterLink,
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
  activeTab: string = 'buying';
  notfoundData = notFoundData['buying'];
  loading: boolean = false;
  userId;
  constructor(private toastr:ToastrService,
    private decimalPipe: DecimalPipe,
    private mainServices: MainServicesService,
    private route: ActivatedRoute,
    private extension: Extension,private dialog:MatDialog
  ) {
    this.userId = this.extension.getUserId();
  }

  getTab(tab: any) {
    this.activeIndex = tab.index;
    this.notfoundData = notFoundData[tab.value];
    this.activeTab = tab.value;
    if (this.tabs.includes(tab.value)) {
      this.fecthData(tab.value);
    }
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }
  fecthData(tab: string) {
    this.loading = true;
    this.mainServices.getSelling(tab, this.userId).subscribe({
      next: (res: any) => {
        
        this.data = res.data?.data;
        this.loading = false;
        //(res.data);
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
      } else {
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
deleteProduct(product_id:any){
this.mainServices.deleteProduct(product_id).subscribe({
  next:(response:any)=>{
    if(response.status){
      this.data = this.data.filter((item: any) => item.id !== product_id);
      console.log(this.data)
      this.toastr.success(response.message,'Success');
    }
  }
})
  }
  openDialog(id:any): void {
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, {
      height: '322px',
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
       this.deleteProduct(result)
       
      }
    });
  }
}
