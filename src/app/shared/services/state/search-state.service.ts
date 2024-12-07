import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainServicesService } from '../main-services.service';

interface AppState {
  queryValue: string;
  products: any;
  new_products: any;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private initialState: AppState = {
    queryValue: '',
    products: {},
    new_products: {},
    loading: true,
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  currentState = this.stateSubject.asObservable();

  constructor(private mainServicesService: MainServicesService) {}

  setQueryValue(q: string) {
    localStorage.setItem('queryValue', q);
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      queryValue: q,
    };
    this.stateSubject.next(newState);
  }

  // updateLoading(data: boolean) {
  //   const currentState = this.stateSubject.value;
  //   const newState = {
  //     ...currentState,
  //     loading: data,
  //   };
  //   this.stateSubject.next(newState);
  // }
  updateFilterProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      new_products: data,
      // loading: false,
    };
    this.stateSubject.next(newState);
  }
  getLoading() {
    const currentState = this.stateSubject.value;
    return currentState.loading
  }

  // setFilterdProducts(filter: any) {
  //   const filters = {
  //     ...JSON.parse(localStorage.getItem('filters') || '{}'),
  //     ...filter,
  //   };

  //   const currentState = this.stateSubject.value;

  //   if (currentState.loading !== true) {
  //     this.stateSubject.next({
  //       ...currentState,
  //       loading: true,
  //     });
  //   }

  //   const apiFilters = filters?.locations
  //     ? { ...filters, locations: filters?.locations?.join(',') }
  //     : filters;

  //   this.mainServicesService
  //     .getFilteredProducts({
  //       ...apiFilters,
  //       product_type: filter.product_type
  //         ? filter.product_type
  //         : localStorage.getItem('categoryTab'),
  //     })
  //     .subscribe({
  //       next: (res: any) => {
  //         if (res.status) {
  //           const newState = {
  //             ...currentState,
  //             products: res.data,
  //             loading: false,
  //           };
  //           if (
  //             JSON.stringify(newState.products) !==
  //               JSON.stringify(currentState.products) ||
  //             newState.loading !== currentState.loading
  //           ) {
  //             this.stateSubject.next(newState);
  //           }
  //         } else {
  //           console.log('No data found in response');
  //           const newState = {
  //             ...currentState,
  //             products: {},
  //             loading: false,
  //           };
  //           if (
  //             JSON.stringify(newState.products) !==
  //               JSON.stringify(currentState.products) ||
  //             newState.loading !== currentState.loading
  //           ) {
  //             this.stateSubject.next(newState);
  //           }
  //         }
  //       },
  //       error: (err) => {
  //         const newState = {
  //           ...currentState,
  //           products: {},
  //           loading: false,
  //         };
  //         console.log('Error fetching filtered products', err);
  //         if (
  //           JSON.stringify(newState.products) !==
  //             JSON.stringify(currentState.products) ||
  //           newState.loading !== currentState.loading
  //         ) {
  //           this.stateSubject.next(newState);
  //         }
  //       },
  //     });

  //   localStorage.setItem('filters', JSON.stringify(filters));
  //   setTimeout(() => {
  //     localStorage.setItem(
  //       'filters',
  //       JSON.stringify({ ...filters, first_call: false })
  //     );
  //   }, 1000);
  // }
}
