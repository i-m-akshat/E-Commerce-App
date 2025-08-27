import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User, userLogin } from "../schema/user";
import { HttpClient, HttpResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {
    this.reloadUser();
  }

  signUp(userDetails: User): Observable<HttpResponse<User>> {
    if (!userDetails) {
      throw new Error("User details cannot be null");
    }

    return this.httpClient.post<User>(
      "http://localhost:3000/users",
      userDetails,
      { observe: "response" }
    );
  }

  login(userDetails: userLogin): Observable<User[]> {
    return this.httpClient.get<User[]>(
      `http://localhost:3000/users?email=${userDetails.email}&password=${userDetails.password}`
    );
  }

  reloadUser() {
    const user = localStorage.getItem("user");
    this.setLoginStatus(!!user);
  }

  setLoginStatus(status: boolean) {
    this.isUserLoggedIn.next(status);
  }

  getLoginStatus(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }
}
