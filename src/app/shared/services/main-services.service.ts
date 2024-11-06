import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainServicesService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }
  // private apiUrl = 'https://www.ttoffer.com/backend/public/';
  private apiUrl = 'https://ttoffer.com/backend/public/web-api/v1/web/';
  // https://ttoffer.com/backend/public/api/v1/web new base url for web
  // private apiUrl = 'https://www.control.ttoffer.com/';
  // private getHeaders(): HttpHeaders {
  //   let headersConfig:any = {
  //     'Content-Type': 'application/json',
  //   };

  //   if (isPlatformBrowser(this.platformId)) {
  //
  //     const token = localStorage.getItem('authToken');
  //     if (token) {
  //       headersConfig['Authorization'] = `Bearer ${token}`;
  //     }
  //   }

  //   return new HttpHeaders(headersConfig);
  // }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAuthByLogin(input: any): Observable<any> {

    return this.http.post(`${this.apiUrl}` + 'login-email', input).pipe(
      // catchError()
    );
  }
  // getFeatureProduct(): Observable<any> {
  //   return this.http.post(`${this.apiUrl}api/featured-products`, null, { headers: this.getHeaders() });
  // }
  getBanners(): Observable<any> {

    return this.http.get(`${this.apiUrl}get-banners`);
  }
  getFeatureProduct(): Observable<any> {

    return this.http.post(`${this.apiUrl}featured-products`, null);
  }
  getAuctionProduct(): Observable<any> {
    return this.http.post(`${this.apiUrl}auction-products`, null);
  }
  addWishList(input: any) {
    return this.http.post(`${this.apiUrl}` + 'web-api/toggle-wishlist-product', input).pipe();
  }
  removeWishList(input: any) {
    return this.http.post(`${this.apiUrl}` + 'remove-wishlist-products', input).pipe();
  }
  updateUserName(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/user/name', input).pipe();
  }
  updateNumber(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/phone/number', input).pipe();
  }
  updateEmail(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/email', input).pipe();
  }
  updatePassword(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/password', input).pipe();
  }
  updateLocation(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/location', input).pipe();
  }
  getPlacedBids(input: any) {
    return this.http.post(`${this.apiUrl}` + 'get-placed-bids', input).pipe();
  }
  makeOffer(input: any) {
    return this.http.post(`${this.apiUrl}` + 'make-offer', input).pipe();
  }
  getOffer(input:any){
    return this.http.post(`${this.apiUrl}` + 'get-offer', input).pipe();
  }
  getAllChatsOfUser(currentUserid: number) {
    return this.http.get(`${this.apiUrl}` + 'get/user/all/chats/' + currentUserid).pipe();
  }
  getConversation(conversation_id: number) {
    return this.http.get(`${this.apiUrl}` + 'get/conversation/' + conversation_id).pipe();
  }
  deleteConversation(conversation_id:any){
    return this.http.get(`${this.apiUrl}` + 'delete/conversation/' + conversation_id).pipe();

  }
  sendMsg(input: any) {
    return this.http.post(`${this.apiUrl}` + 'send_msg', input).pipe();
  }
  markMessagesAsRead(conversation_id:any) {
    return this.http.get(`${this.apiUrl}`+'mark/conversation/read/' + conversation_id).pipe();
}
  addProductFirstStep(input: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}` + 'add-product-first-step', input, {
      headers: this.getHeaders(),
      reportProgress: true,
      observe: "events"
    }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
  addProductSecondStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'add-product-second-step', input).pipe();
  }
  editProductSecondStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'edit-product-second-step', input).pipe();
  }
  addProductThirdStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'add-product-third-step', input).pipe();
  }
  editProductThirdStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'edit-product-third-step', input).pipe();
  }
  addProductLastStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'add-product-last-step', input).pipe();
  }
  editProductLastStep(input: any) {
    return this.http.post(`${this.apiUrl}` + 'edit-product-last-step', input).pipe();
  }
  updateUserImage(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/user', input).pipe();
  }
  getSignUp(input: any) {
    return this.http.post(`${this.apiUrl}` + 'signup', input).pipe();
  }
  getSelling() {
    return this.http.get(`${this.apiUrl}` + 'selling-screen').pipe();
  }

  wishListProduct(input: any) {
    return this.http.post(`${this.apiUrl}` + 'wishlist-products', input).pipe();
  }
  markAsSold(productId: any) {
    return this.http.get(`${this.apiUrl}` + 'mark-product-sold/' + productId).pipe();
  }
  acceptOffer(input: any) {
    return this.http.post(`${this.apiUrl}` + 'accept-offer', input).pipe();
  }
  rejectOffer(input: any) {
    return this.http.post(`${this.apiUrl}` + 'reject-offer', input).pipe();
  }
  placeBid(input: any) {
    return this.http.post(`${this.apiUrl}` + 'place-bid', input).pipe();
  }
  getUserInfo(userId: any) {
    return this.http.get(`${this.apiUrl}` + 'user/info/' + userId).pipe();
  }
  getAllProducts(input: any) {
    return this.http.post(`${this.apiUrl}` + 'get-all-products', input).pipe();
  }
  deleteProductImage(input: any) {
    return this.http.post(`${this.apiUrl}` + 'delete-image', input).pipe();
  }
  udpateProductImage(input: any) {
    return this.http.post(`${this.apiUrl}` + 'upload-image', input).pipe();
  }
  getNotification(userId: any) {
    return this.http.get(`${this.apiUrl}` + 'get/user/all/notifications/' + userId).pipe();
  }
  customLink(input: any) {
    return this.http.post(`${this.apiUrl}` + 'update/custom/link', input).pipe();
  }
  whoBought(input: any) {
    return this.http.post(`${this.apiUrl}` + 'who-bought', input).pipe();
  }
  reviewToSeller(input: any) {
    return this.http.post(`${this.apiUrl}` + 'user-review', input).pipe();
  }
  reportUser(input: any) {
    return this.http.post(`${this.apiUrl}` + 'report-a-user', input).pipe();
  }
  forgetPassword(input: any) {
    return this.http.post(`${this.apiUrl}` + 'forgot-password', input).pipe();
  }
  loginWithPhone(input: any) {
    return this.http.post(`${this.apiUrl}` + 'login-phone', input).pipe();
  }
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  getGeocodedLocation(lat: number, lng: number): Promise<any> {
    const url = `${this.geocodeUrl}?latlng=${lat},${lng}&key=AIzaSyBuEU8bWRV3H-xNGOUCvCH4R3PMPveyGlI`;
    return this.http.get(url).toPromise();
  }
  deleteAccount(id: any) {
    return this.http.get(`${this.apiUrl}account/deactivate/${id}`, {
      headers: this.getHeaders() // Correctly pass the headers here
    }).pipe();
  }

  getCategories(data: any = {}): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}` + 'categories', data);
  }
  getSubCategories(categoryId: any) {
    const data = {
      category_id: categoryId
    }
    return this.http.post<any[]>(`${this.apiUrl}` + 'sub-categories', data);
  }

  getFilteredProducts(data: any = {}): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}` + 'get-all-products', data);
  }
  getProductById(data: any = {}): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}` + 'product-detail', data);
  }
  // getProductById(url: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}api/${url}`);
  // }
}
