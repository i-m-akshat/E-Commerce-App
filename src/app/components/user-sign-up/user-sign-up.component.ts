import { Component, OnInit } from "@angular/core";
import { Form, FormControl, FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { User } from "../../schema/user";
import { HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
@Component({
  selector: "app-user-sign-up",
  imports: [FormsModule],
  templateUrl: "./user-sign-up.component.html",
  styleUrl: "./user-sign-up.component.css",
})
export class UserSignUpComponent implements OnInit {
  userSignUpDetails: User = {
    email: "",
    fullName: "",
    password: "",
  };
  constructor(private service: UserService, private router: Router) {}
  ngOnInit(): void {
    this.service.getLoginStatus().subscribe((isloggedIn) => {
      if (isloggedIn) {
        this.router.navigate([""]);
      }
    });
  }
  handleSignUp(data: User, form: NgForm) {
    if (data != null) {
      this.userSignUpDetails = {
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      };
      this.service
        .signUp(this.userSignUpDetails)
        .subscribe((result: HttpResponse<User>) => {
          if (result.body != null) {
            result.body.password = "";
            localStorage.setItem("user", JSON.stringify(result.body));
            alert("Sign Up Successfull");
            this.router.navigate(["/"]);
          }
        });
    }
    form.reset();
  }
}
