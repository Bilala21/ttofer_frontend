import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AppState {
  tab: { index: number; tabName: string };
  prodTab: { key: string; value: string };
  users: any[];
  categories: any[];
  subCategories: any[];
  filteredProducts: any;
  auctionProducts: any[];
  featuredProducts: any[];
  isLoggedInd: boolean;
  wishListItems: number[];
  currentUser: any;
  temp_token: any;
  isLoggedIn: boolean;
  cartState: any[];
  offerModal: string;
  isFilterActive: boolean;
  activeCategory: number;
  currentUserId: null;
  productId: null;
  liveBids: null;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private initialState: AppState = {
    tab: { index: 1, tabName: 'selling' },
    users: [],
    categories: [],
    isLoggedInd: false,
    wishListItems: [],
    currentUser: {},
    subCategories: [],
    filteredProducts: {},
    prodTab: { key: 'ProductType', value: 'auction' },
    temp_token: localStorage.getItem('tempToken'),
    isLoggedIn: false,
    cartState: [],
    offerModal: '',
    auctionProducts: [],
    featuredProducts: [],
    currentUserId: null,
    productId: null,
    liveBids: null,
    isFilterActive: false,
    activeCategory: 0,
  };
  public filterCriteria: any = {
    location: [],
  };
  public productlength: any;
  public loading: any = true;

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  currentState = this.stateSubject.asObservable();
  public productSubject = new BehaviorSubject<any>([]);
  product = this.productSubject.asObservable();

  constructor() {
    const currentUser = JSON.parse(localStorage.getItem('key') || 'null');
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, currentUser: currentUser });
  }

  updateCart(data: any) {
    const currentState = this.stateSubject.value;
    const newState: any = {
      ...currentState,
      cartState: Array.isArray(data)
        ? [...data]
        : currentState.cartState.filter((item) => item.product.id !== data),
    };
    this.stateSubject.next(newState);
  }
  updateUserState(user: any) {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, currentUser: user });
  }
  isFilterActive(value: boolean) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      isFilterActive: value,
    };
    this.stateSubject.next(newState);
  }

  setOfferModal(
    modal_type: string,
    currentUserId?: any,
    productId?: any,
    liveBids?: any
  ) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      offerModal: modal_type,
      currentUserId: currentUserId,
      productId: productId,
      liveBids: liveBids,
    };
    this.stateSubject.next(newState);
  }
  updateTab(index: number, tabName: string) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      tab: { index, tabName },
    };
    this.stateSubject.next(newState);
  }
  updateProdTab(key: string, value: string) {
    //
    const newState = {
      prodTab: { key, value },
    };
    this.productSubject.next(newState);
  }
  wishlistToggle(id: number) {
    const currentState = this.stateSubject.value;
    const currentWishList = currentState.wishListItems;
    let newWishList: number[];
    if (currentWishList.includes(id)) {
      newWishList = currentWishList.filter((itemId) => itemId !== id);
    } else {
      newWishList = [...currentWishList, id];
    }

    const newState = {
      ...currentState,
      wishListItems: newWishList,
    };
    this.stateSubject.next(newState);
  }

  setFilteredProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      filteredProducts: data,
    };
    this.stateSubject.next(newState);
  }

  setFeaturedProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      featuredProducts: data,
    };
    this.stateSubject.next(newState);
  }
  setAuctionProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      auctionProducts: data,
    };
    this.stateSubject.next(newState);
  }

  setCategories(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      categories: data,
    };
    this.stateSubject.next(newState);
  }
  setSubCategories(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      subCategories: data,
    };
    this.stateSubject.next(newState);
  }
  updateTempToken(token: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      temp_token: token,
    };
    this.stateSubject.next(newState);
  }
  isLoggedInUser(token: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      isLoggedIn: token,
    };
    this.stateSubject.next(newState);
  }

  // Method to show the auth modal
  showAuthModal(isAuthenticated: boolean) {
    this.updateState({ isLoggedInd: isAuthenticated });
  }

  // Method to hide the auth modal
  hideAuthModal() {
    this.updateState({ isLoggedInd: false });
  }

  // Generic method to update state properties
  private updateState(newState: Partial<AppState>) {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...newState });
  }
  setActiveCategory(categoryId: number): void {
    // this.activeCategory = categoryId; // Update the active category
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, activeCategory: categoryId });
  }
}
