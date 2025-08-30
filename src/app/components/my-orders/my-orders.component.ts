import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { Order } from "../../schema/order";
import { NgOptimizedImage } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-my-orders",
  imports: [FontAwesomeModule],
  templateUrl: "./my-orders.component.html",
  styleUrl: "./my-orders.component.css",
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  faCartPlus = faCartPlus;
  constructor(private orderServ: OrderService) {}
  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("user") ?? "");
    if (user) {
      this.orderServ.getOrderList(user.id).subscribe((result: Order[]) => {
        this.orders = result;
      });
    }
  }
}
