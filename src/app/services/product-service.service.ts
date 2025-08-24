import { Injectable } from '@angular/core';
import { Product } from '../schema/product';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  constructor(private httpClient: HttpClient) {}

  AddProduct(product: Product) {
    return this.httpClient.post<Product>(
      'http://localhost:3000/products',
      product,
      {
        observe: 'response',
      }
    );
  }
}
