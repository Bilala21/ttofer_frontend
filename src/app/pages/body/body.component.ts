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

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true,
  imports: [
    NgIf,
    ProductCardComponent,
    TempFormComponent,
    FooterComponent,
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
  constructor(
    private mainServices: MainServicesService,
    private cdr: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService,
    private globalStateService: GlobalStateService,
    private extension: Extension
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
        this.auctionPosts = response.auctionProduct.data.data;
        this.featuredPosts = response.featureProduct.data.data;
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
    console.log(item, 'item');
    if (item.product_type === 'featured') {
      this.mainServices.getFeatureProduct().subscribe({
        next: (res) => {
          this.featuredPosts=res.data.data
        },
        error: (err) => {},
      });
    } else {
      this.mainServices.getAuctionProduct().subscribe({
        next: (res) => {
          this.auctionPosts=res.data.data
        },
        error: (err) => {},
      });
    }
    // this.featuredPosts.map((prod: any) => {
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

  startCountdowns() {
    this.auctionPosts.forEach((item: any) => {
      const datePart = item.ending_date.split('T')[0];
      const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;

      const subscription = this.countdownTimerService
        .startCountdown(endingDateTime)
        .subscribe((remainingTime) => {
          item.calculateRemaningTime = remainingTime;
          item.isBid = remainingTime !== 'Bid Expired';
          this.cdr.detectChanges();
        });

      this.countdownSubscriptions.push(subscription);
    });
  }

  ngOnDestroy(): void {
    this.countdownSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
}
