import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { AppFiltersComponent } from '../../components/app-filters/app-filters.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';
import { Subscription } from 'rxjs';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';

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
  countdownSubscriptions: Subscription[] = [];
  promotionBanners: any = [];
  activeTab: any = 'auction';
  data: any = {};
  id: any = null;
  currentPage: number = 1;
  loading: boolean = false;
  slugName: any = '';
  ProductTabs: any = [];
  currentUser: any = null;
  allTabs: any = ['auction', 'featured', 'looking', 'hiring'];

  constructor(
    private route: ActivatedRoute,
    public globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private jwtDecoderService: JwtDecoderService,
    private countdownTimerService: CountdownTimerService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.jwtDecoderService.decodedToken;
    console.log(this.currentUser);
  }

  handleTab(tab: string) {
    localStorage.setItem('categoryTab', tab);
    const query = localStorage.getItem('isSearch') as string;
    const selectedSlug = localStorage.getItem('selectedSlug');
    this.activeTab = tab ? tab : this.setActiveTabs(selectedSlug);
    this.fecthcData(query == null ? {} : { search: query });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query) => {
      if (query.get('search')) {
        this.id = JSON.parse(
          localStorage.getItem('filters') || '{}'
        )?.category_id;
        const slugName = localStorage.getItem('selectedSlug');
        const tab = localStorage.getItem('categoryTab');
        this.setActiveTabs(slugName);
        this.fecthcData({ product_type: tab, search: query.get('search') });
      }
    });

    this.route.paramMap.subscribe((param) => {
      if (location.search == '') {
        localStorage.removeItem('isSearch');
        const slug: any = param.get('slug');
        const index = Number(slug?.lastIndexOf('-'));
        if (index < 0) {
          //('condition not pass')
          const categoryTab = localStorage.getItem('categoryTab');
          localStorage.setItem('categoryTab', categoryTab ? categoryTab : slug);
          localStorage.setItem('filters', '{}');
          const tab = this.setActiveTabs(categoryTab ? categoryTab : slug);
          this.fecthcData({ product_type: tab });
        }
        const localData = JSON.parse(localStorage.getItem('filters') || '{}');
        if (index > 1) {
          //('condition pass')
          this.id = slug?.slice(index + 1);
          const localFilters = JSON.parse(
            localStorage.getItem('filters') || '{}'
          );
          if (Number(localData.category_id) == Number(this.id)) {
            const slugName = slug?.slice(0, index);
            const tab = this.setActiveTabs(slugName);
            this.fecthcData({ product_type: tab, category_id: this.id });
          } else {
            localStorage.setItem('filters', '{}');
            const slugName = slug?.slice(0, index);
            const tab = this.setActiveTabs(slugName);
            this.fecthcData({
              product_type: tab,
              category_id: this.id,
            });
          }
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

  handleLoadMore(page: number) {
    const filters = JSON.parse(localStorage.getItem('filters') || '{}');
    this.fecthcData({ ...filters, page_number: page + 1 });
  }
  setActiveTabs(slug: any) {
    //(slug,'testing');
    const selectedTab = localStorage.getItem('categoryTab');
    const category_id = JSON.parse(
      localStorage.getItem('filters') || '{}'
    )?.category_id;
    //(category_id, this.id);
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
        this.ProductTabs.includes(selectedTab) &&
        Number(category_id) == Number(this.id)
          ? selectedTab
          : 'auction';
      localStorage.setItem(
        'categoryTab',
        selectedTab == 'featured' && category_id == this.id
          ? selectedTab
          : 'auction'
      );
      localStorage.setItem('selectedSlug', slug);
    }
    if (['animals', 'services', 'property-for-rent'].includes(slug)) {
      this.ProductTabs = ['featured'];
      this.activeTab =
        this.ProductTabs.includes(selectedTab) && category_id == this.id
          ? selectedTab
          : 'featured';
      localStorage.setItem(
        'categoryTab',
        selectedTab == 'featured' ? selectedTab : 'featured'
      );
      localStorage.setItem('selectedSlug', slug);
    }
    if (slug == 'jobs') {
      //('3');
      this.ProductTabs = ['hiring', 'looking'];
      this.activeTab =
        this.ProductTabs.includes(selectedTab) && category_id == this.id
          ? selectedTab
          : 'hiring';
      localStorage.setItem(
        'categoryTab',
        selectedTab == 'looking' ? selectedTab : 'hiring'
      );
      localStorage.setItem('selectedSlug', slug);
    }
    if (slug == 'auction') {
      this.activeTab = 'auction';
      this.ProductTabs = ['auction', 'featured'];
    }
    if (slug == 'featured') {
      this.activeTab = 'featured';
      this.ProductTabs = ['auction', 'featured'];
    }

    return this.activeTab;
  }

  fecthcData(filter: any) {
    const product_type = filter.product_type
      ? filter.product_type
      : localStorage.getItem('categoryTab');
    const localFilters = JSON.parse(localStorage.getItem('filters') || '{}');
    filter.search = localStorage.getItem('isSearch');

    const category_id = this.id ? this.id : localFilters.category_id;
    localStorage.setItem(
      'filters',
      JSON.stringify({
        ...localFilters,
        ...filter,
        product_type,
        category_id,
        page_number: filter.page,
      })
    );
    this.loading = true;
    const allFilters = {
      ...filter,
      ...localFilters,
    };
    this.mainServices
      .getFilteredProducts({
        ...allFilters,
        product_type,
        category_id,
        user_id: this.currentUser?.id,
        search: filter.search,
        location: filter.location
          ? filter.location.join(',')
          : allFilters.location
          ? allFilters.location.join(',')
          : '',
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.data = res.data.data;
          this.startCountdowns()
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  startCountdowns() {
    if (this.data.length) {
      this.data.forEach((item: any) => {
        if (item.product_type === 'auction') {
          const datePart = item.auction_ending_date;

          const endingDateTime = `${datePart}T${item.auction_ending_time}.000Z`;
          const subscription = this.countdownTimerService
            .startCountdown(endingDateTime, item)
            .subscribe((remainingTime) => {
              item.calculateRemainingTime = remainingTime
                ? remainingTime + ' remaining'
                : 'Bid Expired';
              this.cdr.detectChanges();
            });

          this.countdownSubscriptions.push(subscription);
        }
      });
    }
  }

  ngOnDestroy() {
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
    this.globalStateService.setActiveCategory(0);
    localStorage.removeItem('categoryTab');
    localStorage.removeItem('categoryId');
    localStorage.removeItem('filters');
    localStorage.removeItem('selectedSlug');
    localStorage.removeItem('isSearch');
  }
}
