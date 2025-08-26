import { Component } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { Product } from '../../schema/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from '../../services/product-service.service';
@Component({
  selector: 'app-seller-product-update',
  imports: [FormsModule],
  templateUrl: './seller-product-update.component.html',
  styleUrl: './seller-product-update.component.css',
})
export class SellerProductUpdateComponent {
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
    private service: ProductServiceService,
    private rotuer: Router
  ) {}
  ngOnInit() {
    //getting the project here
    let productId = this.route.snapshot.paramMap.get('id');

    this.getProductByid(productId ? productId : '');
  }
  previewUrl: string = '';
  onUpdate(data: Product, form: Form) {}

  getProductByid(id: string) {
    this.service.getProductByID(id).subscribe((result: Product) => {
      this.product = result;
      console.log(this.product);
    });
  }
  updateProduct(id: string, product: Product) {
    this.service.updateProduct(id, product).subscribe((result: Product) => {
      console.log(result);
      if (result != null) {
        alert('Update successfull');
        this.rotuer.navigateByUrl('seller-product');
      }
    });
  }
}
