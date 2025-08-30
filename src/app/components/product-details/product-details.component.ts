import { Component, OnInit } from "@angular/core";
import { ProductServiceService } from "../../services/product-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../schema/product";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";
import { cartItems } from "../../schema/cart";

@Component({
  selector: "app-product-details",
  imports: [FormsModule],
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  productDetails: Product = {
    productCategory: "",
    productColor: "",
    productDescription: "",
    productImageUrl: "",
    productName: "",
    productPrice: 0,
    id: "",
    productQuantity: undefined,
  };
  quantity: number = 1;
  id: string | null = "";

  constructor(
    private service: ProductServiceService,
    private activeRoute: ActivatedRoute,
    private userServ: UserService,
    private cartServ: CartService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.userServ.getLoginStatus().subscribe((status) => {
      this.isUserLoggedIn = status;
    });

    this.activeRoute.paramMap.subscribe((params) => {
      this.id = params.get("id");
      if (this.id) {
        this.service.getProductByID(this.id).subscribe((product) => {
          this.productDetails = product;
        });
      }
    });
  }

  increaseQuantity() {
    if (this.quantity < 20) {
      this.quantity += 1;
    } else {
      alert("Quantity should not exceed 20");
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    } else {
      alert("Quantity should not be less than 1");
    }
  }

  AddToCart() {
    if (!this.productDetails) return;

    const qty = this.quantity > 0 ? this.quantity : 1;
    this.productDetails.productQuantity = qty;

    if (this.isUserLoggedIn) {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      const email = user.email ?? "";

      const cartPayload: cartItems = {
        productId: this.productDetails.id,
        productName: this.productDetails.productName,
        productPrice: this.productDetails.productPrice,
        productColor: this.productDetails.productColor,
        productCategory: this.productDetails.productCategory,
        productDescription: this.productDetails.productDescription,
        productImageUrl: this.productDetails.productImageUrl,
        productQuantity: qty,
        email: email,
        id: "", // backend generates
      };

      this.cartServ.AddToCart(cartPayload).subscribe({
        next: () => {
          alert("Added to cart");
          this.cartServ.emitCartCount();
        },
        error: (err) => {
          console.error("Error adding to cart:", err);
          alert("Failed to add to cart. Please try again.");
        },
      });
    } else {
      // Guest / local cart: pass email (can be empty string)
      const guestEmail = ""; // or some logic to identify guest
      const res = this.cartServ.AddToCart_Local(
        this.productDetails,
        guestEmail
      );

      if (res) {
        alert("Added to cart");
        this.cartServ.emitCartCount();
        this.route.navigate(["/cart"]);
      }
    }
  }
}
