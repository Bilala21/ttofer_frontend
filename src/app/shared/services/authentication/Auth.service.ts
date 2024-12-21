import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { from, Observable, Subject } from 'rxjs';
import { Constants } from '../../../../../public/constants/constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private provider = new GoogleAuthProvider();
constructor(private auth: Auth,private http:HttpClient) { }
signInWithGoogle(): Observable<UserCredential> {
  return from(signInWithPopup(this.auth, this.provider));
}
signOut() {
  return from(this.auth.signOut());
}
logOut(): Observable<any> {
  return this.http.post(`${Constants.baseApi}` + '/logout', {});
}
private openModalSource = new Subject<void>();
openModal$ = this.openModalSource.asObservable();
triggerOpenModal() {
  this.openModalSource.next();
}
}
