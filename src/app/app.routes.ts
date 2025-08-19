import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SellerAuthComponent } from './components/seller-auth/seller-auth.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },             
    { path: 'seller-auth', component: SellerAuthComponent }, 
    { path: 'login', component: LoginComponent }     
];
