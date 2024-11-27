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

  areaSizeValue: number = 100;
  areaSizeOptions: Options = {
    floor: 0,
    ceil: 1000,
    hideLimitLabels: true,
  };

  bathrooms: number = 1;
  bedrooms: number = 2;

  isNavigatingAway: any = false;
  hideFilter: boolean = false;
  isLgScreen: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mainServicesService: MainServicesService,
    public globalStateService: GlobalStateService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      const slug: any = params.get('slug');
      this.slugName = params.get('slug')?.slice(0, slug.lastIndexOf('-'));
      if (slug.lastIndexOf('-') > 0) {
        this.category_id = slug.slice(slug.lastIndexOf('-') + 1);
        this.slug = slug.slice(0, slug.lastIndexOf('-') + 1).replace(/-/g, ' ');
      }
      this.getAndSetLocalFilters(this.category_id);
    });

    this.mainServicesService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
    if (this.category_id) {
      this.fetchSubCategories(this.category_id);
    }
  }

  getAndSetLocalFilters(id: number) {
    const localData = JSON.parse(localStorage.getItem('filters') || '{}');
    if (+id !== +this.categoryId) {
      this.filterCriteria = {
        product_type: localData?.product_type,
        category_id: localData?.category_id,
      };
      this.fetchSubCategories(id);
    } else {
      this.filterCriteria = { ...localData };
    }
    console.log(this.filterCriteria, 'this.filterCriteria');
    this.radiusValue = localData?.radius ? localData?.radius : 1;
    this.minValue = localData?.min_price ? localData?.min_price : 20;
    this.highValue = localData?.max_price ? localData?.max_price : 500;
    this.areaSizeValue = localData?.area ? localData?.area : 100;
    this.bedrooms = localData?.bedrooms ? localData?.bedrooms : 1;
    this.bathrooms = localData?.bathrooms ? localData?.bathrooms : 2;
  }

  selectCategory(item: any) {
    this.router.navigate(['/category', item.slug + '-' + item.id]);
    this.fetchSubCategories(item.id);
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
          console.log(err);
        },
      });
    }
  }

  handleFilter(filter: any) {
    if (filter.key === 'location') {
      this.filterCriteria = this.filterCriteria?.location
        ? { ...this.filterCriteria }
        : { ...this.filterCriteria, location: [] };

      const index = this.filterCriteria.location.indexOf(filter.value);

      if (index > -1) {
        this.filterCriteria.location.splice(index, 1);
      } else {
        this.filterCriteria.location.push(filter.value);
      }
    } else {
      this.filterCriteria[filter.key] = filter.value;
    }
    this.handleFilterEvent.emit({ ...this.filterCriteria });
  }

  handleMinMaxPrice() {
    this.filterCriteria['min_price'] = this.minValue;
    this.filterCriteria['max_price'] = this.highValue;
    this.handleFilterEvent.emit({ ...this.filterCriteria });
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

  ngOnDestroy() {
    if (this.isNavigatingAway) {
    }
  }
}
