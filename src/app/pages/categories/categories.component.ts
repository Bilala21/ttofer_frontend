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
  filters: any = {};
  slugName: any = '';
  queryValue: string = '';

  handleTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('categoryTab', tab);
    this.fetchData({
      ...this.filters,
      product_type: this.activeTab,
      category_id: this.id,
    });
  }

  ngOnInit(): void {
    const savedTab = localStorage.getItem('categoryTab');
    this.queryValue = localStorage.getItem('queryValue') as string;
    this.filters = JSON.parse(localStorage.getItem('filters') || '{}');
    console.log(this.filters)

    this.activeTab = savedTab ? savedTab : 'auction';
    this.getBanners();

    this.globalSearchService.currentState.subscribe((state) => {
      if (state.queryValue) {
        this.fetchData({
          category_id: this.id,
          product_type: this.activeTab,
          ...this.filters,
          search: state.queryValue,
        });
      }
      this.queryValue = state.queryValue
        ? state.queryValue
        : (localStorage.getItem('queryValue') as string);
    });

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const index = Number(slug?.lastIndexOf('-'));
      this.id = slug?.slice(index + 1);
      this.slugName = slug?.slice(0, index);
      this.fetchData({
        ...this.filters,
        category_id: this.id,
        product_type: this.activeTab,
        search: this.queryValue,
      });
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

  handleLoadMore(page: number) {
    let filters = JSON.parse(localStorage.getItem('filters') as string);
    this.fetchData(filters);
  }

  fetchData(filterCriteria: any, isWishlist: boolean = false) {
    console.log(filterCriteria);
    this.loading = isWishlist ? false : true;
    let modifiedFilter = {};
    if (filterCriteria?.location) {
      modifiedFilter = {
        ...filterCriteria,
        search: this.queryValue,
        location: filterCriteria.location.join('.'),
      };
    } else {
      modifiedFilter = filterCriteria;
    }

    localStorage.setItem('filters', JSON.stringify(filterCriteria));
    this.mainServices.getFilteredProducts(modifiedFilter).subscribe({
      next: (res: any) => {
        if (res && res.data.data) {
          this.data = res.data.data;
          this.loading = false;
          this.startCountdowns(res.data.data);
        } else {
          console.log('No data found in response');
        }
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching filtered products', err);
        this.loading = false;
      },
    });
  }

  handlesUserWishlist(item: any) {
    this.filters = JSON.parse(localStorage.getItem('filters') || '{}');
    this.fetchData(
      {
        ...this.filters,
        product_type: this.activeTab,
        category_id: this.id,
      },
      true
    );
  }

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
  ngOnDestroy() {
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem('categoryTab');
    localStorage.removeItem('categoryId');
    localStorage.removeItem('filters');
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
