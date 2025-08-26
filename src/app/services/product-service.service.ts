import { Injectable } from '@angular/core';
import { Product } from '../schema/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: string): Observable<Product> {
    return this.httpClient.delete<Product>(
      `http://localhost:3000/products/${id}`
    );
  }
  getProductByID(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`http://localhost:3000/products/${id}`);
  }
  updateProduct(id: string, product: Product) {
    return this.httpClient.put<Product>(
      `http://localhost:3000/products/${id}`,
      product
    );
  }
  getPopularProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      'http://localhost:3000/products?_limit=3'
    );
  }
}
