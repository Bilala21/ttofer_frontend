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
    updateFilterProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      new_products: data,
    };
    this.stateSubject.next(newState);
  }
  getLoading() {
    const currentState = this.stateSubject.value;
    return currentState.loading
  }
}

