import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { forkJoin, Subscription } from 'rxjs';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { PostCategoriesComponent } from '../../components/post-categories/post-categories.component';
import { PromotionSliderComponent } from '../../components/promotion-slider/promotion-slider.component';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { TempFormComponent } from '../../components/temp-form/temp-form.component';
import { NgIf } from '@angular/common';
import { Extension } from '../../helper/common/extension/extension';
import { GlobalSearchService } from '../../shared/services/state/search-state.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true,
  imports: [
    NgIf,
    ProductCardComponent,
    PromotionSliderComponent,
    PostCategoriesComponent,
    SliderComponent,
    RouterLink,
    CardShimmerComponent,
  ],
})
export class BodyComponent implements OnDestroy {
  currentUserId: any = this.extension.getUserId();
  auctionPosts: any = [];
  featuredPosts: any = [];
  countdownSubscriptions: Subscription[] = [];
  loading = true;
  tempToken: boolean = false;
  promotionBanners: any = [];
  footerBanners: any = [];
  constructor(
    private mainServices: MainServicesService,
    private cdr: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService,
    private globalStateService: GlobalStateService,
    private extension: Extension,
    private globalSearchService: GlobalSearchService
  ) {
    globalStateService.currentState.subscribe((state) => {
      this.tempToken =
        state.temp_token == '32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%'
          ? true
          : false;
    });
  }
  ngOnInit(): void {
    forkJoin({
      auctionProduct: this.mainServices.getAuctionProduct(),
      featureProduct: this.mainServices.getFeatureProduct(),
    }).subscribe({
      next: (response) => {
        //
        this.auctionPosts = response.auctionProduct.data.data;
        this.featuredPosts = response.featureProduct.data.data;
        this.startCountdowns();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error occurred while fetching data', err);
        this.loading = false;
      },
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

  handlesUserWishlist(item: any) {
    if (item.product_type !== 'auction') {
      console.log(item, 'item');
      this.mainServices.getFeatureProduct().subscribe({
        next: (res) => {
          this.featuredPosts = res.data.data;
        },
        error: (err) => {},
      });
    } else {
      this.mainServices.getAuctionProduct().subscribe({
        next: (res) => {
          this.auctionPosts = res.data.data;
        },
        error: (err) => {},
      });
    }
  }

  ngOnDestroy() {
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  startCountdowns() {
    if (this.auctionPosts) {
      this.auctionPosts.forEach((item: any) => {
        const datePart = item.auction_ending_date;

        const endingDateTime = `${datePart}T${item.auction_ending_time}.000Z`;
        const subscription = this.countdownTimerService
          .startCountdown(endingDateTime)
          .subscribe((remainingTime) => {
            item.calculateRemainingTime = remainingTime
              ? remainingTime + ' remaining'
              : 'Bid Expired';
            this.cdr.detectChanges();
          });

        this.countdownSubscriptions.push(subscription);
      });
    }
  }

  // ['mobiles','electronics-appliance','property-for-sale','vehicles','bikes','furniture-home-decor','fashion-beauty','kids']

  handleFilter(filter: any) {
    localStorage.setItem('filters', JSON.stringify({}));
    this.globalSearchService.setFilterdProducts(filter);
  }
}
