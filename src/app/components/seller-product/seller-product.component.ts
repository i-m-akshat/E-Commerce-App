import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { Product } from '../../schema/product';
@Component({
  selector: 'app-seller-product',
  imports: [],
  templateUrl: './seller-product.component.html',
  styleUrl: './seller-product.component.css',
})
export class SellerProductComponent implements OnInit {
  products!: Product[];
  constructor(private service: ProductServiceService) {}
  ngOnInit() {
    // this.service.getProducts().subscribe((result: Product[]) => {
    //   if (result != null) {
    //     this.products = result;
    //     // this.products.forEach((element) => {
    //     //   console.log(element);
    //     // });
    //   }
    // });
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
  deleteProduct(id: string) {
    this.service.deleteProduct(id).subscribe((result) => {
      console.log(result);
      if (result != null) {
        alert('Deleted');
        this.reloadList();
      }
    });
  }
}
