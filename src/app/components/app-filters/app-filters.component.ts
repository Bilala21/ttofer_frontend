import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { FormsModule } from '@angular/forms';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { filter, Subscription } from 'rxjs';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, NgxSliderModule, NgIf],
  templateUrl: './app-filters.component.html',
  styleUrls: ['./app-filters.component.scss'] // Corrected from styleUrl to styleUrls
})
export class AppFiltersComponent implements OnInit {
  slug: any = "";
  minPrice: number = 0;
  maxPrice: number = 150;
  id: any = null;
  subCategories: any[] = [];
  categoryWithFilters: any = {}
  locations: string[] = [
    "Dubai",
    "Abu Dhabi",
    "Ras Al-Khaimah",
    "Ajman",
    "New York, USA",
    "Sharjah",
  ];
  countdownSubscriptions: Subscription[] = [];
  filter_fields: any = {
    "mobiles": {
      "seller_types": ["Verified", "Unverified"],
      "conditions": ["All", "New", "Used","Refurbished"],
    },
    "electronics & appliance": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["Any","Refurbished", "New","Used"],
    },
    "property for sale": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "Ready", "Off plan"],
      "bedrooms": [1, 2, 3, 4, 5, 6, 7, 8],
      "bathrooms": [1, 2, 3, 4, 5],
      "area_size": [1, 2, 3, 4, 5],
    },
    "property for rent": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "Furnished", "Unfurnished"],
      "rent_is_paid": ["Yearly","Monthly", "Quarterly", "Bi-Yearly"],
      "bedrooms": [1, 2, 3, 4, 5, 6, 7, 8],
      "bathrooms": [1, 2, 3, 4, 5],
      "area_size": [1, 2, 3, 4, 5],
    },
    "vehicles": {
      "seller_types": ["Owner", "Dealer"],
      "conditions": ["All", "New", "Used",],
    },
    "bikes": {
      "seller_types": ["Owner", "Dealer"],
      "conditions": ["All", "New", "Used",],
    },
    "jobs": {
      "seller_types": ["Hiring", "Looking"],
      "typeofwork": ["Remote", "Offline", "Remote Full time", "Remote Part time", `Part
        time`, `Full time`]
    },
    "services": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["Refurbished", "Dealer"],
    },
    "furniture & home decor": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["Refurbished", "Dealer"],
    },
    "fashion & beauty": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All","New","Used"],
    },
    "kids": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All","new","Used"],
    },
    "delivery": ["Local Delivery", "Pick Up", "Shipping"]
  };
  filters:any
  filterCriteria: any = {
    location: []
  };
  minValue: number = 5;
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
  areaSizeValue: number = 1;
  areaSizeOptions: Options = {
    floor: 0,
    ceil: 1000,
    hideLimitLabels: true,
  };
  isNavigatingAway:any=false
  constructor(
    private router: Router,

    private route: ActivatedRoute,
    private mainServicesService: MainServicesService,
    public globalStateService: GlobalStateService,
    private mainServices: MainServicesService,
    private cd: ChangeDetectorRef,
    private countdownTimerService: CountdownTimerService
  ) { }


  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.slug = params.get('slug');
      this.categoryWithFilters = this.filter_fields?.[this.slug.toLowerCase()];
      this.fetchSubCategories();
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.isNavigatingAway = true;
      });
    this.filters = JSON.parse(localStorage.getItem("filters") as string)

if(this.filters){
  this.filterCriteria = JSON.parse(localStorage.getItem("filters") as string)

}
  this.filterCriteria["category_id"]=this.id;
  localStorage.setItem("filters", JSON.stringify(this.filterCriteria))
    this.globalStateService.product.subscribe(state => {
      // // debugger
      this.filterCriteria[state.prodTab.key] = state.prodTab.value;
      this.fetchData();
    });
    this.minValue = this.filterCriteria?.min_price
    this.highValue = this.filterCriteria?.max_price
    this.radiusValue = this.filterCriteria?.radius
  }

  fetchSubCategories() {
    if (this.id) {
      this.mainServicesService.getSubCategories(this.id).subscribe({
        next: (res: any) => {
          this.subCategories = res?.data;
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
        if (res && res.data.data) {
          this.startCountdowns(res.data.data);
          this.globalStateService.setFilteredProducts(res.data.data);
          this.globalStateService.isFilterActive(true)
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
    this.globalStateService.loading=true
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
    localStorage.setItem("filters", JSON.stringify(this.filterCriteria))
    this.fetchData();
  }

  handleMinMaxPrice() {
    this.filterCriteria['min_price'] = this.minValue;
    this.filterCriteria['max_price'] = this.highValue;
    localStorage.setItem("filters", JSON.stringify(this.filterCriteria))
    this.fetchData();
  }


  startCountdowns(data: []) {
    if (data.length > 0) {
      data.forEach((item: any) => {
        if (item.ProductType === 'auction') {
          const datePart = item.ending_date.split('T')[0];
          const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;
          const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
            item.calculateRemaningTime = remainingTime;
            item.isBid = remainingTime !== 'Bid Expired';
          });
          this.countdownSubscriptions.push(subscription);
        }
      });
    }
   
  }
  ngOnDestroy() {
    // Remove editPost data from localStorage if navigating away
    if (this.isNavigatingAway) {
      localStorage.removeItem('filters');
    }
  }
}
