import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "./services/user.service";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

export const userGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  return userService.getLoginStatus().pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return true;
      } else {
        snackBar.open("You must log in to access this page", "OK", {
          horizontalPosition: "end",
          duration: 3000,
        });
        router.navigate(["/user-login"]);
        return false;
      }
    })
  );
};
