import { EventEmitter, Injectable } from "@angular/core";
import { Seller, SellerLogin } from "../schema/seller";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginSuccessfull = new EventEmitter<boolean>(false);
  isSignUpSuccessfull = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient) {
    this.reloadSeller();
  }
  userSignUp(data: Seller) {
    return this.http.post<Seller>("http://localhost:3000/seller", data, {
      observe: "response",
    });
  }
  sellerLogin(data: SellerLogin) {
    return this.http.get<Seller[]>(
      `http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: "response" }
    );
  }
  //check each time on reload
  reloadSeller() {
    if (localStorage.getItem("seller")) {
      this.setLoginStatus(true);
    } else {
      this.setLoginStatus(false);
    }
  }

  //helper functions

  setLoginStatus(status: boolean) {
    this.isSellerLoggedIn.next(status);
  }
  getLoginStatus() {
    return this.isSellerLoggedIn.asObservable(); //for encapsulation so that user cant edit or next the value thats why we are using as observable here
  }
}
