import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seller } from '../../schema/seller';
import { Router, RouterLink } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-seller-auth',
  imports: [FormsModule, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent {
  authError: string = '';
  constructor(private sellerService: SellerService, private router: Router) {}
  seller: Seller = {
    name: '',
    email: '',
    password: '',
  };
  onSubmit = (data: Seller) => {
    this.sellerService.userSignUp(data).subscribe((result: any) => {
      if (result != null) {
        localStorage.setItem('seller', JSON.stringify(result.body));
        this.sellerService.setLoginStatus(true); //setting the behaviourial subject to true;
        this.router.navigateByUrl('seller-home');
      } else {
        this.authError = 'something went wrong';
        alert('something went wrong !');
      }
    });
    this.clearFields();
  };
  clearFields() {
    this.seller.email = '';
    this.seller.name = '';
    this.seller.password = '';
  }
}
