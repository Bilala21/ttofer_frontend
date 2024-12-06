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
    private cd: ChangeDetectorRef
  ) {}

  promotionBanners: any = [];
  activeTab: any = 'auction';
  data: any = {};
  id: any = null;
  currentPage: number = 1;
  countdownSubscriptions: Subscription[] = [];
  loading: boolean = false;
  slugName: any = '';
  ProductTabs: any = [];
  allTabs: any = ['auction', 'featured', 'looking', 'hiring'];

  handleTab(tab: string) {
    localStorage.setItem('categoryTab', tab);
    this.activeTab = tab;
    this.fecthcData({ });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query) => {
      if (query.get('search')) {
        console.log(query.get('search'), 'search');
        this.fecthcData({ search: query.get('search') });
      }
    });

    this.route.paramMap.subscribe((param) => {
      console.log(param, location.search);
      const slug = param.get('slug');
      const index = Number(slug?.lastIndexOf('-'));
      this.slugName = slug?.slice(0, index);
      this.id = slug?.slice(index + 1);
      this.setActiveTabs(this.slugName);
      const localFilters = JSON.parse(localStorage.getItem('filters') || '{}');
      if (location.search == '') {
        if (Number(localFilters.category_id) == Number(this.id)) {
          this.fecthcData({ category_id: this.id });
        } else {
          localStorage.setItem('filters', '{}');
          this.fecthcData({ category_id: this.id });
        }
      }
    });
    this.getBanners();
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
    const selectedTab = localStorage.getItem('categoryTab');
    const category_id = JSON.parse(
      localStorage.getItem('filters') || '{}'
    )?.category_id;
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
      this.activeTab =
        this.ProductTabs.includes(selectedTab) && category_id == this.id
          ? selectedTab
          : 'auction';
      localStorage.setItem('categoryTab', 'auction');
    }
    if (['animals', 'services', 'property-for-rent'].includes(slug)) {
      this.ProductTabs = ['featured'];
      this.activeTab =
        this.ProductTabs.includes(selectedTab) && category_id == this.id
          ? selectedTab
          : 'featured';
      localStorage.setItem('categoryTab', 'featured');
    }
    if (slug == 'jobs') {
      this.ProductTabs = ['hiring', 'looking'];
      this.activeTab =
        this.ProductTabs.includes(selectedTab) && category_id == this.id
          ? selectedTab
          : 'hiring';
      localStorage.setItem('categoryTab', 'hiring');
    }
  }

  fecthcData(filter: any) {
    console.log(filter, 'bilal');
    const product_type = localStorage.getItem('categoryTab');
    const localFilters = JSON.parse(localStorage.getItem('filters') || '{}');

    const category_id = this.id ? this.id : localFilters.category_id;
    localStorage.setItem(
      'filters',
      JSON.stringify({ ...localFilters, ...filter, product_type, category_id })
    );

    this.loading = true;
    this.mainServices
      .getFilteredProducts({
        ...filter,
        ...localFilters,
        product_type,
        category_id,
        search: filter.search,
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.data = res.data.data;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem('categoryTab');
    localStorage.removeItem('categoryId');
    localStorage.removeItem('filters');
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
