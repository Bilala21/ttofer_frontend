import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MainServicesService } from '../../shared/services/main-services.service';
import { forkJoin, Subscription } from 'rxjs';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { HeaderComponent } from '../../shared/shared-components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FooterComponent } from '../../shared/shared-components/footer/footer.component';
import { ProductCarouselComponent } from '../carousels/product-carousel/product-carousel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterLink } from '@angular/router';
import { CardShimmerComponent } from "../../components/card-shimmer/card-shimmer.component";
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { TempFormComponent } from '../../components/temp-form/temp-form.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true,
  imports: [HeaderComponent, ProductCardComponent, TempFormComponent, FooterComponent, ProductCarouselComponent, SharedModule, RouterLink, CardShimmerComponent],
})
export class BodyComponent implements OnDestroy {
  auctionPosts: any = [];
  featuredPosts: any = [];
  countdownSubscriptions: Subscription[] = [];
  loading = true
  tempToken: boolean = false

  permotionBanners: any = [
    {
      banner: "https://images.olx.com.pk/thumbnails/493379125-800x600.webp"
    },
    {
      banner: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/be2f29652ac02f60.jpeg?q=20"
    }
  ];

  constructor(
    private mainServices: MainServicesService,
    private cdr: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService,
    private globalStateService: GlobalStateService
  ) {

    globalStateService.currentState.subscribe((state) => {
      this.tempToken = state.temp_token == "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%" ? true : false
    })
  }

  ngOnInit(): void {

    forkJoin({
      auctionProduct: this.mainServices.getAuctionProduct(),
      featureProduct: this.mainServices.getFeatureProduct(),
    }).subscribe({
      next: (response) => {
        this.auctionPosts = response.auctionProduct.data;
        this.featuredPosts = response.featureProduct.data;
        // this.globalStateService.setFilteredProducts()
        this.startCountdowns();
        this.loading = false
      },
      error: (err) => {
        console.error('Error occurred while fetching data', err);
        this.loading = false
      },
    });
  }

  startCountdowns() {
    this.auctionPosts.forEach((item: any) => {
      const datePart = item.ending_date.split('T')[0];
      const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;

      const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
        item.calculateRemaningTime = remainingTime;
        item.isBid = remainingTime !== 'Bid Expired';
        this.cdr.detectChanges();
      });

      this.countdownSubscriptions.push(subscription);
    });
  }

  ngOnDestroy(): void {
    this.countdownSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
