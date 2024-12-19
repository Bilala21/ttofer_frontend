import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { notFoundData } from '../../../json-data';
import { NotfoundComponent } from '../notfound/notfound.component';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { ShimmerDesignComponent } from '../shimmer-design/shimmer-design.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Extension } from '../../../../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog-component';
import { JwtDecoderService } from '../../../../../shared/services/authentication/jwt-decoder.service';

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
  user:any;
  query!: string;
  subscriptionId!: number;
  products: any = [];
  isAllChecked: boolean = false;
  selectedIds: number[] = []; // Array to store selected IDs

  constructor(
    private toastr: ToastrService,
    private decimalPipe: DecimalPipe,
    private mainServices: MainServicesService,
    private route: ActivatedRoute,private token:JwtDecoderService,
    private extension: Extension,private dialog:MatDialog,private router:Router
  ) {
    
    this.user =token.decodedToken;
  }
  getTab(tab: any) {
    this.activeIndex = tab.index;
    this.notfoundData = notFoundData[tab.value];
    this.activeTab = tab.value;
    if (this.tabs.includes(tab.value)) {
      this.fecthData(tab.value);
    }
  }
  ngOnInit(): void {
    let isSelling = false;
    this.route.queryParams.subscribe((params: any) => {  
      this.query = params['query'];
      this.subscriptionId = +params['subscription_id'];
      console.log("subscription",this.subscriptionId)
      if (params.query) {
        this.activeTab ='selling'
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

  toggleSelect(): void {
    this.isAllChecked = !this.isAllChecked;
    if (this.isAllChecked) {
      this.selectedIds = this.data.map((item: any) => item.id); // Select all IDs
      console.log("this is for all ids",this.selectedIds)
    } else {
      this.selectedIds = []; // Clear all selected IDs
    }
  }

  updateSelectAll(post: any): void {
    post.selected = !post.selected;
    console.log("post.selected",post.selected)
    if (post.selected) {

      if (!this.selectedIds.includes(post.id)) {
        this.selectedIds.push(post.id); // Add the ID if not already selected
        console.log("when id not selected",this.selectedIds)
      }
    } else {
      this.selectedIds = [...this.selectedIds].filter((id) => id !== post.id); // Remove the ID
      console.log("this.isAllChecked",this.isAllChecked,this.selectedIds)
    }
    this.isAllChecked = this.selectedIds.length === this.data.length; // Update Select All state
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout'], { 
      queryParams: { 
        subscription_id: this.subscriptionId,
        product_id: this.selectedIds // Pass selected IDs as query params
      } 
    });
  }

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }

  fecthData(tab: string) {
    this.loading = true;
    this.mainServices.getSelling(tab, this.user.id).subscribe({
      next: (res: any) => {       
        this.data = res.data?.data.map((item: any) => ({ ...item, selected: false })); // Add 'selected' property to data
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  markAsSold(product: any) {
    localStorage.setItem('soldItems', JSON.stringify(product));   
    this.router.navigate(['/markAsSold/', product.id]);
  }

  deleteProduct(product_id: any) {
    this.mainServices.deleteProduct(product_id).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.data = this.data.filter((item: any) => item.id !== product_id);
          this.toastr.success(response.message, 'Success');
          this.selectedIds = this.selectedIds.filter((id) => id !== product_id); // Remove from selected IDs
        }
      }
    });
  }

  openDialog(id: any): void {
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, {
      height: '322px',
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(result);
      }
    });
  }
}

