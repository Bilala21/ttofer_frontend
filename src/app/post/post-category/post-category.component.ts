import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.scss'],
})
export class PostCategoryComponent implements OnInit {
  constructor(private route:ActivatedRoute,private globalStateService: GlobalStateService, private mainServices: MainServicesService, private countdownTimerService: CountdownTimerService,private cd:ChangeDetectorRef) {
  }
  activeButton: number = 1;
  isActive = false;
  postCols = 'col-12 col-md-6 col-lg-6 col-xl-4';
  feature = [];
  auction = [];
  data: any = {}
  countdownSubscriptions: Subscription[] = [];
  loading:any = true
  promotionBanners: any = [];
  activeTab: any = "auction";

  hasSearchParam: boolean = false


  handleTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('postCategoryTab', tab);
    this.globalStateService.updateProdTab("productType", tab);
  }

  toggleSidebar() {
    this.isActive = !this.isActive;
  }
  
  setActiveButton(buttonNumber: number) {
    this.activeButton = buttonNumber;
  }

  startCountdowns() {
    this.auction.forEach((item: any) => {
      const datePart = item.ending_date.split('T')[0];
      const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;

      const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
        item.calculateRemaningTime = remainingTime;
        item.isBid = remainingTime !== 'Bid Expired';
        this.cd.detectChanges();
      });

      this.countdownSubscriptions.push(subscription);
    });
  }

  
  ngOnInit() {
    const savedTab = localStorage.getItem('postCategoryTab');
    this.activeTab = savedTab ? savedTab : "auction";
    this.getBanners()
    this.handleTab(this.activeTab)
    this.route.queryParams.subscribe((params) => {
      const tabName = params['name'] || this.activeTab; 
      this.hasSearchParam = !!params['search'];
      this.handleTab(tabName);
    });
    this.countdownSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.globalStateService.currentState.subscribe((state) => {
      this.data = state.filteredProducts;
      console.log(this.data,"this.data");
      this.globalStateService.productlength = state.filteredProducts?.data?.length
    })
  }
  getBannerSliceCount(): number {
    return this.hasSearchParam ? 0 : 2;
  }
  getBanners(){
    this.mainServices.getBanners().subscribe({
      next:(res)=>{
          this.promotionBanners = res.data.map((item:any)=>{
            return{
              banner:item?.img
            }
          })
      },
      error:(error)=>{
        console.error('Error occurred while fetching data', error);
      }
    })
  }
  
  ngOnDestroy() {
    // Remove specific filter data key from localStorage
    localStorage.removeItem("postCategoryTab");

  }
}

