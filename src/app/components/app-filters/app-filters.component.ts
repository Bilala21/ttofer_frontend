import { ChangeDetectorRef, Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterLink } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { FormsModule } from '@angular/forms';
import { CountdownTimerService } from '../../shared/services/countdown-timer.service';
import { filter, Subscription } from 'rxjs';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardShimmerComponent } from '../card-shimmer/card-shimmer.component';


@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, NgxSliderModule, NgIf, CommonModule, MatTooltipModule],
  templateUrl: './app-filters.component.html',
  styleUrls: ['./app-filters.component.scss']
})
export class AppFiltersComponent implements OnInit {
  @Output() handleFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  id: any = null;
  subCategories: any[] = [];
  categoryWithFilters: any = {}
  categories: any = []
  isCategory: boolean = false
  slug: any = "";
  loading: boolean = false
  locationLoading: boolean = false
  location: any = {
    city: "",
    sublocality: ""
  }

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
      "conditions": ["All", "New", "Used", "Refurbished"],
    },
    "property for sale": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "Ready", "Off plan"],
      "bedrooms": [1, 2, 3, 4, 5, 6, 7, 8],
      "bathrooms": [1, 2, 3, 4, 5],
      "area_size": [1, 2, 3, 4, 5],
    },
    "vehicles": {
      "seller_types": ["Owner", "Dealer"],
      "conditions": ["All", "New", "Used",],
    },
    "property for rent": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "Furnished", "Unfurnished"],
      "rent_is_paid": ["Yearly", "Monthly", "Quarterly", "Bi-Yearly"],
      "bedrooms": [1, 2, 3, 4, 5, 6, 7, 8],
      "bathrooms": [1, 2, 3, 4, 5],
      "area_size": [1, 2, 3, 4, 5],
    },
    // electronics & appliances
    "electronics & appliances": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["Any", "Refurbished", "New", "Used"],
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
    "animals": {
    },
    // furniture and home decor
    "furniture and home decor": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["Refurbished", "Dealer"],
    },
    // fashion and beauty
    "fashion and beauty": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "New", "Used"],
    },
    "kids": {
      "seller_types": ["Landlord", "Agent"],
      "conditions": ["All", "new", "Used"],
    },
    "delivery": ["Local Delivery", "Pick Up", "Shipping"]
  };

  filters: any
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

  isNavigatingAway: any = false
  hideFilter: boolean = false
  isLgScreen: boolean = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mainServicesService: MainServicesService,
    public globalStateService: GlobalStateService,
    private countdownTimerService: CountdownTimerService

  ) { }


  ngOnInit() {
    this.checkScreenSize();
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const slug:any=params.get('slug')
      if (slug.indexOf('-') > 0) {
        this.id=slug.slice(0,slug.indexOf('-'))
        this.slug = slug.slice(slug.indexOf('-')+1,).replace(/-/g, ' ');
      }
    })
    this.mainServicesService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
    if (this.id) {
      this.fetchSubCategories(this.id)
    }

    // this.filters = JSON.parse(localStorage.getItem("filters") as string)
    // this.route.paramMap.subscribe(params => {
    //   this.id = params.get('id');
    //   this.slug = params.get('slug');
    //   this.globalStateService.currentState.subscribe(state => {
    //     this.categories = state.categories
    //   })
    //   if (params.get('id')) {
    //     this.isCategory = true
    //     this.slug = this.filters?.category.slug
    //     this.fetchSubCategories(this.filters?.category.id?this.filters?.category.id:this.id);
    //     this.categoryWithFilters = this.filter_fields?.[this.filters?.category.slug?.toLowerCase()];
    //     this.loading= false
    //   }

    //   else if(params.get('name') && this.id) {
    //     this.loading = false
    //     this.globalStateService.currentState.subscribe(state => {
    //       const item = state?.categories.find(cat => cat.id === +this.id)
    //       this.categories = state.categories
    //       if (item) {
    //         this.categoryWithFilters = this.filter_fields?.[this.slug?.toLowerCase()];
    //         this.isCategory = true
    //         this.filterCriteria['category'] = item
    //       }
    //     })
    //     this.fetchSubCategories(this.id);
    //   }
    // });

    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationStart))
    //   .subscribe((event: any) => {
    //     this.isNavigatingAway = true;
    //   });


    // if (JSON.parse(localStorage.getItem("filters") as string)) {
    //   this.filterCriteria = JSON.parse(localStorage.getItem("filters") as string)
    // }

    // this.globalStateService.product.subscribe(state => {
    //   this.filterCriteria[state.prodTab?.key] = state.prodTab.value;
    //   this.fetchData();
    // });

    // this.minValue = this.filterCriteria?.min_price ? this.filterCriteria?.min_price : 5
    // this.highValue = this.filterCriteria?.max_price ? this.filterCriteria?.max_price : 1000
    // this.radiusValue = this.filterCriteria?.radius ? this.filterCriteria?.radius : 1
  }

  selectCategory(item: any) {
    this.router.navigate(['/category', item.id + '-' + item.slug]);
    this.filterCriteria['category_id'] = item.id
    localStorage.setItem("filters", JSON.stringify(this.filterCriteria))
    this.fetchSubCategories(item.id)
  }

  fetchSubCategories(id: number) {
    this.loading = true
    if (id) {
      this.mainServicesService.getSubCategories(id).subscribe({
        next: (res: any) => {
          this.subCategories = res?.data;
          this.loading = false
        },
        error: (err) => {
          this.loading = false
          console.log(err);
        }
      });
    }
  }

  fetchData() {
    // const modifiedFilter = { ...this.filterCriteria, location: this.filterCriteria.location.join(',') };
    // this.mainServicesService.getFilteredProducts(modifiedFilter).subscribe({
    //   next: (res: any) => {
    //     // Check if 'res' and 'res.data' are not null or undefined
    //     if (res && res.data.data) {
    //       this.startCountdowns(res.data.data);
    //       this.globalStateService.setFilteredProducts(res.data.data);
    //       this.globalStateService.isFilterActive(true)
    //     } else {
    //       console.log('No data found in response');
    //     }

    //   },
    //   error: (err) => {
    //     console.log('Error fetching filtered products', err);
    //   }
    // });
  }

  handleFilter(filter: any) {
    // this.globalStateService.loading = true
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
    this.handleFilterEvent.emit(this.filterCriteria)
    // this.fetchData();
  }

  handleMinMaxPrice() {
    this.filterCriteria['min_price'] = this.minValue;
    this.filterCriteria['max_price'] = this.highValue;
    localStorage.setItem("filters", JSON.stringify(this.filterCriteria))
    this.fetchData();
  }

  // startCountdowns(data: []) {
  //   if (data.length > 0) {
  //     data.forEach((item: any) => {
  //       if (item.ProductType === 'auction') {
  //         const datePart = item.ending_date.split('T')[0];
  //         const endingDateTime = `${datePart}T${item.ending_time}:00.000Z`;
  //         const subscription = this.countdownTimerService.startCountdown(endingDateTime).subscribe((remainingTime) => {
  //           item.calculateRemaningTime = remainingTime;
  //           item.isBid = remainingTime !== 'Bid Expired';
  //         });
  //         this.countdownSubscriptions.push(subscription);
  //       }
  //     });
  //   }

  // }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const lgBreakpoint = 992;
    this.isLgScreen = window.innerWidth >= lgBreakpoint;
    if (this.isLgScreen) {
      this.hideFilter = false;
    } else {
      this.hideFilter = true;
    }
  }

  getCityFromCoordinates(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        addressComponents.forEach((component: any) => {

          if (component.types.includes('locality')) {
            this.location = { ...this.location, city: component.long_name }
          }
          else if (component.types.includes("neighborhood")) {
            this.location = { ...this.location, sublocality: component.long_name }
          }
        })
        this.locationLoading = false
      } else {
        console.error('Geocoder failed:', status);
        this.locationLoading = false
        this.location = 'Unable to fetch city';
      }
    })
  }

  getCurrentCity(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.getCityFromCoordinates(lat, lng);
        },
        (error) => {
          console.warn('Geolocation permission denied or error:', error);
          this.handleLocationDenied();
        }
      );
    } else {
      console.error('Geolocation not supported by the browser.');
      this.location = 'Geolocation not supported';
    }
  }

  handleLocation() {
    this.locationLoading = true
    this.getCurrentCity()
  }

  handleLocationDenied(): void {
    this.location = 'Belarus';
  }

  ngOnDestroy() {
    if (this.isNavigatingAway) {
      localStorage.removeItem('filters');
    }
  }
}
