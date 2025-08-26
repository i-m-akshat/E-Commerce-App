import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../services/product-service.service';
import { Product } from '../../schema/product';
import { Router } from '@angular/router';
@Component({
  selector: 'app-seller-product-add',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './seller-product-add.component.html',
  styleUrl: './seller-product-add.component.css',
})
export class SellerProductAddComponent {
  constructor(private service: ProductServiceService, private router: Router) {}
  previewUrl: string = '';
  onSubmit(data: Product, productForm: any) {
    this.service.AddProduct(data).subscribe((result) => {
      if (result.body != null) {
        alert('product created');
        productForm.reset();
        this.previewUrl = '';
        this.router.navigateByUrl('seller-product');
      }
    });
  }
}
