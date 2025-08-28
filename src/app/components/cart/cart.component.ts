import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Product } from "../../schema/product";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-cart",
  imports: [],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  subTotal: number = 0;
  shipping: number = 100; //by default
  total: number = 0;
  constructor(
    private userService: UserService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.userService.getLoginStatus().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
      } else {
        this.cartProducts = JSON.parse(localStorage.getItem("cart") ?? "[]");
      }
      this.CalculatePrice();
    });
  }
  RemoveProduct(id: string) {
    this.cartService.RemoveProduct_Local(id);
    this.cartProducts = JSON.parse(
      localStorage.getItem("cart") ?? "[]"
    ) as Product[];
    this.CalculatePrice();
  }

  decreaseQuantity(id: string) {
    let product = this.cartProducts.find((p) => p.id === id);
    if (product) {
      if (product.productQuantity === 1) {
        alert("quantity should not be 0");
      } else {
        product.productQuantity = product.productQuantity ?? 1;
        product.productQuantity -= 1;
        localStorage.setItem("cart", JSON.stringify(this.cartProducts));
      }
    }
    this.CalculatePrice();
  }
  increaseQuantity(id: string) {
    let product = this.cartProducts.find((p) => p.id === id);
    if (product) {
      if (product.productQuantity === 20) {
        alert("quantity should not be more than 20");
      } else {
        product.productQuantity = product.productQuantity ?? 1;
        product.productQuantity += 1;
        localStorage.setItem("cart", JSON.stringify(this.cartProducts));
      }
    }
    this.CalculatePrice();
  }
  CalculatePrice() {
    this.subTotal = 0;
    this.cartProducts.forEach((element) => {
      this.subTotal += element.productPrice * (element.productQuantity ?? 1);
    });
    this.total = this.subTotal + this.shipping;
  }
}
