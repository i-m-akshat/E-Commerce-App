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
  styleUrl: "./products.component.css",
})
export class ProductsComponent implements OnInit {
  products!: Product[];
  isUserLoggedIn: boolean = false;
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
          const user = JSON.parse(localStorage.getItem("user") ?? "{}");
          const email = user?.email ?? "";

          const cartPayload: cartItems = {
            id: "", // optional, backend generates
            productId: product.id, // backend expects productId
            productName: product.productName,
            productPrice: product.productPrice,
            productColor: product.productColor,
            productCategory: product.productCategory,
            productDescription: product.productDescription,
            productImageUrl: product.productImageUrl,
            productQuantity: product.productQuantity ?? 1,
            email: email,
          };

          this.cartServ.AddToCart(cartPayload).subscribe({
            next: () => {
              alert("Added to cart");
              this.cartServ.emitCartCount();
              this.route.navigate(["/cart"]);
            },
            error: (err) => {
              console.error("Error adding to cart:", err);
              alert("Failed to add to cart. Please try again.");
            },
          });
        } else {
          const res = this.cartServ.AddToCart_Local(product);
          if (res) {
            alert("Added to cart");
            this.cartServ.emitCartCount();
            this.route.navigate(["/cart"]);
          }
        }
      },
      error: (err) => {
        console.error("Failed to fetch product details:", err);
      },
    });
  }
}
