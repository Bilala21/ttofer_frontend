import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { FormsModule } from '@angular/forms';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { Subscription } from 'rxjs';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, NgxSliderModule],
  templateUrl: './app-filters.component.html',
  styleUrls: ['./app-filters.component.scss'] // Corrected from styleUrl to styleUrls
})
export class AppFiltersComponent implements OnInit {
  slug: any = "";
  minPrice: number = 0;
  maxPrice: number = 150;
  id: string | null = null;
  subCategories: any[] = [];
  locations: string[] = [
    "Dhaka, Bangladesh",
    "Minnesota, USA",
    "Wisconsin, USA",
    "Michigan, USA",
    "New York, USA",
    "New Mexico, USA",
    "Washington, USA",
    "Brasilia, Brazil",
    "Karachi, Pakistan"
  ];
  countdownSubscriptions: Subscription[] = [];

  filterCriteria: any = {
    location: []
  };
  value: number = 5;
  highValue: number = 1000;
  priceOptions: Options = {
    floor: 0,
    ceil: 5000,
    hideLimitLabels: true,
  };
  radiusValue: number = 1;
  radiusOptions: Options = {
    floor: 0,
    ceil: 50,
    hideLimitLabels: true,
  };

  constructor(
    private route: ActivatedRoute,
    private mainServicesService: MainServicesService,
    public globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private cd: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService
  ) { }

  ngOnInit() {
    // Subscribe to route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.slug = params.get('slug');
      this.fetchSubCategories(); // Fetch subcategories whenever the parameters change
    });

    // Subscribe to global product state
    this.globalStateService.product.subscribe(state => {
      this.filterCriteria[state.prodTab.key] = state.prodTab.value;
      this.fetchData();
    });
  }

  fetchSubCategories() {
    if (this.id) {
      this.mainServicesService.getSubCategories(this.id).subscribe({
        next: (res) => {
          this.subCategories = res;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  fetchData() {
    const modifiedFilter = { ...this.filterCriteria, location: this.filterCriteria.location.join(',') };
    this.mainServicesService.getFilteredProducts(modifiedFilter).subscribe({
      next: (res: any) => {
        // Check if 'res' and 'res.data' are not null or undefined
        if (res && res.data) {
          this.startCountdowns(res.data);
          this.globalStateService.setFilteredProducts(res.data);
        } else {
          console.log('No data found in response');
        }
       
      },
      error: (err) => {
        console.log('Error fetching filtered products', err);
      }
    });
  }


  handleFilter(filter: any) {
    if (filter.key === "location") {
      const locIndex = this.filterCriteria.location.indexOf(filter.value);
      if (locIndex > -1) {
        this.filterCriteria.location.splice(locIndex, 1);
      } else {
        this.filterCriteria.location.push(filter.value);
      }
    } else {
      this.filterCriteria[filter.key] = filter.value;
    }
    this.fetchData();
  }

  handlePrice(event: any) {
    this.minPrice = event.value;
    this.maxPrice = event.highValue;
  }

  startCountdowns(data: any) {
    data.forEach((item: any) => {
      console.log(item.ProductType, "item.productType");
      if (item.ProductType === 'auction') {
        const datePart = item.ending_date.split('T')[0];
        const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;

        const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
          item.calculateRemaningTime = remainingTime;
          item.isBid = remainingTime !== 'Bid Expired';
          // this.cd.detectChanges();
        });

        this.countdownSubscriptions.push(subscription);
      }
    });
  }
}
