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
  currentUser: any,
  temp_token: any
  isLoggedIn: boolean,
  cartState: any[],
  offerModal: string,
  isFilterActive: boolean
}

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private initialState: AppState = {
    tab: { index: 1, tabName: "selling" },
    users: [],
    categories: [],
    isLoggedInd: false,
    wishListItems: [],
    currentUser: {},
    subCategories: [],
    filteredProducts:{},
    prodTab: { key: "ProductType", value: "auction" },
    temp_token: localStorage.getItem("tempToken"),
    isLoggedIn: false,
    cartState: [],
    offerModal: "",
    auctionProducts: [],
    featuredProducts: [],
    isFilterActive: false
  };
  public filterCriteria: any = {
    location: []
  }
  public productlength: any;

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  currentState = this.stateSubject.asObservable();
  public productSubject = new BehaviorSubject<any>([]);
  product = this.productSubject.asObservable();

  constructor() {
    const currentUser = JSON.parse(localStorage.getItem("key") || '{}');
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, currentUser: currentUser });
  }

  updateCart(data: any, isRemove = false) {
    let updatedCartState;
    const currentState = this.stateSubject.value;
    if (Array.isArray(data)) {
      updatedCartState = data
    }
    else {
      const existingItem = currentState.cartState.find((item) => item.id === data.id);
      // console.log(data, "cart state");
      if (isRemove) {
        updatedCartState = currentState.cartState.filter(item => item.id !== data.id);
      }
      else {

        if (existingItem) {
          updatedCartState = currentState.cartState.map((item) => {
            if (item.id === data.id) {
              return { ...item, quantity: data.quantity };
            }
            return item;
          }).filter(item => item.quantity > 0);
        }
        else {
          // const productInfo = { id: data.id, name: data.title, user_id: data.user_id, description: data.description, fix_price: data.fix_price, image: data.photo[0].src, quantity: 1 }
          updatedCartState = [...currentState.cartState, data];
        }

      }
    }
    const newState: any = {
      ...currentState,
      cartState: updatedCartState,
    };

    localStorage.setItem("tempCartItem", JSON.stringify(updatedCartState))
    this.stateSubject.next(newState);
  }

  isFilterActive(value: boolean) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      isFilterActive: value
    };
    this.stateSubject.next(newState);
  }


  setOfferModal(modal_type: string) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      offerModal: modal_type
    };
    this.stateSubject.next(newState);
  }
  updateTab(index: number, tabName: string) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      tab: { index, tabName }
    };
    this.stateSubject.next(newState);
  }
  updateProdTab(key: string, value: string) {
    // 
    const newState = {
      prodTab: { key, value }
    };
    this.productSubject.next(newState);
  }
  wishlistToggle(id: number) {
    const currentState = this.stateSubject.value;
    const currentWishList = currentState.wishListItems;
    let newWishList: number[];
    if (currentWishList.includes(id)) {
      newWishList = currentWishList.filter(itemId => itemId !== id);
    } else {
      newWishList = [...currentWishList, id];
    }

    const newState = {
      ...currentState,
      wishListItems: newWishList
    };
    this.stateSubject.next(newState);
  }

  setFilteredProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      filteredProducts: data
    };
    this.stateSubject.next(newState);
  }

  setFeaturedProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      featuredProducts: data
    };
    this.stateSubject.next(newState);
  }
  setAuctionProducts(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      auctionProducts: data
    };
    this.stateSubject.next(newState);
  }

  setCategories(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      categories: data
    };
    this.stateSubject.next(newState);
  }
  setSubCategories(data: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      subCategories: data
    };
    this.stateSubject.next(newState);
  }
  updateTempToken(token: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      temp_token: token
    };
    this.stateSubject.next(newState);
  }
  isLoggedInUser(token: any) {
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      isLoggedIn: token
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

}
