// import { inject } from '@angular/core';
// import { CanActivateFn } from '@angular/router';
// import { SellerService } from './services/seller.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const sellerService = inject(SellerService); //method dependency injection

//   return sellerService.getLoginStatus(); //means here we wont be using observable ,subscribe
// };

import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { SellerService } from "./services/seller.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { map } from "rxjs/operators";

export const authGuard: CanActivateFn = (route, state) => {
  const sellerService = inject(SellerService);
  const router = inject(Router); //standalone injection or functional dependency injection
  const snackBar = inject(MatSnackBar);

  return sellerService.getLoginStatus().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        snackBar.open("You must log in to access this page", "OK", {
          horizontalPosition: "end",
          duration: 3000,
        });
        return router.createUrlTree(["/login"]);
      }
    })
  );
};
