import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../service/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard {

    private readonly server: string = 'http://localhost:9095';
    private jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private userService: UserService, private router: Router) { }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isAuthenticated();
    }


    private isAuthenticated(): boolean {
        if(this.userService.isAuthenticated()){
            return true;
        } else {
            this.router.navigate(['/login'])
        }
    }


}
