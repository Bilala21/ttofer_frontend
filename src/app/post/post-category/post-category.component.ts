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
  data:any[]=[]
  countdownSubscriptions: Subscription[] = [];
  loading:any = true
  promotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
  ];
  activeTab: any = "auction";




  handleTab(tab: string) {
    this.activeTab = tab;
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
    this.handleTab(this.activeTab)
    this.route.queryParams.subscribe((params) => {
      const tabName = params['name'] || this.activeTab; 
      this.handleTab(tabName);
    });
    this.countdownSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.globalStateService.currentState.subscribe((state) => {
      this.data = state.filteredProducts;
      this.globalStateService.productlength=this.data.length
      // this.activeTab = state.prodTab

    })
    setTimeout(()=>{
    this.loading = false
    },2000)
  }
  
}

