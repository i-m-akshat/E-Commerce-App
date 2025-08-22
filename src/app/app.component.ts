import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Seller } from './schema/seller';
import { SellerService } from './services/seller.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'E-Commerce';
  constructor(private seller: SellerService) {}
  ngOnInit(): void {
    this.seller.reloadSeller();
  }
}
