import { EventEmitter, Injectable } from "@angular/core";
import { Product } from "../schema/product";
import { cartItems } from "../schema/cart";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable, tap } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartChanges: EventEmitter<number> = new EventEmitter<number>();

  constructor(private httpClient: HttpClient, private userServ: UserService) {}

  AddToCart_Local(productDetails: Product): boolean {
    let localCart: Product[] = this.GetCart_Local();
    if (!Array.isArray(localCart)) localCart = [];

    const existingProduct = localCart.find((p) => p.id === productDetails.id);
    if (existingProduct) {
      existingProduct.productQuantity =
        (existingProduct.productQuantity ?? 1) +
        (productDetails.productQuantity ?? 1);
    } else {
      productDetails.productQuantity = productDetails.productQuantity ?? 1;
      localCart.push(productDetails);
    }

    this.UpdateCart_Local(localCart);
    return true;
  }

  AddToCart(cart: cartItems): Observable<cartItems> {
    // Remove id if backend generates it

    const payload: Partial<cartItems> = { ...cart };
    delete payload.id;

    return this.httpClient
      .post<cartItems>("http://localhost:3000/cart", payload)
      .pipe(
        tap(() => {
          this.GetCart_Db().subscribe((cartItems) => {
            this.cartChanges.emit(cartItems.length);
          });
        })
      );
  }

  countCartItems_local(): number {
    const localCart = this.GetCart_Local();
    return Array.isArray(localCart) ? localCart.length : 0;
  }

  countCartItems_DB(): Observable<number> {
    return this.httpClient
      .get<cartItems[]>("http://localhost:3000/cart")
      .pipe(map((items) => items.length));
  }

  RemoveProduct_Local(id: string) {
    let cartProducts: Product[] = this.GetCart_Local();
    cartProducts = cartProducts.filter((p) => p.id !== id);
    this.UpdateCart_Local(cartProducts);
    alert("Removed");
  }

  RemoveProduct_DB(id: string): Observable<cartItems> {
    return this.httpClient.delete<cartItems>(
      "http://localhost:3000/cart/" + id
    );
  }

  GetCart_Local() {
    return JSON.parse(localStorage.getItem("cart") ?? "[]") as Product[];
  }

  GetCart_Db(): Observable<cartItems[]> {
    return this.httpClient.get<cartItems[]>("http://localhost:3000/cart");
  }

  UpdateCart_Local(cartProducts: Product[]): void {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
    this.emitCartCount();
  }

  emitCartCount() {
    this.userServ.getLoginStatus().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.countCartItems_DB().subscribe((result) => {
          this.cartChanges.emit(result);
        });
      } else {
        this.cartChanges.emit(this.countCartItems_local());
      }
    });
  }

  moveLocalToDb(email: string) {
    let localCartItems: Product[] = this.GetCart_Local();

    const requests = localCartItems.map(
      (item) =>
        this.AddToCart({
          productId: item.id, // set productId properly
          productName: item.productName,
          productPrice: item.productPrice,
          productColor: item.productColor,
          productCategory: item.productCategory,
          productDescription: item.productDescription,
          productImageUrl: item.productImageUrl,
          productQuantity: item.productQuantity ?? 1,
          email: email,
        } as cartItems) // cast to cartItems
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log("All items moved to DB", results);
        localStorage.removeItem("cart");
      },
      error: (err) => {
        console.error("Error moving cart items", err);
      },
    });
  }
}
