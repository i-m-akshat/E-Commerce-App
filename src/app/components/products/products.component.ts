import { Component, OnInit } from "@angular/core";
import { ProductServiceService } from "../../services/product-service.service";
import { Product } from "../../schema/product";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-products",
  imports: [FontAwesomeModule],
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css",
})
export class ProductsComponent implements OnInit {
  products!: Product[];
  faEye = faEye;
  faCartShopping = faCartShopping;
  constructor(private service: ProductServiceService) {}
  ngOnInit() {
    this.reloadList();
  }
  reloadList() {
    this.service.getProducts().subscribe((result: Product[]) => {
      if (result != null) {
        this.products = result;
        // this.products.forEach((element) => {
        //   console.log(element);
        // });
      }
    });
  }
}
