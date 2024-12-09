import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Constants } from '../../../../public/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class MainServicesService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  Url = 'https://www.ttoffer.com/backend/public/api';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAuthByLogin(payload: any): Observable<any> {
    return this.http
      .post(`${Constants.baseApi}` + '/login-email', payload)
      .pipe
      // catchError()
      ();
  }
  getAuthByLoginNumber(payload: any): Observable<any> {
    return this.http
      .post(`${Constants.baseApi}` + '/login-phone', payload)
      .pipe();
  }

  getBanners(): Observable<any> {
    return this.http.get(`${Constants.baseApi}/get-banners`);
  }
  getFeatureProduct(): Observable<any> {
    return this.http.post(`${Constants.baseApi}/featured-products`, null);
  }
  getAuctionProduct(): Observable<any> {
    return this.http.post(`${Constants.baseApi}/auction-products`, null);
  }
  addWishList(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/wishlist/toggle', payload)
      .pipe();
  }
  removeWishList(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/remove-wishlist-products', payload)
      .pipe();
  }
  updateUserName(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/user/name', payload)
      .pipe();
  }
  updateNumber(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/phone/number', payload)
      .pipe();
  }
  updateEmail(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/email', payload)
      .pipe();
  }
  updatePassword(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/password', payload)
      .pipe();
  }
  updateLocation(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/location', payload)
      .pipe();
  }
  getPlacedBids(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/bids/product', payload)
      .pipe();
  }
  makeOffer(payload: any) {
    return this.http.post(`${Constants.baseApi}` + '/make-offer', payload).pipe();
  }
  getOffer(payload: any) {
    return this.http.get(`${Constants.baseApi}` + `/offers/${payload}`).pipe();
  }
  getAllChatsOfUser(currentUserid: number) {
    return this.http.get(
      `${Constants.baseApi}` + `/user/${currentUserid}/chats`
    );
  }
  getConversation(conversation_id: number) {
    return this.http
      .get(`${Constants.baseApi}` + '/conversation/' + conversation_id)
      .pipe();
  }
  deleteConversation(conversation_id: any) {
    return this.http
      .get(`${Constants.baseApi}` + '/conversation/delete/' + conversation_id)
      .pipe();
  }
  deleteMessage(message_id: any) {
    return this.http
      .delete(`${Constants.baseApi}` + '/message/delete/' + message_id)
      .pipe();
  }
  sendMsg(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/message/send', payload)
      .pipe();
  }
  markMessagesAsRead(conversation_id: any) {
    return this.http
      .get(
        `${Constants.baseApi}` + '/conversation/mark-as-read/' + conversation_id
      )
      .pipe();
  }
  addProductFirstStep(payload: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.Url}` + '/add-product-first-step', payload, {
        headers: this.getHeaders(),
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }
  addProductCompleteStep(payload: any) {
    return this.http.post(`${this.Url}` + '/products', payload).pipe();
  }
  addProductSecondStep(payload: any) {
    return this.http
      .post(`${this.Url}` + '/add-product-second-step', payload)
      .pipe();
  }
  editProductSecondStep(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/edit-product-second-step', payload)
      .pipe();
  }
  addProductThirdStep(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/add-product-third-step', payload)
      .pipe();
  }
  editProductThirdStep(payload: any) {
    return this.http
      .post(`${this.Url}` + '/edit-product-third-step', payload)
      .pipe();
  }
  addProductLastStep(payload: any) {
    return this.http
      .post(`${this.Url}` + '/add-product-last-step', payload)
      .pipe();
  }
  editProductLastStep(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/edit-product-last-step', payload)
      .pipe();
  }
  updateUserImage(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/user', payload)
      .pipe();
  }
  getSignUp(payload: any) {
    return this.http.post(`${Constants.baseApi}` + '/signup', payload).pipe();
  }
  getSelling(url: string = '', user_id: number = 22) {
    return this.http
      .post(`${Constants.baseApi}/products/${url}`, { user_id: user_id })
      .pipe();
  }

  wishListProduct(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/wishlist/products', payload)
      .pipe();
  }
  markAsSold(product: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/products/sold', product)
      .pipe();
  }
  acceptOffer(offerId:any,payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + `/offers/${offerId}/accept`, payload)
      .pipe();
  }
  rejectOffer(offerId:any,payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + `/offers/${offerId}/reject`, payload)
      .pipe();
  }
  placeBid(payload: any) {
    return this.http.post(`${Constants.baseApi}` + '/bids/place', payload).pipe();
  }
  placeOffer(payload: any) {
    return this.http.post(`${Constants.baseApi}` + '/offers', payload).pipe();
  }
  getHighBid(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/bids/highest', payload)
      .pipe();
  }
  getUserInfo(userId: any) {
    return this.http
      .get(`${Constants.baseApi}` + '/user/info/' + userId)
      .pipe();
  }
  getAllProducts(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/get-all-products', payload)
      .pipe();
  }
  deleteProductImage(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/delete-image', payload)
      .pipe();
  }
  udpateProductImage(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/upload-image', payload)
      .pipe();
  }

  getNotification(userId: any, type?: string) {
    let params = new HttpParams();
    if (type) {
      params = params.set('status', type);
    }
  
    return this.http.get(`${Constants.baseApi}/user/${userId}/notifications`, { params }).pipe();
  }
  
  
  customLink(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/custom/link', payload)
      .pipe();
  }
  whoBought(payload: any) {
    return this.http.post(`${Constants.baseApi}` + '/who-bought', payload).pipe();
  }
  reviewToSeller(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/user-review', payload)
      .pipe();
  }
  reportUser(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/report-a-user', payload)
      .pipe();
  }
  forgetPassword(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/forgot-password', payload)
      .pipe();
  }

  updateUserAccount(payload: any): any {
    //({ payload });
    return this.http.post<any>(`${Constants.baseApi}/profile/update`, payload);
  }
  updateProfilePhoto(payload: any): any {
    return this.http.post<any>(
      `${Constants.baseApi}/profile/update-image`,
      payload
    );
  }

  forgetPasswordNumber(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/forgot-password-phone', payload)
      .pipe();
  }
  loginWithPhone(payload: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/login-phone', payload)
      .pipe();
  }
  private geocodeUrl = 'https://maps.googles.com/maps//geocode/json';

  deleteAccount(id: any) {
    return this.http
      .get(`${Constants.baseApi}/profile/deactivate`, {
        headers: this.getHeaders(), // Correctly pass the headers here
      })
      .pipe();
  }
  deleteProduct(product_id: any) {
    const productid = {
      product_id: product_id,
    };
    return this.http
      .post(`${Constants.baseApi}` + '/delete-product', productid)
      .pipe();
  }
  getCategories(data: any = {}): Observable<any[]> {
    return this.http.post<any[]>(`${Constants.baseApi}` + '/categories', data);
  }
  getSubCategories(categoryId: any) {
    const data = {
      category_id: categoryId,
    };
    return this.http.post<any[]>(
      `${Constants.baseApi}` + '/sub-categories',
      data
    );
  }

  getFilteredProducts(data: any = {}): Observable<any[]> {
    //(data, 'data');
    return this.http.post<any[]>(
      `${Constants.baseApi}` + '/get-all-products',
      data
    );
  }
  getProductById(data: any = {}): Observable<any> {
    return this.http.post<any[]>(
      `${Constants.baseApi}` + '/product-detail',
      data
    );
  }
  getSimilarProduct(data: any = {}): Observable<any> {
    return this.http.post<any[]>(
      `${Constants.baseApi}` + '/products/similar',
      data
    );
  }
  storeProductView(data: any) {
    return this.http.post(`${Constants.baseApi}` + '/products/view', data);
  }
  adToCartItem(data: any) {
    return this.http.post(`${Constants.baseApi}` + '/cart/add', data);
  }
  getCartProducts(id: number) {
    return this.http.get(`${Constants.baseApi}` + '/cart/' + id);
  }
  removeCartItem(data: any) {
    return this.http.post(`${Constants.baseApi}` + '/cart/remove', data);
  }
  updateItemQty(data: any) {
    return this.http.post(`${Constants.baseApi}` + '/cart/update', data);
  }
  otpVerify(data: any) {
    return this.http.post<any[]>(`${Constants.baseApi}` + '/otp-verify', data);
  }
  newPassword(data: any) {
    return this.http.post<any[]>(
      `${Constants.baseApi}` + '/new-password',
      data
    );
  }
  // getProductById(url: string): Observable<any> {
  //   return this.http.get<any>(`${Constants.baseApi}/${url}`);
  // }
  getAttributes(): Observable<any> {
    return this.http.get<any>('assets/data.json'); // Adjust path to your JSON or API endpoint
  }
  toggleSaveItem(data: any) {
    return this.http.post<any[]>(`${Constants.baseApi}` + '/save-itme', data);
  }

  getSuggestions(q: string) {
    return this.http.get(`${Constants.baseApi}/search/suggestions?query=${q}`);
  }
  getProfileData() {
    return this.http.get(`${Constants.baseApi}` + '/cart/');
  }
  getUserSavedItems() {
    return this.http.get(`${Constants.baseApi}/save-for-later`);
  }
}
