import { Component, OnInit } from "@angular/core";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { Product } from "../../schema/product";
import { ProductServiceService } from "../../services/product-service.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { CartService } from "../../services/cart.service";
@Component({
  selector: "app-home",
  imports: [NgbCarouselModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  popularProducts: Product[] = [];
  trendyProducts: Product[] = [];
  isUserLoggedIn: boolean = false;
  constructor(
    private service: ProductServiceService,
    private router: Router,
    private userServ: UserService,
    private cartServ: CartService
  ) {}
  ngOnInit() {
    this.service.getPopularProducts().subscribe((products: Product[]) => {
      products.forEach((item) => {
        this.popularProducts.push(item);
      });
    });
    this.service.getTrendyProducts().subscribe((result: Product[]) => {
      result.forEach((element) => {
        this.trendyProducts.push(element);
      });
    });
  }
  ViewProduct(id: string) {
    this.router.navigate(["product-details", id]);
  }
  AddToCart(id: string) {
    this.service.getProductByID(id).subscribe((result: Product) => {
      let productDetails: Product = result;
      if (productDetails) {
        productDetails.productQuantity = 1;

        if (this.isUserLoggedIn) {
          console.warn(productDetails);
        } else {
          var res = this.cartServ.AddToCart_Local(productDetails);
          if (res) {
            alert("Added To Cart");
            this.router.navigate(["/cart"]);
          }
        }
      }
    });
  }
}
