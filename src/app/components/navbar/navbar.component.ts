import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SellerService } from "../../services/seller.service";
import { Seller } from "../../schema/seller";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faSearch,
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ProductServiceService } from "../../services/product-service.service";
import { Product } from "../../schema/product";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { User } from "../../schema/user";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, FormsModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  cartItemsCount: number = 0;
  isUserLoggedIn: boolean = false;
  userName: string = "";
  searchResults: Product[] = [];
  searchText: string = "";

  isSellerLoggedIn: boolean = false;
  sellerName: string = "";
  seller: Seller = { email: "", name: "", password: "" };
  user: User = { email: "", fullName: "", password: "" };

  faCartShopping = faCartShopping;
  faSearch = faSearch;
  faUser = faUser;

  constructor(
    private sellerServ: SellerService,
    private route: Router,
    private productServ: ProductServiceService,
    private userServ: UserService,
    private cartServ: CartService
  ) {}

  ngOnInit() {
    // Seller login status
    this.sellerServ.getLoginStatus().subscribe((status) => {
      this.isSellerLoggedIn = status;
      const sellerData = JSON.parse(localStorage.getItem("seller") || "null");
      if (sellerData?.length > 0) {
        this.seller = sellerData[0];
        this.sellerName = this.seller.name;
      } else {
        this.seller = { email: "", name: "", password: "" };
        this.sellerName = "";
      }
    });

    // User login status
    this.userServ.getLoginStatus().subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (isLoggedIn && userData) {
        this.user = userData;
        this.userName = this.user.fullName;
      } else {
        this.user = { email: "", fullName: "", password: "" };
        this.userName = "";
      }
      // Always emit initial cart count after knowing login status
      this.cartServ.emitCartCount();
    });

    // Subscribe to cartChanges for automatic updates
    this.cartServ.cartChanges.subscribe((count) => {
      this.cartItemsCount = count;
    });
  }

  Logout() {
    if (confirm("Are you sure you want to logout")) {
      localStorage.removeItem("seller");
      this.sellerServ.setLoginStatus(false);
      this.route.navigate(["/"]);
      alert("You have been successfully logged out!");
    }
  }

  logoutUser() {
    if (confirm("Are you sure you want to logout")) {
      localStorage.removeItem("user");
      this.userServ.setLoginStatus(false);
      this.route.navigate(["/"]);
      alert("You have been successfully logged out!");
    }
  }

  handleChange(query: Event) {
    const target = query.target as HTMLInputElement;
    this.searchText = target.value;
    this.productServ.searchProduct(this.searchText).subscribe((result) => {
      this.searchResults = result;
    });
  }

  selectResult(id: string) {
    this.route.navigate(["product-details", id]);
    this.searchResults = [];
    this.searchText = "";
  }

  search(val: string) {
    if (val) {
      this.route.navigate(["search", val]);
      this.searchResults = [];
      this.searchText = "";
    }
  }
}
