import { Component, OnInit } from "@angular/core";
import { ProductServiceService } from "../../services/product-service.service";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../schema/product";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-product-details",
  imports: [FormsModule],
  templateUrl: "./product-details.component.html",
  styleUrl: "./product-details.component.css",
})
export class ProductDetailsComponent implements OnInit {
  productDetails: Product = {
    productCategory: "",
    productColor: "",
    productDescription: "",
    productImageUrl: "",
    productName: "",
    productPrice: 0,
    id: "",
  };
  quantity: number = 1;
  id: string | null = "";
  constructor(
    private service: ProductServiceService,
    private activeRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
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
}
