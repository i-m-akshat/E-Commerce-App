import { Component, OnInit } from "@angular/core";
import { ProductServiceService } from "../../services/product-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../schema/product";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-product-details",
  imports: [FormsModule],
  templateUrl: "./product-details.component.html",
  styleUrl: "./product-details.component.css",
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
    this.userServ.getLoginStatus().subscribe((IsLoggedin) => {
      this.isUserLoggedIn = IsLoggedin;
    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.id = params.get("id");
      //getting productdetails
      this.service
        .getProductByID(this.id ?? "")
        .subscribe((result: Product) => {
          this.productDetails = result;
        });
    });
  }
  increaseQuantity() {
    if (this.quantity != 20) {
      this.quantity += 1;
    } else {
      alert("quantity should not exceed 20");
    }
  }
  decreaseQuantity() {
    if (this.quantity != 1) {
      this.quantity -= 1;
    } else {
      alert("quantity should not be 0");
    }
  }
  AddToCart() {
    if (this.productDetails) {
      this.productDetails.productQuantity = this.quantity;

      if (this.isUserLoggedIn) {
        console.warn(this.productDetails);
      } else {
        var res = this.cartServ.AddToCart_Local(this.productDetails);
        if (res) {
          alert("Added To Cart");
          this.route.navigate(["/cart"]);
        }
      }
    }
  }
}
