import { Component, OnInit } from "@angular/core";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { Product } from "../../schema/product";
import { ProductServiceService } from "../../services/product-service.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-home",
  imports: [NgbCarouselModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  popularProducts: Product[] = [];
  trendyProducts: Product[] = [];
  isUserLoggedIn: boolean = false;
  userEmail: string = ""; // store logged-in user's email

  constructor(
    private service: ProductServiceService,
    private router: Router,
    private userServ: UserService,
    private cartServ: CartService
  ) {}

  ngOnInit() {
    // Track login status
    this.userServ.getLoginStatus().subscribe((status) => {
      this.isUserLoggedIn = status;
      if (status) {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        this.userEmail = user?.email ?? "";
      }
    });

    // Load popular products
    this.service.getPopularProducts().subscribe((products: Product[]) => {
      this.popularProducts = products;
    });

    // Load trendy products
    this.service.getTrendyProducts().subscribe((products: Product[]) => {
      this.trendyProducts = products;
    });
  }

  ViewProduct(id: string) {
    this.router.navigate(["product-details", id]);
  }

  AddToCart(id: string) {
    this.service.getProductByID(id).subscribe((productDetails: Product) => {
      if (!productDetails) return;

      // Default quantity
      productDetails.productQuantity = 1;

      if (this.isUserLoggedIn) {
        // Logged-in user: use DB cart
        const cartPayload = {
          id: "",
          productId: productDetails.id,
          productName: productDetails.productName,
          productPrice: productDetails.productPrice,
          productColor: productDetails.productColor,
          productCategory: productDetails.productCategory,
          productDescription: productDetails.productDescription,
          productImageUrl: productDetails.productImageUrl,
          productQuantity: productDetails.productQuantity,
          email: this.userEmail,
        };

        this.cartServ.AddToCart(cartPayload).subscribe({
          next: () => {
            this.cartServ.emitCartCount();
            this.router.navigate(["/cart"]);
          },
          error: (err) => console.error("Failed to add to cart:", err),
        });
      } else {
        // Guest user: local cart
        const guestEmail = ""; // optional placeholder
        const res = this.cartServ.AddToCart_Local(productDetails, guestEmail);
        if (res) {
          this.cartServ.emitCartCount();
          this.router.navigate(["/cart"]);
        }
      }
    });
  }
}
