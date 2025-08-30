import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User, userLogin } from "../../schema/user";
import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-user-login",
  imports: [RouterModule, FormsModule],
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.css"],
})
export class UserLoginComponent implements OnInit {
  constructor(
    private service: UserService,
    private router: Router,
    private cartServ: CartService
  ) {}
  ngOnInit(): void {
    this.service.getLoginStatus().subscribe((isloggedIn) => {
      if (isloggedIn) {
        this.router.navigate([""]);
      }
    });
  }
  handleLogin(data: userLogin, form: NgForm) {
    if (data) {
      this.service.login(data).subscribe((result: User[]) => {
        if (result && result.length > 0) {
          localStorage.setItem("user", JSON.stringify(result[0]));
          this.service.setLoginStatus(true);
          console.warn("while moving the email is ", result[0].email);
          // subscribe to moveLocalToDb
          this.cartServ.moveLocalToDb(result[0].email).subscribe({
            next: () => {
              this.router.navigate([""]);
            },
            error: (err) => console.error(err),
          });
        } else {
          alert("No user found !");
        }
        form.reset();
      });
    }
  }
}
