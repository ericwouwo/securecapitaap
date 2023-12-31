import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { VerifyComponent } from './component/verify/verify.component';
import { CustomerComponent } from './component/customer/customer.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HomeComponent } from './component/home/home.component';
import { AuthenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'resetpassword', component: ResetpasswordComponent},
  {path: 'users/verify/account/:key', component: VerifyComponent},
  {path: 'users/verify/password/:key', component: VerifyComponent},
  {path: 'customers', component: CustomerComponent, canActivate: [AuthenticationGuard]},
  {path: 'profile', component: ProfileComponent , canActivate: [AuthenticationGuard]},
  {path: '',  component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo:'/' , pathMatch: 'full'},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
