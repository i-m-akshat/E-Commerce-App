import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SellerAuthComponent } from './components/seller-auth/seller-auth.component';
import { LoginComponent } from './components/login/login.component';
import { SellerHomeComponent } from './components/seller-home/seller-home.component';
import { authGuard } from './auth.guard';
import { SellerProductComponent } from './components/seller-product/seller-product.component';
import { SellerProductAddComponent } from './components/seller-product-add/seller-product-add.component';
import { SellerProductUpdateComponent } from './components/seller-product-update/seller-product-update.component';
import { SellerProductViewComponent } from './components/seller-product-view/seller-product-view.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seller-auth', component: SellerAuthComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'seller-home',
    component: SellerHomeComponent,
    canActivate: [authGuard],
  },

  {
    path: 'seller-product',
    component: SellerProductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-product',
    component: SellerProductAddComponent,
    canActivate: [authGuard],
  },
  {
    path: 'update-product/:id',
    component: SellerProductUpdateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'seller-product-view/:id',
    component: SellerProductViewComponent,
    canActivate: [authGuard],
  },
];
