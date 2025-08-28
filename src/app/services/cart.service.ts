import { EventEmitter, Injectable } from "@angular/core";
import { Product } from "../schema/product";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartChanges: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  // AddToCart_Local(productDetails: Product): boolean {
  //   if (!localStorage.getItem("cart")) {
  //     localStorage.setItem("cart", JSON.stringify([productDetails]));
  //     return true;
  //   } else {
  //     var localCart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  //     if (!Array.isArray(localCart)) {
  //       localCart = [];
  //     }
  //     console.log(localCart);
  //     localCart.push(productDetails);
  //     localStorage.setItem("cart", JSON.stringify(localCart));
  //     return true;
  //   }
  // }
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

    // Always update localStorage and emit cart count
    this.UpdateCart_Local(localCart);

    return true;
  }

  countCartItems_local(): number {
    const localCart = this.GetCart_Local();
    return Array.isArray(localCart) ? localCart.length : 0;
  }
  RemoveProduct_Local(id: string) {
    // const cartStr = localStorage.getItem("cart");
    // if (cartStr) {
    // let cartProducts: Product[] = JSON.parse(cartStr);
    let cartProducts: Product[] = this.GetCart_Local();
    cartProducts = cartProducts.filter((p) => p.id !== id);
    this.UpdateCart_Local(cartProducts);
    alert("Removed");
    // }
    // this.countCartItems_local();
  }

  GetCart_Local() {
    return JSON.parse(localStorage.getItem("cart") ?? "[]") as Product[];
  }

  UpdateCart_Local(cartProducts: Product[]): void {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
    this.emitCartCount();
  }
  emitCartCount() {
    this.cartChanges.emit(this.countCartItems_local());
  }
}
