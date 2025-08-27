import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../schema/product';
import { ProductServiceService } from '../../services/product-service.service';
@Component({
  selector: 'app-home',
  imports: [NgbCarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  popularProducts: Product[] = [];
  trendyProducts: Product[] = [];
  constructor(private service: ProductServiceService) {}
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
}
