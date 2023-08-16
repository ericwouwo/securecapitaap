import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomHttpResponse, Page, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';
import { Stats } from '../interface/stats';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly server: string = 'http://localhost:9095';

  constructor(private http: HttpClient) { }

  customers$ = (page: number = 0, size: number = 10) => <Observable<CustomHttpResponse<Page & User & Stats>>>
    this.http.get<CustomHttpResponse<Page & User & Stats>>
      (`${this.server}/customers/list?page=${page}`)
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
