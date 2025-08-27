import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User, userLogin } from "../../schema/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-user-login",
  imports: [RouterModule, FormsModule],
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.css"],
})
export class UserLoginComponent implements OnInit {
  constructor(private service: UserService, private router: Router) {}
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
          this.router.navigate([""]);
        } else {
          alert("No user found !");
        }
        form.reset();
      });
    }
  }
}
