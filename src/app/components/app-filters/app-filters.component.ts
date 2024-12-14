import {
  Component,
  OnInit,
  HostListener,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { GlobalStateService } from '../../shared/services/state/global-state.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter_fields } from './json-data';
import { GlobalSearchService } from '../../shared/services/state/search-state.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, NgxSliderModule, NgIf, CommonModule, MatTooltipModule],
  templateUrl: './app-filters.component.html',
  styleUrls: ['./app-filters.component.scss'],
})
export class AppFiltersComponent implements OnInit {
  @Output() handleFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() totalProducts: any = 0;
  @Input() categoryId: any = null;

  filter_fields: any = filter_fields;
  category_id: any = null;
  subCategories: any[] = [];
  categories: any = [];
  slug: any = '';
  slugName: any = '';
  loading: boolean = false;
  locationLoading: boolean = false;
  location: any = {
    city: '',
    sublocality: '',
  };

  countdownSubscriptions: Subscription[] = [];

  filterCriteria: any = {
    location: [],
  };
  locations: any = [];
  minPrice: number = 0;
  maxPrice: number = 0;

  // minValue: number = 5;
  // highValue: number = 1000;
  // priceOptions: Options = {
  //   floor: 0,
  //   ceil: 5000,
  //   hideLimitLabels: true,
  // };

  radiusValue: number = 1;
  radiusOptions: Options = {
    floor: 0,
    ceil: 50,
    hideLimitLabels: true,
  };

  areaSizeValue: number = 100;
  areaSizeOptions: Options = {
    floor: 0,
    ceil: 20000,
    hideLimitLabels: true,
  };

  bathrooms: number = 1;
  bedrooms: number = 10000;

  isNavigatingAway: any = false;
  hideFilter: boolean = false;
  isLgScreen: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mainServicesService: MainServicesService,
    public globalStateService: GlobalStateService,
    public globalSearchService: GlobalSearchService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loading = true;

    // Subscribe to route param changes
    let slug: any = '';
    this.route.paramMap.subscribe((params) => {
      slug = params.get('slug');
      const newCategoryId =
        slug.lastIndexOf('-') > 0 && slug.slice(slug.lastIndexOf('-') + 1);
      if (newCategoryId !== this.category_id) {
        this.category_id = newCategoryId;
        this.slugName = slug.slice(0, slug.lastIndexOf('-'));
        // this.slug = slug.slice(0, slug.lastIndexOf('-') + 1).replace(/-/g, ' ');

        this.getAndSetLocalFilters(newCategoryId);
        this.fetchSubCategories(newCategoryId);
      }
      if (this.categories) {
        const found = this.categories.find(
          (cate: any) => +cate.id === +this.category_id
        );
        this.slug = found?.name;
      }
    });

    // Fetch categories
    this.mainServicesService.getCategories().subscribe({
      next: (res: any) => {
        const formatedSlug = slug.slice(0, slug.lastIndexOf('-') - 1);
        this.categories = res.data;
        this.slug = this.categories.find(
          (cate: any) => +cate.id === +this.category_id
        )?.name;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  getAndSetLocalFilters(id: number) {
    const localData = JSON.parse(localStorage.getItem('filters') || '{}');
    if (+id !== +this.categoryId) {
      this.filterCriteria = {
        product_type: localData?.product_type,
        category_id: localData?.category_id,
      };
      const form: any = document.getElementById('form');
      if (form) {
        form.reset();
      }
    } else {
      this.filterCriteria = { ...localData };
    }

    this.radiusValue = localData?.radius ? localData?.radius : 1;
    this.minPrice = localData?.min_price ? localData?.min_price : 1;
    this.maxPrice = localData?.max_price ? localData?.max_price : 10000;
    this.areaSizeValue = localData?.area ? localData?.area : 100;
    this.bedrooms = localData?.bedrooms ? localData?.bedrooms : 1;
    this.bathrooms = localData?.bathrooms ? localData?.bathrooms : 2;
  }

  selectCategory(item: any) {
    this.router.navigate(['/category', item.slug + '-' + item.id]);
  }

  fetchSubCategories(id: number) {
    this.loading = true;
    if (id) {
      this.mainServicesService.getSubCategories(id).subscribe({
        next: (res: any) => {
          this.subCategories = res?.data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          //(err);
        },
      });
    }
  }

  handleFilter(filter: any) {
    const localFilters = JSON.parse(localStorage.getItem('filters') || '{}');
    if (filter.key === 'location') {
      this.locations = localFilters.location ? [...localFilters.location] : [];
      const found = this.locations.find((loc: any) => loc == filter.value);
      if (found) {
        this.locations = this.locations.filter(
          (loc: any) => loc !== filter.value
        );
      } else {
        this.locations.push(filter.value);
      }
    }
    this.handleFilterEvent.emit({
      [filter.key]: filter.value,
      location: this.locations,
    });
  }

  checkPriceConditions(event: any, isMin: boolean) {
    const key = event.key;
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
    ];

    if (allowedKeys.includes(key)) return;
    if (!/[0-9]/.test(key)) {
      event.preventDefault();
      return;
    }

    if (this.minPrice >= this.maxPrice && isMin) {
      event.preventDefault();
      return;
    }

    if (event.target.value === '0' && key !== 'Backspace') {
      event.preventDefault();
      return;
    }
    if (
      event.target.value.startsWith('0') &&
      key !== 'Backspace' &&
      !/[0-9]/.test(key)
    ) {
      event.preventDefault();
      return;
    }
  }
  handleMinMaxPrice(event: any, isMin: boolean) {
    if (this.maxPrice >= this.minPrice) {
      this.handleFilterEvent.emit({ ...this.filterCriteria,min_price:this.minPrice,max_price:this.maxPrice });
    }
  }

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
            this.location = { ...this.location, city: component.long_name };
          } else if (component.types.includes('neighborhood')) {
            this.location = {
              ...this.location,
              sublocality: component.long_name,
            };
          }
        });
        this.locationLoading = false;
      } else {
        console.error('Geocoder failed:', status);
        this.locationLoading = false;
        this.location = 'Unable to fetch city';
      }
    });
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
    this.locationLoading = true;
    this.getCurrentCity();
  }

  handleLocationDenied(): void {
    this.location = 'Belarus';
  }
  applyFilters() {
    this.hideFilter = true;
  }

  ngOnDestroy() {
    if (this.isNavigatingAway) {
    }
  }
}
