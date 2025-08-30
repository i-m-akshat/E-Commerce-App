import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "../schema/order";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  orderNow(data: Order): Observable<Order> {
    return this.httpClient.post<Order>("http://localhost:3000/orders", data);
  }
  getOrderList(userId: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(
      "http://localhost:3000/orders?userId=" + userId
    );
  }
}
