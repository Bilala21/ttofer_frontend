import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { SharedModule } from "../../shared/shared.module";
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Extension } from '../../helper/common/extension/extension';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [SharedModule, AppFiltersComponent, ProductCardComponent, CardShimmerComponent, NgIf,NgFor]
})
export class CategoriesComponent{
  constructor(private extension:Extension,private route: ActivatedRoute, public globalStateService: GlobalStateService, private mainServices: MainServicesService, private countdownTimerService: CountdownTimerService, private cd: ChangeDetectorRef) {

   
  }
  currentUserId: any = this.extension.getUserId();
  promotionBanners: any = []
  activeTab: any = "auction"
  data: any = {}
  id: any = null
  currentPage: number = 1
  countdownSubscriptions: Subscription[] = [];
  loading:boolean=false
  filters:any={}

  handleTab(tab: string) {
      this.activeTab = tab
      localStorage.setItem('categoryTab', tab);
      this.fetchData({...this.filters,product_type:this.activeTab,category_id:this.id})
  }

  ngOnInit(): void {
    const savedTab = localStorage.getItem('categoryTab');
    this.activeTab = savedTab ? savedTab : "auction";
    this.getBanners()
    this.route.paramMap.subscribe(params => {
      const slug:any=params.get('slug')
      if (slug.indexOf('-') < 0) {
        this.activeTab = slug;
        this.fetchData({product_type:this.activeTab})
      }
      else{
        this.fetchData({product_type:this.activeTab})
      }
    })


  }
  getBanners() {
    this.mainServices.getBanners().subscribe({
      next: (res) => {
        this.promotionBanners = res.data.map((item: any) => {
          return {
            banner: item?.img
          }
        })
      },
      error: (error) => {
        console.error('Error occurred while fetching data', error);
      }
    })
  }

  handleLoadMore(page: number) {
    let filters = JSON.parse(localStorage.getItem("filters") as string)
    const modifiedFilter = { ...filters, page: page + 1, location: filters.location.join(',') };
    ;

    this.mainServices.getFilteredProducts(modifiedFilter).subscribe({
      next: (res: any) => {
        // if (res && res.data.data) {
        //   this.globalStateService.setFilteredProducts(res.data.data);
        //   this.globalStateService.isFilterActive(true)
        // } else {
        //   console.log('No data found in response');
        // }
      },
      error: (err) => {
        console.log('Error fetching filtered products', err);
      }
    });
  }

  fetchData(filterCriteria:any, isWishlist:boolean=false) {
    console.log(filterCriteria,'filterCriteria1')
    this.filters=filterCriteria

    this.loading=isWishlist?false:true
    const modifiedFilter = filterCriteria.location?{ ...filterCriteria, location: filterCriteria.location.join(',') }:filterCriteria;
    this.mainServices.getFilteredProducts(modifiedFilter).subscribe({
      next: (res: any) => {
        if (res && res.data.data) {
          this.startCountdowns(res.data.data);
          this.data=res.data.data
          console.log(res)
        } else {
          console.log('No data found in response');
        }
        this.loading=false
      },
      error: (err) => {
        console.log('Error fetching filtered products', err);
        this.loading=false
      }
    });
  }

   startCountdowns(data: []) {
    if (data.length > 0) {
      data.forEach((item: any) => {
        if (item.ProductType === 'auction') {
          const datePart = item.ending_date.split('T')[0];
          const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;
          const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
            item.calculateRemaningTime = remainingTime;
            item.isBid = remainingTime !== 'Bid Expired';
          });
          this.countdownSubscriptions.push(subscription);
        }
      });
    }

  }

handlesUserWishlist(item:any){
  this.fetchData(this.filters,true)
  // console.log(item,'item123')
  // this.data.map((prod: any) => {
  //   if (item.id == prod.id) {
  //     if (!item.user_wishlist) {
  //       prod.user_wishlist = {
  //         user_id: this.currentUserId,
  //         product_id: item.id,
  //       }
  //     }
  //     else {
  //       prod.user_wishlist = null
  //     }
  //   }
  // })
}
    ngOnDestroy() {
    // Remove specific filter data key from localStorage
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem("categoryTab");
    localStorage.removeItem("categoryId");
  }

}
