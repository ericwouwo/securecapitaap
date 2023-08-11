import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server: string = 'http://localhost:9095';

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.post<CustomHttpResponse<Profile>>
      (`${this.server}/users/login`, { email, password })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
      (`${this.server}/users/verify/code/${email}/${code}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  private handleError(handleError: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (handleError.error instanceof ErrorEvent) {
      errorMessage = `A client error occured - ${handleError.error.message}`;
    } else {
      if (handleError.error.reason) {
        errorMessage = handleError.error.reason;
      } else {
        errorMessage = `An error occured - Error status ${handleError.status}`;
      }
    }

    return throwError(() => errorMessage)
  }
}
