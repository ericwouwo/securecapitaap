import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';

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

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
      (`${this.server}/users/profile`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/update`, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
      (`${this.server}/users/refresh/token`, { headers: { Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}` } })
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
        }),
        catchError(this.handleError)
      )

  updatePassword$ = (form: { currentPassword: string, newPassword: string, confirmNewPassword: string }) => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/update/password`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  updateRoles$ = (roleName: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/update/role/${roleName}`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  updateAccountSettings$ = (settingsForm: { enabled: boolean, locked: boolean }) => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/update/settings`, settingsForm)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  toggleMfa$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/togglemfa`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  updateImage$ = (formData: FormData) => <Observable<CustomHttpResponse<Profile>>>
    this.http.put<CustomHttpResponse<Profile>>
      (`${this.server}/users/update/image`, formData)
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
    console.log(errorMessage);

    return throwError(() => errorMessage)
  }
}
