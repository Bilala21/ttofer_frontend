import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { GlobalSearchService } from '../../shared/services/state/search-state.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [
    AppFiltersComponent,
    ProductCardComponent,
    CardShimmerComponent,
    SliderComponent,
    NgIf,
    NgFor,
  ],
})
export class CategoriesComponent {
  constructor(
    private route: ActivatedRoute,
    public globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private countdownTimerService: CountdownTimerService,
    private cd: ChangeDetectorRef,
    private globalSearchService: GlobalSearchService
  ) {}

  promotionBanners: any = [];
  activeTab: any = 'auction';
  data: any = {};
  id: any = null;
  currentPage: number = 1;
  countdownSubscriptions: Subscription[] = [];
  loading: boolean = false;
  slugName: any = '';
  localFilters: any = {};
  ProductTabs: any = [];

  handleTab(tab: string) {
    this.activeTab = tab;
    this.globalSearchService.setFilterdProducts({
      product_type: tab,
      category_id: this.id,
    });
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   const slug = params.get('slug');
    //   const index = Number(slug?.lastIndexOf('-'));
    //   this.id = slug?.slice(index + 1);
    //   this.slugName = slug?.slice(0, index);
    //   this.setActiveTabs(this.slugName)
    // });
    // this.localFilters = JSON.parse(localStorage.getItem('filters') || '{}');
    // this.activeTab = this.localFilters?.product_type;
    // this.setActiveTabs(this.localFilters.slug);
    // this.slugName = this.localFilters.slug;
    this.getBanners();

    this.globalSearchService.currentState.subscribe((state) => {
      this.loading = state.loading;
      this.data = state.products?.data ? state.products?.data : [];
      console.log(state);
    });
  }

  getBanners() {
    this.mainServices.getBanners().subscribe({
      next: (res) => {
        this.promotionBanners = res.data.map((item: any) => {
          return {
            banner: item?.img,
          };
        });
      },
      error: (error) => {
        console.error('Error occurred while fetching data', error);
      },
    });
  }

  handleLoadMore(page: number) {}

  handlesUserWishlist(item: any) {}

  startCountdowns(data: []) {
    if (data) {
      data.forEach((item: any) => {
        const datePart = item.auction_ending_date;

        const endingDateTime = `${datePart}T${item.auction_ending_time}.000Z`;
        const subscription = this.countdownTimerService
          .startCountdown(endingDateTime)
          .subscribe((remainingTime) => {
            item.calculateRemainingTime = remainingTime
              ? remainingTime + ' remaining'
              : 'Bid Expired';
            this.cd.detectChanges();
          });

        this.countdownSubscriptions.push(subscription);
      });
    }
  }

  setActiveTabs(slug: any) {
    if (
      [
        'mobiles',
        'electronics-appliance',
        'property-for-sale',
        'vehicles',
        'bikes',
        'furniture-home-decor',
        'fashion-beauty',
        'kids',
      ].includes(slug)
    ) {
      this.ProductTabs = ['auction', 'featured'];
    }
    if (['animals', 'services', 'property-for-rent'].includes(slug)) {
      this.ProductTabs = ['featured'];
    }
    if (slug == 'jobs') {
      this.ProductTabs = ['hiring', 'looking'];
    }
    console.log(this.ProductTabs);
  }

  ngOnDestroy() {
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem('categoryTab');
    localStorage.removeItem('categoryId');
    localStorage.removeItem('filters');
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
