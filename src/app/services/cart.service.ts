import { Injectable } from "@angular/core";
import { Product } from "../schema/product";
import { cartItems } from "../schema/cart";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable } from "rxjs";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { of } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CartService {
  // ---------------- Cart Count ----------------
  private cartCount = new BehaviorSubject<number>(0);
  cartChanges$ = this.cartCount.asObservable(); // Expose as observable

  constructor(private httpClient: HttpClient, private userServ: UserService) {}

  // ---------------- Local Cart ----------------
  AddToCart_Local(product: Product, email: string): boolean {
    let localCart: Product[] = this.GetCart_Local(email);
    if (!Array.isArray(localCart)) localCart = [];

    const existing = localCart.find((p) => p.id === product.id);
    if (existing) {
      existing.productQuantity =
        (existing.productQuantity ?? 1) + (product.productQuantity ?? 1);
    } else {
      product.productQuantity = product.productQuantity ?? 1;
      (product as any).email = email; // attach email for filtering
      localCart.push(product);
    }

    this.UpdateCart_Local(localCart, email);
    return true;
  }

  GetCart_Local(email: string): Product[] {
    email = "";
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]") as Product[];
    return cart.filter((item: any) => item.email === email);
  }

  UpdateCart_Local(cart: Product[], email: string): void {
    email = "";
    localStorage.setItem("cart", JSON.stringify(cart));
    this.emitCartCount(email);
  }
  UpdateCart_DB(cart: cartItems[], email: string): void {
    if (!cart || cart.length === 0) return;

    const requests = cart.map((item) =>
      this.httpClient
        .get<cartItems[]>(
          `http://localhost:3000/cart?productId=${item.productId}&email=${email}`
        )
        .pipe(
          map((existing) => {
            if (existing && existing.length > 0) {
              // Item exists → update quantity
              const updatedItem = {
                ...existing[0], // preserve id and DB metadata
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                productColor: item.productColor,
                productCategory: item.productCategory,
                productDescription: item.productDescription,
                productImageUrl: item.productImageUrl,
                productQuantity: item.productQuantity ?? 1,
                email: email,
              };
              this.httpClient
                .put<cartItems>(
                  `http://localhost:3000/cart/${existing[0].id}`,
                  updatedItem
                )
                .subscribe();
            } else {
              // Item does not exist → add new
              this.AddToCart({
                id: item.id,
                productId: item.id,
                productName: item.productName,
                productPrice: item.productPrice,
                productColor: item.productColor,
                productCategory: item.productCategory,
                productDescription: item.productDescription,
                productImageUrl: item.productImageUrl,
                productQuantity: item.productQuantity ?? 1,
                email: email,
              }).subscribe();
            }
          })
        )
    );

    forkJoin(requests).subscribe({
      next: () => {
        console.log("Cart synced with DB successfully");
        this.emitCartCount(email);
      },
      error: (err) => console.error("Error updating cart in DB", err),
    });
  }

  RemoveProduct_Local(id: string, email: string) {
    email = "";
    let cart: Product[] = this.GetCart_Local(email);
    cart = cart.filter((p) => p.id !== id);
    this.UpdateCart_Local(cart, email);
  }

  countCartItems_local(email: string): number {
    return this.GetCart_Local(email).length;
  }

  // ---------------- DB Cart ----------------
  AddToCart(cart: cartItems): Observable<cartItems> {
    const payload: Partial<cartItems> = { ...cart };
    delete payload.id;

    return this.httpClient
      .post<cartItems>("http://localhost:3000/cart", payload)
      .pipe(
        map((res) => {
          this.emitCartCount();
          return res;
        })
      );
  }

  RemoveProduct_DB(id: string): Observable<cartItems> {
    return this.httpClient
      .delete<cartItems>(`http://localhost:3000/cart/${id}`)
      .pipe(
        map((res) => {
          this.emitCartCount();
          return res;
        })
      );
  }

  GetCart_Db(): Observable<cartItems[]> {
    return this.httpClient.get<cartItems[]>("http://localhost:3000/cart");
  }

  countCartItems_DB(): Observable<number> {
    return this.GetCart_Db().pipe(map((items) => items.length));
  }

  // ---------------- Cart Count Handling ----------------
  emitCartCount(email: string = "") {
    this.userServ.getLoginStatus().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.countCartItems_DB().subscribe((count) =>
          this.cartCount.next(count)
        );
      } else {
        const localCount = this.countCartItems_local(email);
        this.cartCount.next(localCount);
      }
    });
  }

  // ---------------- Move Local to DB ----------------
  moveLocalToDb(email: string): Observable<any> {
    const localCart = this.GetCart_Local(email);
    console.warn(localCart.length + "is the lenght of local cart");
    if (localCart.length === 0) {
      return of(null); // nothing to move
    }

    const requests = localCart.map((item) =>
      this.AddToCart({
        productId: item.id,
        productName: item.productName,
        productPrice: item.productPrice,
        productColor: item.productColor,
        productCategory: item.productCategory,
        productDescription: item.productDescription,
        productImageUrl: item.productImageUrl,
        productQuantity: item.productQuantity ?? 1,
        email: email,
      } as cartItems)
    );

    return forkJoin(requests).pipe(
      map(() => {
        localStorage.removeItem("cart");
        this.emitCartCount(email);
        return true;
      })
    );
  }
}
