import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // only what you need
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private sellerServ: SellerService) {}
  isSellerLoggedIn: boolean = false;
  //Anything that tries to use this before the constructor finishes (like calling a service).
  ngOnInit() {
    //this runs after angular is done constructing your class you can put only properties and methods without ngOninit but if u r setting some values by calling another service then you will be using ngOnit
    this.sellerServ.getLoginStatus().subscribe((status) => {
      this.isSellerLoggedIn = status;
    });
  }
}
