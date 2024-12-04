import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
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

  getAuthByLogin(input: any): Observable<any> {
    return this.http
      .post(`${Constants.baseApi}` + '/login-email', input)
      .pipe
      // catchError()
      ();
  }
  getAuthByLoginNumber(input: any): Observable<any> {
    return this.http
      .post(`${Constants.baseApi}` + '/login-phone', input)
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
  addWishList(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/wishlist/toggle', input)
      .pipe();
  }
  removeWishList(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/remove-wishlist-products', input)
      .pipe();
  }
  updateUserName(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/user/name', input)
      .pipe();
  }
  updateNumber(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/phone/number', input)
      .pipe();
  }
  updateEmail(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/email', input)
      .pipe();
  }
  updatePassword(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/password', input)
      .pipe();
  }
  updateLocation(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/location', input)
      .pipe();
  }
  getPlacedBids(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/get-product-bids', input)
      .pipe();
  }
  makeOffer(input: any) {
    return this.http.post(`${Constants.baseApi}` + '/make-offer', input).pipe();
  }
  getOffer(input: any) {
    return this.http.post(`${Constants.baseApi}` + '/get-offer', input).pipe();
  }
  getAllChatsOfUser(currentUserid: number) {
    return this.http.get(
      `${Constants.baseApi}` + `/user/${ currentUserid }/chats`
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
      .get(`${Constants.baseApi}` + '/message/delete/' + message_id)
      .pipe();
  }
  sendMsg(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/message/send', input)
      .pipe();
  }
  markMessagesAsRead(conversation_id: any) {
    return this.http
      .get(
        `${Constants.baseApi}` + '/conversation/mark-as-read/' + conversation_id
      )
      .pipe();
  }
  addProductFirstStep(input: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.Url}` + '/add-product-first-step', input, {
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
  addProductCompleteStep(input: any) {
    return this.http.post(`${this.Url}` + '/products', input).pipe();
  }
  addProductSecondStep(input: any) {
    return this.http
      .post(`${this.Url}` + '/add-product-second-step', input)
      .pipe();
  }
  editProductSecondStep(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/edit-product-second-step', input)
      .pipe();
  }
  addProductThirdStep(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/add-product-third-step', input)
      .pipe();
  }
  editProductThirdStep(input: any) {
    return this.http
      .post(`${this.Url}` + '/edit-product-third-step', input)
      .pipe();
  }
  addProductLastStep(input: any) {
    return this.http
      .post(`${this.Url}` + '/add-product-last-step', input)
      .pipe();
  }
  editProductLastStep(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/edit-product-last-step', input)
      .pipe();
  }
  updateUserImage(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/user', input)
      .pipe();
  }
  getSignUp(input: any) {
    return this.http.post(`${Constants.baseApi}` + '/signup', input).pipe();
  }
  getSelling(url: string = '', user_id: number = 22) {
    return this.http
      .post(`${Constants.baseApi}/products/${url}`, { user_id: user_id })
      .pipe();
  }

  wishListProduct(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/wishlist/products', input)
      .pipe();
  }
  markAsSold(productId: any) {
    return this.http
      .get(`${Constants.baseApi}` + '/mark-product-sold/' + productId)
      .pipe();
  }
  acceptOffer(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/accept-offer', input)
      .pipe();
  }
  rejectOffer(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/reject-offer', input)
      .pipe();
  }
  placeBid(input: any) {
    return this.http.post(`${Constants.baseApi}` + '/place-bid', input).pipe();
  }
  getUserInfo(userId: any) {
    return this.http
      .get(`${Constants.baseApi}` + '/user/info/' + userId)
      .pipe();
  }
  getAllProducts(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/get-all-products', input)
      .pipe();
  }
  deleteProductImage(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/delete-image', input)
      .pipe();
  }
  udpateProductImage(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/upload-image', input)
      .pipe();
  }
  // getNotification(userId: any) {
  //   return this.http.get(`${Constants.baseApi}` + '/get/user/unread/notifications/' + userId).pipe();
  // }
  getNotification(userId: any, type: any) {
    return this.http
      .get(
        `${Constants.baseApi}` +
          '/get/user/all/notifications/' +
          { userId, type }
      )
      .pipe();
  }
  customLink(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/update/custom/link', input)
      .pipe();
  }
  whoBought(input: any) {
    return this.http.post(`${Constants.baseApi}` + '/who-bought', input).pipe();
  }
  reviewToSeller(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/user-review', input)
      .pipe();
  }
  reportUser(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/report-a-user', input)
      .pipe();
  }
  forgetPassword(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/forgot-password', input)
      .pipe();
  }

  updateUserAccount(input: any): any {
    console.log({ input });
    return this.http.post<any>(`${Constants.baseApi}/profile/update`, input, {
      headers: this.getHeaders(),
    });
  }

  forgetPasswordNumber(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/forgot-password-phone', input)
      .pipe();
  }
  loginWithPhone(input: any) {
    return this.http
      .post(`${Constants.baseApi}` + '/login-phone', input)
      .pipe();
  }
  private geocodeUrl = 'https://maps.googles.com/maps//geocode/json';

  deleteAccount(id: any) {
    return this.http
      .get(`${Constants.baseApi}/account/deactivate/${id}`, {
        headers: this.getHeaders(), // Correctly pass the headers here
      })
      .pipe();
  }
deleteProduct(product_id:any){
  const productid={
    product_id:product_id
  }
  return this.http
  .post(`${Constants.baseApi}` + '/delete-product', productid)
  .pipe();}
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
  getCartProducts(id:number) {
    return this.http.get(`${Constants.baseApi}` + '/cart/'+id);
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
}
