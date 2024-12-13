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
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
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
}
