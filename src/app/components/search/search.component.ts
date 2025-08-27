import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductServiceService } from "../../services/product-service.service";
import { Product } from "../../schema/product";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-search",
  imports: [FontAwesomeModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  query: string | null = "";
  faTrashCan = faTrashCan;
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  constructor(
    private route: ActivatedRoute,
    private service: ProductServiceService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.query = params.get("query");
      if (this.query != "" || this.query != null) {
        this.service
          .searchProduct(this.query ?? "")
          .subscribe((result: Product[]) => {
            this.products = result;
          });
      }
    });
  }
}
