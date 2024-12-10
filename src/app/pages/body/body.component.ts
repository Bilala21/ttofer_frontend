import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { forkJoin, Subscription } from 'rxjs';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { PostCategoriesComponent } from '../../components/post-categories/post-categories.component';
import { PromotionSliderComponent } from '../../components/promotion-slider/promotion-slider.component';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
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
    private extension: Extension,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    let query: any = '';
    this.router.queryParamMap.subscribe((q) => {
      query = q.get('search');
      forkJoin({
        auctionProduct: this.mainServices.getAuctionProduct(query),
        featureProduct: this.mainServices.getFeatureProduct(query),
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

  ngOnDestroy() {
    this.countdownSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  startCountdowns() {
    if (this.auctionPosts.length) {
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
}
