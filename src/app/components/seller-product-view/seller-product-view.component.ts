import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../schema/product';

@Component({
  selector: 'app-seller-product-view',
  imports: [],
  templateUrl: './seller-product-view.component.html',
  styleUrl: './seller-product-view.component.css',
})
export class SellerProductViewComponent implements OnInit {
  productID: string = '';
  product: Product = {
    id: '',
    productName: '',
    productPrice: 0,
    productColor: '#000000',
    productCategory: '',
    productDescription: '',
    productImageUrl: '',
  };
  constructor(
    private route: ActivatedRoute,
    private service: ProductServiceService
  ) {
    this.productID = this.route.snapshot.paramMap.get('id') ?? '';
  }
  ngOnInit(): void {
    if (this.productID != '') {
      this.service
        .getProductByID(this.productID)
        .subscribe((result: Product) => {
          this.product = result;
        });
    }
  }
}
