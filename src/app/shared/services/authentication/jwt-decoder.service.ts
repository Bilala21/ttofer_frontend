import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class JwtDecoderService {
  public decodedToken: any;
  constructor() {
    const token: any = localStorage.getItem('authToken');
    this.decodedToken = this.decodeTokenManually(token)?.user;
  }

  decodeTokenManually(token: string): any {
    try {
      return token ? jwtDecode(token) : null;
    } catch (error) {
      return null;
    }
  }
}
