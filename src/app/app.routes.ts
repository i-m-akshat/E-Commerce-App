import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { SellerAuthComponent } from "./components/seller-auth/seller-auth.component";
import { LoginComponent } from "./components/login/login.component";
import { SellerHomeComponent } from "./components/seller-home/seller-home.component";
import { authGuard } from "./auth.guard";
import { SellerProductComponent } from "./components/seller-product/seller-product.component";
import { SellerProductAddComponent } from "./components/seller-product-add/seller-product-add.component";
import { SellerProductUpdateComponent } from "./components/seller-product-update/seller-product-update.component";
import { SellerProductViewComponent } from "./components/seller-product-view/seller-product-view.component";
import { SearchComponent } from "./components/search/search.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { ProductsComponent } from "./components/products/products.component";
import { UserLoginComponent } from "./components/user-login/user-login.component";
import { UserSignUpComponent } from "./components/user-sign-up/user-sign-up.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { userGuardGuard } from "./user-guard.guard";
import { MyOrdersComponent } from "./components/my-orders/my-orders.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "seller-auth", component: SellerAuthComponent },
  { path: "login", component: LoginComponent },
  {
    path: "seller-home",
    component: SellerHomeComponent,
    canActivate: [authGuard],
  },

  {
    path: "seller-product",
    component: SellerProductComponent,
    canActivate: [authGuard],
  },
  {
    path: "add-product",
    component: SellerProductAddComponent,
    canActivate: [authGuard],
  },
  {
    path: "update-product/:id",
    component: SellerProductUpdateComponent,
    canActivate: [authGuard],
  },
  {
    path: "seller-product-view/:id",
    component: SellerProductViewComponent,
    canActivate: [authGuard],
  },
  {
    path: "search/:query",
    component: SearchComponent,
  },
  {
    path: "product-details/:id",
    component: ProductDetailsComponent,
  },
  {
    path: "products",
    component: ProductsComponent,
  },
  {
    path: "user-login",
    component: UserLoginComponent,
  },
  {
    path: "user-sign-up",
    component: UserSignUpComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [userGuardGuard],
  },
  {
    path: "my-orders",
    component: MyOrdersComponent,
    canActivate: [userGuardGuard],
  },
];
