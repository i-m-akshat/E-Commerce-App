import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SellerService } from "../../services/seller.service";
import { Seller } from "../../schema/seller";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { ProductServiceService } from "../../services/product-service.service";
import { Product } from "../../schema/product";
import { FormsModule } from "@angular/forms";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserService } from "../../services/user.service";
import { User } from "../../schema/user";
import { CartService } from "../../services/cart.service";
@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, FormsModule], // only what you need
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  cartItemsCount: number = 0;
  isUserLoggedIn: boolean = false;
  userName: string = "";
  searchResults: Product[] = [];
  searchText: string = "";
  constructor(
    private sellerServ: SellerService,
    private route: Router,
    private productServ: ProductServiceService,
    private userServ: UserService,
    private cartServ: CartService
  ) {}
  isSellerLoggedIn: boolean = false;
  sellerName: string = "";
  seller: Seller = {
    email: "",
    name: "",
    password: "",
  };
  user: User = {
    email: "",
    fullName: "",
    password: "",
  };
  faCartShopping = faCartShopping;
  faSearch = faSearch;
  faUser = faUser;
  //Anything that tries to use this before the constructor finishes (like calling a service).
  ngOnInit() {
    //this runs after angular is done constructing your class you can put only properties and methods without ngOninit but if u r setting some values by calling another service then you will be using ngOnit
    this.sellerServ.getLoginStatus().subscribe((status) => {
      this.isSellerLoggedIn = status;
      const sellerData = JSON.parse(localStorage.getItem("seller") || "null");
      if (sellerData && sellerData.length > 0) {
        this.seller = sellerData[0];
        this.sellerName = this.seller.name;
      } else {
        this.seller = { email: "", name: "", password: "" };
        this.sellerName = "";
      }
    });
    this.userServ.getLoginStatus().subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
      console.log("userloggedin", this.isUserLoggedIn);
      if (isLoggedIn) {
        const UserData = JSON.parse(localStorage.getItem("user") || "null");
        if (UserData && UserData.length > 0) {
          this.user = UserData[0];
          this.userName = this.user.fullName;
        } else {
          this.user = { email: "", fullName: "", password: "" };
          this.userName = "";
        }
      } else {
        this.cartItemsCount = this.cartServ.countCartItems_local();
      }
    });
    this.cartServ.cartChanges.subscribe((count) => {
      this.cartItemsCount = count;
    });
  }
  Logout() {
    var res = confirm("Are you sure you want to logout");
    if (res) {
      localStorage.removeItem("seller");
      this.sellerServ.setLoginStatus(false);
      this.route.navigate(["/"]);
      alert("You have been successfully logged out!");
    }
  }
  logoutUser() {
    var res = confirm("Are you sure you want to logout");
    if (res) {
      localStorage.removeItem("user");
      this.userServ.setLoginStatus(false);
      this.route.navigate(["/"]);
      alert("You have been successfully logged out!");
    }
  }
  handleChange(query: Event) {
    var target = query.target as HTMLInputElement;
    this.searchText = target.value;
    this.productServ.searchProduct(this.searchText).subscribe((result) => {
      this.searchResults = result;
    });
  }
  selectResult(id: string) {
    // navigate to the product page
    this.route.navigate(["product-details", id]); //navuigate by url is more like raw address Think of it like: "Here’s the full address string, just go there directly."

    this.searchResults = [];
    this.searchText = "";
  }
  search(val: string) {
    if (val != "") {
      this.route.navigate(["search", val]);
      this.searchResults = [];
      this.searchText = "";
    }
  }
}

/**
 * reason why the navigate by url dont relaod and navigate reload
 * 
 * navigate: You’re telling Angular → “I’m going to the place defined in the routing config with a new parameter.” Angular sees → “Ah, same component, but new id param” → so it triggers the param change subscription inside that component.

navigateByUrl: You’re telling Angular → “Here’s a raw URL string.” Angular checks → “This URL maps to the same route I’m already showing. I don’t need to rebuild the component.” → so it reuses the component without firing param updates, unless you manually force reload.
 * 
 */
