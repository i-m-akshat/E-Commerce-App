import { Component, OnInit } from "@angular/core";
import { ProductServiceService } from "../../services/product-service.service";
import { Product } from "../../schema/product";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { CartService } from "../../services/cart.service";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { cartItems } from "../../schema/cart";

@Component({
  selector: "app-products",
  imports: [FontAwesomeModule],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  products!: Product[];
  isUserLoggedIn: boolean = false;
  userEmail: string = ""; // store logged-in user's email
  faEye = faEye;
  faCartShopping = faCartShopping;

  constructor(
    private service: ProductServiceService,
    private cartServ: CartService,
    private userServ: UserService,
    private route: Router
  ) {}

  ngOnInit() {
    this.userServ.getLoginStatus().subscribe((status) => {
      this.isUserLoggedIn = status;
      if (status) {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        this.userEmail = user?.email ?? "";
      }
    });
    this.reloadList();
  }

  reloadList() {
    this.service.getProducts().subscribe((result: Product[]) => {
      if (result) this.products = result;
    });
  }

  AddToCart(productId: string) {
    this.service.getProductByID(productId).subscribe({
      next: (product) => {
        if (!product) return;

        // Default quantity
        product.productQuantity = 1;

        if (this.isUserLoggedIn) {
          const cartPayload: cartItems = {
            id: "", // backend generates
            productId: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productColor: product.productColor,
            productCategory: product.productCategory,
            productDescription: product.productDescription,
            productImageUrl: product.productImageUrl,
            productQuantity: product.productQuantity ?? 1,
            email: this.userEmail,
          };

          this.cartServ.AddToCart(cartPayload).subscribe({
            next: () => {
              // optional: show success message in UI instead of alert
              this.cartServ.emitCartCount();
              this.route.navigate(["/cart"]);
            },
            error: (err) => console.error("Error adding to cart:", err),
          });
        } else {
          // Guest user: pass email (can be empty string for guest)
          const res = this.cartServ.AddToCart_Local(product, this.userEmail);
          if (res) {
            this.cartServ.emitCartCount();
            this.route.navigate(["/cart"]);
          }
        }
      },
      error: (err) => console.error("Failed to fetch product details:", err),
    });
  }
}
