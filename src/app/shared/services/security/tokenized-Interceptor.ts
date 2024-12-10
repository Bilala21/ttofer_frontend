import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenizedInterceptor implements HttpInterceptor {
  private isErrorShown = false;
  languageCountry:string='';

  constructor(
    private router: Router,
  ) {
    // this.languageCountry = this.secureStorageService.languageCountry ;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const authToken = this.authService.getPortalAccessToken();
    const token = localStorage.getItem('authToken');

    const timeZoneOffset = this.getOffsetInHours();

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {

            this.isErrorShown = true;
        
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }

 

  getOffsetInHours(): number {
    const timeZoneOffsetMinutes: number = new Date().getTimezoneOffset();
    const timeZoneOffsetHours: number = timeZoneOffsetMinutes / 60;
    return -1 * timeZoneOffsetHours;
  }

}
