import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { Key } from '../enum/key.enum';
import { UserService } from '../service/user.service';
import { CustomHttpResponse, Profile } from '../interface/appstates';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  private resfreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject(null);

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {

    if (this.isUrlCanBeIntercepts(request)) {
      return next.handle(this.addAuthorizationTokenHeader(request, localStorage.getItem(Key.TOKEN))
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse && error.status == 401 && error.error.reason.includes('expired')) {
            return this.handleRefreshToken(request, next);
          } else {
            return throwError(() => error);
          }
        })
      );
    }
    return next.handle(request);
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isTokenRefreshing) {
      console.log('Refreshing Token...');
      if (!this.isTokenRefreshing) {
        this.isTokenRefreshing = true;
        this.resfreshTokenSubject.next(null);
        return this.userService.refreshToken$().pipe(
          switchMap((response) => {
            console.log('Token Refresh Response:', response);
            this.isTokenRefreshing = false;
            this.resfreshTokenSubject.next(response);
            console.log('New Token:', response.data.access_token);
            console.log('Sending original request:', request);
            return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token))

          })
        )
      } else {
        this.resfreshTokenSubject.pipe(
          switchMap((response) => {
            return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token))
          })
        )
      }
    }
  }

  private isUrlCanBeIntercepts(resquest: HttpRequest<unknown>): boolean {
    return !(resquest.url.includes('verify') || resquest.url.includes('login')
      || resquest.url.includes('register') || resquest.url.includes('refresh') || resquest.url.includes('resetpassword'));
  }

  private addAuthorizationTokenHeader(resquest: HttpRequest<unknown>, token: string): HttpRequest<any> {
    let header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return resquest.clone({ headers: header })
    // return resquest.clone({headers: {Autorization: `Bearer ${token}`}})
  }
}
