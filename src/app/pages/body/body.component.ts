import { ChangeDetectorRef, Component } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { forkJoin, Subscription } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SliderComponent } from '../../components/slider/slider.component';
import { PostCategoriesComponent } from '../../components/post-categories/post-categories.component';
import { PromotionSliderComponent } from '../../components/promotion-slider/promotion-slider.component';
import { CardShimmerComponent } from '../../components/card-shimmer/card-shimmer.component';
import { NgIf} from '@angular/common';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

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
export class BodyComponent {
  auctionPosts: any = [];
  featuredPosts: any = [];
  loading = true;
  tempToken: boolean = false;
  promotionBanners: any = [];
  adsBanners: any = [];
  footerBanners: any = [];
  user_id;
  countdownSubscriptions: Subscription[] = [];
  constructor(
    private mainServices: MainServicesService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService,
    private jwt:JwtDecoderService
  ) {
    this.user_id = this.jwt.decodedToken.id;
  }
  ngOnInit(): void {
    let query: any = '';
    this.router.queryParamMap.subscribe((q) => {
      query = { user_id: this.user_id, search: q.get('search') };
      forkJoin({
        auctionProduct: this.mainServices.getAuctionProduct(query),
        featureProduct: this.mainServices.getFeatureProduct(query),
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
    });
    this.getBanners();
    this.getAdvertisement();
  }

  startCountdowns() {
    if (this.auctionPosts.length) {
      this.auctionPosts.forEach((item: any) => {
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
      });
    }
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
  // getAdvertisement
  getAdvertisement() {
    this.mainServices.getAdsBanners().subscribe({
      next: (res) => {
        this.adsBanners = res.data.map((item: any) => {
          return {
            banner: item?.mobile_path,
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
}