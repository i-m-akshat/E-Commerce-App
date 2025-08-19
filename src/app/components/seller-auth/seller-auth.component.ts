import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seller } from '../../schema/seller';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-seller-auth',
  imports: [FormsModule, CommonModule, RouterLink],
  standalone:true,
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  seller:Seller=new Seller();
onSubmit=(data:Seller)=>{
  console.warn(data);
  console.log("Submitted");
  this.clearFields();
}
clearFields(){
  this.seller.email='';
  this.seller.name='';
  this.seller.password='';
}
}
