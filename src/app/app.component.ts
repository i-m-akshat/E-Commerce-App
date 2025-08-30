import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SellerService } from "./services/seller.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, FontAwesomeModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title: string = "E-Commerce";
  constructor(private seller: SellerService) {}
}
