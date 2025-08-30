import { Component, OnInit } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faSearch,
  faCartShopping,
  faUser,
  faB,
} from "@fortawesome/free-solid-svg-icons";

import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";
import { SellerService } from "../../services/seller.service";
import { ProductServiceService } from "../../services/product-service.service";

import { Product } from "../../schema/product";
import { faBox } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, FormsModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  // Icons
  faCartShopping = faCartShopping;
  faSearch = faSearch;
  faUser = faUser;
  faBox = faBox;
  // User & Seller state
  isUserLoggedIn: boolean = false;
  userName: string = "";
  isSellerLoggedIn: boolean = false;
  sellerName: string = "";

  // Cart
  cartItemsCount: number = 0;

  // Search
  searchText: string = "";
  searchResults: Product[] = [];

  constructor(
    private router: Router,
    private userServ: UserService,
    private sellerServ: SellerService,
    private cartServ: CartService,
    private productServ: ProductServiceService
  ) {}

  ngOnInit() {
    // --------- User login status ----------
    this.userServ.getLoginStatus().subscribe((status) => {
      this.isUserLoggedIn = status;
      const userData = status
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;
      this.userName = userData ? userData.fullName : "";

      // Emit cart count for the current user
      const email = userData?.email ?? "";
      this.cartServ.emitCartCount(email);
    });

    // --------- Seller login status ----------
    this.sellerServ.getLoginStatus().subscribe((status) => {
      this.isSellerLoggedIn = status;
      const sellerData = status
        ? JSON.parse(localStorage.getItem("seller") || "null")
        : null;
      this.sellerName = sellerData?.name ?? "";
    });

    // --------- Cart count subscription ----------
    this.cartServ.cartChanges$.subscribe((count) => {
      this.cartItemsCount = count;
    });
  }

  // --------- User logout ----------
  logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      this.userServ.setLoginStatus(false);
      alert("You have been successfully logged out!");
      this.router.navigate(["/"]);
      this.cartServ.emitCartCount("");
    }
  }

  // --------- Seller logout ----------
  logoutSeller() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("seller");
      this.sellerServ.setLoginStatus(false);
      this.router.navigate(["/"]);
      alert("You have been successfully logged out!");
    }
  }

  // --------- Search ----------
  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;

    if (this.searchText.trim()) {
      this.productServ.searchProduct(this.searchText).subscribe((results) => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  selectResult(id: string) {
    this.router.navigate(["product-details", id]);
    this.searchResults = [];
    this.searchText = "";
  }

  search(val: string) {
    if (val.trim()) {
      this.router.navigate(["search", val]);
      this.searchResults = [];
      this.searchText = "";
    }
  }
}
