import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Seller, SellerLogin } from '../../schema/seller';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authError: string = '';
  constructor(private service: SellerService, private router: Router) {}
  sellerLog: Seller = {
    email: '',
    password: '',
    name: '',
  };

  clearFields() {
    this.sellerLog.email = '';
    this.sellerLog.password = '';
  }
  onLogin(data: SellerLogin) {
    this.service.userLogin(data).subscribe((result) => {
      if (result.body && result.body.length > 0) {
        console.log(result);
        alert('Login Successfull');
        localStorage.setItem('seller', JSON.stringify(result.body));
        this.service.setLoginStatus(true);
        this.router.navigateByUrl('seller-home');
      } else {
        this.authError = 'wrong credentials';
        alert('wrong credentials');
      }
    });
    this.clearFields();
  }
}
