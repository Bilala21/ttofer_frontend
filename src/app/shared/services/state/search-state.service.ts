import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AppState {
  queryValue: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private initialState: AppState = {
    queryValue: '',
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  currentState = this.stateSubject.asObservable();

  constructor() {}

  setQueryValue(q: string) {
    localStorage.setItem('queryValue', q);
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      queryValue: q,
    };
    this.stateSubject.next(newState);
  }
}
