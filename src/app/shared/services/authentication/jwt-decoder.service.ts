import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
public decodedToken:any
constructor() { 
const token :any = localStorage.getItem('authToken');
this.decodedToken = this.decodeTokenManually(token);
}
decodeTokenManually(token: string): any {
    try {
      // debugger
      const payload = token.split('.')[1]; 
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
}
  
}

