import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { UserService } from "../../services/user.service";
import { Product } from "../../schema/product";
import { cartItems } from "../../schema/cart";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = []; // local cart
  cartDb: cartItems[] = []; // DB cart
  subTotal: number = 0;
  shipping: number = 100;
  total: number = 0;
  userEmail: string = "";
  isUserLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getLoginStatus().subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
      this.userEmail = isLoggedIn ? this.userService.getUserEmail()! : "";

      if (isLoggedIn) {
        this.cartService.GetCart_Db().subscribe((result) => {
          this.cartDb = result;
          this.CalculatePrice();
        });
      } else {
        this.cartProducts = this.cartService.GetCart_Local(this.userEmail);
        this.CalculatePrice();
      }
    });
  }

  RemoveProduct(id: string) {
    if (this.isUserLoggedIn) {
      this.cartService.RemoveProduct_DB(id).subscribe(() => {
        this.cartDb = this.cartDb.filter((p) => p.id !== id);
        this.CalculatePrice();
        this.cartService.emitCartCount(this.userEmail);
      });
    } else {
      this.cartService.RemoveProduct_Local(id, this.userEmail);
      this.cartProducts = this.cartProducts.filter((p) => p.id !== id);
      this.CalculatePrice();
      this.cartService.emitCartCount(this.userEmail);
    }
  }

  decreaseQuantity(id: string) {
    if (this.isUserLoggedIn) {
      const product = this.cartDb.find((p) => p.productId === id);
      if (!product || (product.productQuantity ?? 1) <= 1) return;

      product.productQuantity!--;
      this.cartService.UpdateCart_DB(this.cartDb, this.userEmail);
    } else {
      const product = this.cartProducts.find((p) => p.id === id);
      if (!product || (product.productQuantity ?? 1) <= 1) return;

      product.productQuantity!--;
      this.cartService.UpdateCart_Local(this.cartProducts, this.userEmail);
    }

    this.CalculatePrice();
    this.cartService.emitCartCount(this.userEmail);
  }

  increaseQuantity(id: string) {
    if (this.isUserLoggedIn) {
      const product = this.cartDb.find((p) => p.productId === id);
      if (!product || (product.productQuantity ?? 1) >= 20) return;
      product.productQuantity!++;
      this.cartService.UpdateCart_DB(this.cartDb, this.userEmail);
    } else {
      const product = this.cartProducts.find((p) => p.id === id);
      if (!product || (product.productQuantity ?? 1) >= 20) return;

      product.productQuantity!++;
      this.cartService.UpdateCart_Local(this.cartProducts, this.userEmail);
    }

    this.CalculatePrice();
    this.cartService.emitCartCount(this.userEmail);
  }

  CalculatePrice() {
    if (this.isUserLoggedIn) {
      this.subTotal = this.cartDb.reduce(
        (sum, item) => sum + item.productPrice * (item.productQuantity ?? 1),
        0
      );
    } else {
      this.subTotal = this.cartProducts.reduce(
        (sum, item) => sum + item.productPrice * (item.productQuantity ?? 1),
        0
      );
    }
    this.total = this.subTotal + this.shipping;
  }

  navigateCheckout() {
    this.router.navigate(["checkout"]);
  }
}
