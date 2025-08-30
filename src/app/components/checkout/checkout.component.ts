import { Component, OnInit } from "@angular/core";
import { Form, FormsModule, NgForm } from "@angular/forms";
import { CartService } from "../../services/cart.service";
import { cartItems } from "../../schema/cart";
import { Order } from "../../schema/order";
import { UserService } from "../../services/user.service";
import { User } from "../../schema/user";
import { OrderService } from "../../services/order.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-checkout",
  imports: [FormsModule],
  standalone: true,
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent implements OnInit {
  cart: cartItems[] = [];
  shippingCost: number = 100;
  subTotal: number = 0;
  Total: number = 0;
  userId: number = 0;
  constructor(
    private cartServ: CartService,
    private userServ: UserService,
    private orderServ: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartServ.GetCart_Db().subscribe((result) => {
      if (result) {
        result.forEach((item) => {
          this.cart.push(item);
        });
        this.calculateCosting();
        this.getUserDetails();
      }
    });
  }

  calculateCosting() {
    if (this.cart.length > 0) {
      const total: number = this.cart.reduce((sum, item) => {
        sum = sum + item.productPrice * (item.productQuantity ?? 1);
        return sum;
      }, 0);
      this.subTotal = total;
      this.Total = this.subTotal + this.shippingCost;
    }
  }
  handleOrder(formValue: NgForm) {
    if (formValue.value) {
      let orderDetails: Order = {
        ...formValue.value,
        totalPrice: this.Total,
        userId: this.userId,
      };
      this.orderServ.orderNow(orderDetails).subscribe((result) => {
        if (result) {
          this.cart.forEach((item) => {
            this.cartServ
              .RemoveCartItems(Number(item.id))
              .subscribe((result) => {
                if (result) {
                  this.cartServ.emitCartCount();
                  alert("Ordered Successfully");
                  this.router.navigate(["/"]);
                }
              });
          });
        }
      });
    }
  }
  getUserDetails() {
    this.userServ.getLoginStatus().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem("user") ?? "");
        if (user) {
          this.userId = user.id;
        }
      }
    });
  }
}
